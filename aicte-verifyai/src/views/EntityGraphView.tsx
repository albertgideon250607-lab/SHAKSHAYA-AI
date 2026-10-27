import React, { useState } from 'react';
import { GitBranch, Building2, MapPin, CreditCard, Shield, FileCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EntityGraphView: React.FC = () => {
  const { currentApp, setActiveTab } = useApp();
  const [selectedNode, setSelectedNode] = useState<string | null>('node-institution');

  if (!currentApp) return null;

  const terDoc = currentApp.documents.find((d) => d.category === 'ter_receipt');
  const terInst = terDoc?.extractedFields?.institutionName || 'Unknown';
  const hasMismatch = terInst.toLowerCase() !== currentApp.institutionName.toLowerCase();

  const nodes = [
    {
      id: 'node-institution',
      label: currentApp.institutionName,
      type: 'Core Institutional Profile',
      icon: Building2,
      color: 'border-blue-500 bg-blue-50/60 text-blue-950',
      details: `Permanent Institute ID: ${currentApp.instituteId} · Academic Year: ${currentApp.academicYear} · Status: ${currentApp.status}`,
    },
    {
      id: 'node-trust',
      label: 'ABC Educational & Research Foundation',
      type: 'Sponsoring Trust / Society',
      icon: Shield,
      color: 'border-slate-300 bg-slate-50 text-slate-800',
      details: 'Registered Society No: S/1998/4410 · Reg Year: 1998 · Chairman: Dr. Arvind S. Sharma',
    },
    {
      id: 'node-land',
      label: 'Plot No 42, Kasna (10.5 Acres)',
      type: 'Geo-Spatial Perimeter Polygon',
      icon: MapPin,
      color: 'border-emerald-300 bg-emerald-50/50 text-emerald-950',
      details: 'Coordinates: 28.4682 N, 77.4984 E · Bhuvan GIS Verified · Single Contiguous Parcel',
    },
    {
      id: 'node-ter',
      label: `TER Receipt (${terInst})`,
      type: 'Payment Challan Entity',
      icon: CreditCard,
      color: hasMismatch
        ? 'border-amber-400 bg-amber-50 text-amber-950 ring-2 ring-amber-400/40'
        : 'border-emerald-400 bg-emerald-50 text-emerald-950',
      details: hasMismatch
        ? `ALERT: Conflicting institution "${terInst}" extracted from TER challan. Expected: "${currentApp.institutionName}".`
        : `Verified matching institution payment: Rs. 2,00,000/- cleared via Bharatkosh.`,
    },
    {
      id: 'node-fire',
      label: 'Fire NOC: UPFS/NOC/2025/1109',
      type: 'Life Safety Regulatory Entity',
      icon: FileCheck,
      color: 'border-slate-300 bg-slate-50 text-slate-800',
      details: 'Validity: 01-Jan-2025 to 31-Dec-2027 · NBC 2016 Part IV Compliant · State Fire Dept.',
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs">
        <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
          Knowledge Graph Analysis
        </div>
        <h2 className="text-xl font-bold text-[#0A192F]">
          Cross-Document Entity Relationship Graph
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Maps institutional identities, land parcels, legal trusts, and payment challans to detect discrepancies and ghost campuses.
        </p>
      </div>

      {/* Visual Canvas Representation */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-xs">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Entity Network Visualization</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {hasMismatch ? '1 Reconciliation Conflict Flagged' : 'All 5 Entities Synchronized'}
          </span>
        </div>

        {/* Graph Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-4 rounded border text-left cursor-pointer transition-all ${node.color} ${
                  isSelected ? 'shadow-md scale-[1.02]' : 'hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded bg-white/80 border border-slate-200 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  {node.id === 'node-ter' && hasMismatch ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded uppercase">
                      MISMATCH
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      LINKED
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs truncate">{node.label}</div>
                <div className="text-[11px] opacity-75 mt-0.5">{node.type}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Inspector */}
        <div className="mt-6 p-4 rounded bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-900 text-sm">{activeNodeData.label}</span>
            <span className="text-[11px] text-slate-500 font-mono">{activeNodeData.type}</span>
          </div>
          <p className="text-slate-700 leading-relaxed mt-1">{activeNodeData.details}</p>

          {activeNodeData.id === 'node-ter' && hasMismatch && (
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-amber-800 font-medium">
                Conflicting institution name flagged in TER receipt.
              </span>
              <button
                onClick={() => setActiveTab('rectify_reupload')}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold"
              >
                Rectify TER Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
