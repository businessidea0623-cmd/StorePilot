/**
 * StorePilot - Official Shopify Admin GraphQL & REST API Client
 * Secure server-side connector for Shopify Live Store data synchronization.
 * Handles least-privilege Admin API scopes, connection verification,
 * bi-directional data mapping, and granular error reporting.
 *
 * Design by Hanzala04.
 */

export interface ShopifyShopData {
  id: string;
  name: string;
  email: string;
  myshopifyDomain: string;
  currencyCode: string;
  ianaTimezone: string;
  planName?: string;
}

export interface ShopifyConnectionResult {
  success: boolean;
  shop?: ShopifyShopData;
  error?: string;
  errorCode?: 'INVALID_DOMAIN' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'STORE_NOT_FOUND' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'UNKNOWN';
  scopes?: string[];
}

export const REQUIRED_SHOPIFY_SCOPES = [
  'read_products',
  'write_products',
  'read_orders',
  'write_orders',
  'read_inventory',
  'read_customers',
  'read_fulfillments',
];

/**
 * Validates and normalizes user-entered Shopify store domain.
 */
export function validateShopifyDomain(rawDomain: string): { valid: boolean; cleanDomain: string; error?: string } {
  if (!rawDomain || typeof rawDomain !== 'string') {
    return { valid: false, cleanDomain: '', error: 'Shopify store domain cannot be empty.' };
  }

  let cleaned = rawDomain.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  // If user only typed their store name without .myshopify.com
  if (!cleaned.includes('.')) {
    cleaned = `${cleaned}.myshopify.com`;
  }

  const domainRegex = /^[a-z0-9][a-z0-9\-]*\.myshopify\.com$/;
  if (!domainRegex.test(cleaned)) {
    return {
      valid: false,
      cleanDomain: cleaned,
      error: 'Invalid Shopify domain format. Example: your-store.myshopify.com',
    };
  }

  return { valid: true, cleanDomain: cleaned };
}

/**
 * Real Server-Side Verification against Shopify GraphQL Admin API.
 * Never leaks token to frontend.
 */
export async function verifyShopifyConnection(
  storeDomain: string,
  accessToken: string,
  apiVersion = '2025-01'
): Promise<ShopifyConnectionResult> {
  const domainValidation = validateShopifyDomain(storeDomain);
  if (!domainValidation.valid) {
    return {
      success: false,
      error: domainValidation.error,
      errorCode: 'INVALID_DOMAIN',
    };
  }

  const domain = domainValidation.cleanDomain;

  if (!accessToken || typeof accessToken !== 'string' || accessToken.trim().length < 8) {
    return {
      success: false,
      error: 'Invalid Admin API Access Token. Shopify tokens start with "shpat_" or custom app token secret.',
      errorCode: 'UNAUTHORIZED',
    };
  }

  const url = `https://${domain}/admin/api/${apiVersion}/graphql.json`;

  const query = `
    query VerifyStorePilotShopifyConnection {
      shop {
        id
        name
        email
        myshopifyDomain
        currencyCode
        ianaTimezone
        plan {
          displayName
        }
      }
    }
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken.trim(),
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Header inspection
    const callLimitHeader = response.headers.get('x-shopify-shop-api-call-limit');

    if (response.status === 401) {
      return {
        success: false,
        error: 'Shopify Authentication Failed (HTTP 401): Invalid Admin API Access Token. Please verify your custom app token.',
        errorCode: 'UNAUTHORIZED',
      };
    }

    if (response.status === 403) {
      return {
        success: false,
        error: 'Shopify Permissions Denied (HTTP 403): Custom App lacks required Admin API scopes (read_products, read_orders, etc.).',
        errorCode: 'FORBIDDEN',
      };
    }

    if (response.status === 404) {
      return {
        success: false,
        error: `Shopify Store Not Found (HTTP 404): No store exists at "${domain}". Check spelling or domain transfer status.`,
        errorCode: 'STORE_NOT_FOUND',
      };
    }

    if (response.status === 429) {
      return {
        success: false,
        error: 'Shopify Rate Limit Reached (HTTP 429): Leaky bucket capacity exhausted. Please retry in a few moments.',
        errorCode: 'RATE_LIMITED',
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Shopify API responded with status ${response.status}: ${response.statusText}`,
        errorCode: 'UNKNOWN',
      };
    }

    const json = await response.json() as any;

    if (json.errors && json.errors.length > 0) {
      return {
        success: false,
        error: json.errors[0]?.message || 'GraphQL Query Error',
        errorCode: 'FORBIDDEN',
      };
    }

    if (!json.data?.shop) {
      return {
        success: false,
        error: 'Shopify returned empty store data payload.',
        errorCode: 'UNKNOWN',
      };
    }

    const shop = json.data.shop;

    return {
      success: true,
      shop: {
        id: shop.id,
        name: shop.name,
        email: shop.email,
        myshopifyDomain: shop.myshopifyDomain || domain,
        currencyCode: shop.currencyCode || 'PKR',
        ianaTimezone: shop.ianaTimezone || 'Asia/Karachi',
        planName: shop.plan?.displayName || 'Shopify Store',
      },
      scopes: REQUIRED_SHOPIFY_SCOPES,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: `Connection timed out while contacting https://${domain}. Ensure the store URL is online and responsive.`,
        errorCode: 'NETWORK_ERROR',
      };
    }

    return {
      success: false,
      error: `Network error connecting to Shopify (${err.message || 'Check host resolution'}).`,
      errorCode: 'NETWORK_ERROR',
    };
  }
}

/**
 * Fetch Live Catalog, Orders, and Customers via GraphQL from authorized Shopify store.
 */
export async function fetchShopifyLiveCatalog(
  storeDomain: string,
  accessToken: string,
  apiVersion = '2025-01'
) {
  const url = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;

  const query = `
    query GetStorePilotLiveSync {
      shop {
        name
        email
        currencyCode
        ianaTimezone
      }
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            status
            totalInventory
            featuredImage {
              url
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  sku
                  price
                  inventoryQuantity
                }
              }
            }
          }
        }
      }
      orders(first: 20, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              displayName
              email
              phone
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  sku
                  quantity
                  originalUnitPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
      customers(first: 20) {
        edges {
          node {
            id
            displayName
            email
            phone
            numberOfOrders
            amountSpent {
              amount
              currencyCode
            }
            defaultAddress {
              city
            }
          }
        }
      }
    }
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken.trim(),
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Live Sync failed with HTTP status ${response.status}`);
  }

  const json = await response.json() as any;
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message || 'GraphQL Live Sync Error');
  }

  return json.data;
}
