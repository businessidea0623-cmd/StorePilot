import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  X,
  AlertCircle,
} from 'lucide-react';
import type { ShipmentRecord } from '../../types/index.ts';
import { formatPKDateTime } from '../../utils/formatters.ts';

export const ShippingView: React.FC = () => {
  const { shipments, orders, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRecord | null>(null);

  const filtered = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.carrier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
          Shipping & Courier Tracking
        </h1>
        <p className="text-xs sm:text-sm text-[#455A64]">
          Real-time carrier milestone tracking across TCS Express, Leopards, Trax Logistics, PostEx, and M&P.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Parcels</div>
          <div className="text-2xl font-extrabold text-[#37474F] mt-1">{shipments.length}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Under courier custody</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">In Transit</div>
          <div className="text-2xl font-extrabold text-[#168BCE] mt-1">
            {shipments.filter((s) => s.status === 'in_transit').length}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5">En route to destination</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivered Safely</div>
          <div className="text-2xl font-extrabold text-[#16A34A] mt-1">
            {shipments.filter((s) => s.status === 'delivered').length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">POD verified</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Awaiting Carrier Pickup</div>
          <div className="text-2xl font-extrabold text-[#F59E0B] mt-1">
            {shipments.filter((s) => s.status === 'label_created').length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Manifest generated</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking #, carrier, order..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E10600]"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold">{filtered.length} active shipments</span>
      </div>

      {/* Shipments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((shp) => (
          <div
            key={shp.id}
            onClick={() => setSelectedShipment(shp)}
            className="group cursor-pointer rounded-2xl bg-white p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E10600] flex items-center justify-center font-bold text-xs">
                    <Truck size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-[#37474F] text-xs">{shp.carrier}</div>
                    <div className="font-mono text-[11px] text-gray-400">{shp.trackingNumber}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  shp.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  shp.status === 'in_transit' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {shp.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Linked Order:</span>
                  <span className="font-mono font-bold text-[#37474F]">{shp.orderNumber}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Customer:</span>
                  <span className="font-semibold text-[#37474F]">{shp.customerName}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Destination:</span>
                  <span className="text-[#37474F] truncate max-w-[150px]">{shp.destination}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                <Clock size={12} /> {shp.currentLocation}
              </span>
              <span className="text-[#E10600] font-bold group-hover:underline flex items-center gap-0.5">
                Timeline &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Shipment Detailed Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#37474F]">
                  Carrier Tracking: {selectedShipment.trackingNumber}
                </h3>
                <div className="text-xs text-gray-400">
                  {selectedShipment.carrier} &bull; Order {selectedShipment.orderNumber}
                </div>
              </div>
              <button onClick={() => setSelectedShipment(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Route visualization */}
            <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-[#37474F]">
                <span>{selectedShipment.origin}</span>
                <span className="text-[#E10600]">&rarr;</span>
                <span>{selectedShipment.destination}</span>
              </div>
              <div className="text-gray-500 text-[11px]">
                Current Milestone: <strong className="text-emerald-700">{selectedShipment.currentLocation}</strong>
              </div>
            </div>

            {/* Tracking Events timeline */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-gray-400 tracking-wider">Courier Scans & Proof of Delivery</div>
              <div className="space-y-3 border-l-2 border-emerald-500 pl-4 ml-2">
                {selectedShipment.events.map((ev, idx) => (
                  <div key={idx} className="relative pb-2">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                    <div className="text-xs font-bold text-[#37474F]">{ev.status}</div>
                    <div className="text-[11px] text-gray-500">{ev.details} &bull; {ev.location}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{formatPKDateTime(ev.timestamp)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedShipment(null)}
                className="px-4 py-2 rounded-xl bg-[#37474F] text-white text-xs font-bold"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
