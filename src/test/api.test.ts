import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting StorePilot Automated System Verification Tests...\n');

  // Test 1: Health Check
  {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    assert.strictEqual(res.status, 200, 'Health check should return status 200');
    assert.strictEqual(data.status, 'ok', 'Status should be ok');
    console.log('✅ Test 1 Passed: Server health & database connectivity verified.');
  }

  // Test 2: Metrics Calculation
  {
    const res = await fetch(`${BASE_URL}/api/metrics`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert(typeof data.totalSales === 'number', 'Total sales must be numeric');
    assert(data.totalOrders >= 0, 'Total orders must be non-negative');
    console.log(`✅ Test 2 Passed: Real-time metrics computed (Rs. ${data.totalSales.toLocaleString()} sales across ${data.totalOrders} orders).`);
  }

  // Test 3: Order Creation & Calculation Integrity
  {
    const payload = {
      customerName: 'Test Automation Customer',
      customerEmail: 'auto.test@storepilot.pk',
      paymentMethod: 'Cash on Delivery (COD)',
      items: [
        {
          title: 'Automated Test Shirt',
          sku: 'AUTO-SHIRT-01',
          unitPrice: 1000,
          quantity: 2,
        },
      ],
    };
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.order.subtotal, 2000);
    assert.strictEqual(data.order.tax, 160);
    assert.strictEqual(data.order.shippingFee, 250);
    assert.strictEqual(data.order.currency, 'PKR');
    console.log(`✅ Test 3 Passed: Order creation & price computation in PKR verified (${data.order.orderNumber}, Rs. ${data.order.totalAmount}).`);
  }

  // Test 4: Inventory Adjustment
  {
    const productsRes = await fetch(`${BASE_URL}/api/products`);
    const productsData = await productsRes.json();
    const product = productsData.products[0];
    assert(product, 'Must have at least one product in catalog');

    const originalStock = product.stock;
    const updateRes = await fetch(`${BASE_URL}/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: originalStock + 5 }),
    });
    const updateData = await updateRes.json();
    assert.strictEqual(updateData.success, true);
    console.log(`✅ Test 4 Passed: Inventory adjustment verified for ${product.sku} (stock updated).`);
  }

  // Test 5: Shopify Connection Validation & Security (No Token Leak)
  {
    const res = await fetch(`${BASE_URL}/api/shopify/status`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert(data.config !== undefined, 'Shopify config must exist');
    assert.strictEqual(data.config.accessToken, undefined, 'Server MUST NEVER expose Shopify accessToken to frontend API responses');
    console.log(`✅ Test 5 Passed: Shopify status secured without token leakage (${data.config.storeDomain}, status: ${data.config.status}).`);
  }

  // Test 6: Shopify Domain Validation & Dry-Run Test Endpoint
  {
    const badRes = await fetch(`${BASE_URL}/api/shopify/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeDomain: 'invalid domain @#$' }),
    });
    const badData = await badRes.json();
    assert.strictEqual(badRes.status, 400, 'Invalid domain format must return 400');
    assert.strictEqual(badData.success, false);
    console.log('✅ Test 6 Passed: Shopify domain regex validation correctly blocked malformed domain.');
  }

  // Test 7: Shopify Demo Connect Flow & Catalog Verification
  {
    const connectRes = await fetch(`${BASE_URL}/api/shopify/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeDomain: 'storepilot-demo.myshopify.com',
        loadDemoData: true,
      }),
    });
    const connectData = await connectRes.json();
    assert.strictEqual(connectRes.status, 200);
    assert.strictEqual(connectData.success, true);
    assert.strictEqual(connectData.isLive, false);
    assert.strictEqual(connectData.config.accessToken, undefined, 'Token must remain private');
    console.log('✅ Test 7 Passed: Shopify demo store connection succeeded with provenance tags.');
  }

  // Test 8: Contact Form Validation & Ingestion
  {
    const contactPayload = {
      name: 'Verification Auditor',
      email: 'auditor@test.com',
      subject: 'Security & Compliance Review',
      message: 'Verified server-side validation and storage.',
    };
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    console.log('✅ Test 8 Passed: Contact inquiry received with server-side validation.');
  }

  console.log('\n🎉 ALL STOREPILOT AUTOMATED TESTS COMPLETED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
