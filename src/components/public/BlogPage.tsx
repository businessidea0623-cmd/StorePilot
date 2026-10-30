import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Calendar, User, Clock, ArrowRight, Tag, X } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
  content: string[];
}

export const BlogPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 'blog_1',
      title: 'How to Prevent COD Remittance Leaks Across Multi-Courier Deliveries',
      excerpt: 'Cash On Delivery represents over 40% of orders in emerging markets, but delayed courier settlement creates acute working capital strain. Here is our operational playbook.',
      category: 'Finance & COD',
      readTime: '6 min read',
      date: 'October 18, 2026',
      author: 'Marcus Brody, Head of Logistics',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
      content: [
        'When an e-commerce order is shipped via Cash on Delivery, the retailer takes on courier transit risk before funds are collected. The biggest headache occurs not during delivery, but during reconciliation.',
        'Typically, couriers like Blue Dart, Shiprocket, and Delhivery disburse collected funds in batch remittances weekly or bi-weekly. Without automated order-to-remittance reconciliation, merchants often miss up to 3% to 7% of uncollected payments.',
        'StorePilot matches every manifest tracking number against courier payout spreadsheets line by line. If a package is marked delivered but no payment is logged within 7 days, an automated escalation flag is raised.',
      ],
    },
    {
      id: 'blog_2',
      title: 'Shopify GraphQL Admin API: Migrating from REST for Zero-Latency Inventory Sync',
      excerpt: 'Why Shopify is deprecating REST endpoints in favor of GraphQL, and how bi-directional bulk queries prevent stockout errors during flash sales.',
      category: 'Engineering & Shopify',
      readTime: '8 min read',
      date: 'October 12, 2026',
      author: 'StorePilot Core Team',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      content: [
        'High-velocity brands processing hundreds of orders per hour quickly hit REST rate limits (40 requests bucket refill). Shopify GraphQL Admin API allows batch mutations and bulk operational queries.',
        'With StorePilot, we subscribe to inventory_levels/update and orders/create webhooks while utilizing cursor-based pagination to guarantee zero duplicated records.',
        'This architectural shift guarantees that when an item is bought in your warehouse POS or Amazon storefront, your Shopify inventory updates within sub-second thresholds.',
      ],
    },
    {
      id: 'blog_3',
      title: 'Turning E-Commerce Returns into Repeat Customers: A Reverse Logistics Blueprint',
      excerpt: 'Returns do not have to be a net loss. Learn how structured return reasons, fast quality inspection, and store credit swaps improve retention by 28%.',
      category: 'Customer Experience',
      readTime: '5 min read',
      date: 'September 29, 2026',
      author: 'Chloe Sullivan, Support Lead',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      content: [
        'Standard e-commerce return workflows take an average of 14 days between customer request and refund issue. This creates anxious customers and stagnant warehouse inventory.',
        'By automating the return portal, customers immediately receive pre-paid return manifests. Once the parcel is scanned by the courier, StorePilot notifies the warehouse intake team.',
        'Upon a 60-second inspection check, automated restock occurs and instant store credit or gateway refunds are issued, reducing support tickets by 45%.',
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-dots-pattern border-b border-[#E5E7EB] py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#E10600] border border-red-200 text-xs font-bold uppercase tracking-wider">
            Operational Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#37474F] tracking-tight">
            The StorePilot E-Commerce Blog
          </h1>
          <p className="text-lg text-[#455A64] max-w-2xl mx-auto">
            Practical strategies, technical deep-dives, and logistics playbooks from experienced retail operators.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="group cursor-pointer rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-[#37474F] text-xs font-bold shadow-sm">
                    {art.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#37474F] group-hover:text-[#E10600] transition-colors leading-snug mb-3">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#455A64] leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#37474F] group-hover:text-[#E10600]">
                <span>Read article</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-red-50 text-[#E10600] text-xs font-bold">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              <h2 className="text-2xl font-extrabold text-[#37474F] leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-gray-400 border-b border-gray-100 pb-4">
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-56 object-cover rounded-xl"
              />

              <div className="space-y-4 text-sm text-[#455A64] leading-relaxed">
                {selectedArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">Want to test these workflows in action?</span>
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  setCurrentRoute('dashboard');
                }}
                className="px-4 py-2 rounded-lg bg-[#E10600] text-white text-xs font-bold hover:bg-[#B80500]"
              >
                Open Demo Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
