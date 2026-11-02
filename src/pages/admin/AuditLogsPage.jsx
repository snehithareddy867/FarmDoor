import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  User,
  Layers,
  Terminal,
  Calendar,
  X
} from 'lucide-react';
import { api } from '../../services/api';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const categories = [
    'All',
    'Authentication',
    'Farmer Management',
    'Customer Management',
    'Delivery Management',
    'Product Moderation',
    'Taxonomy & Catalog',
    'Order Dispatch',
    'Financial Settlements',
    'Customer Support',
    'Platform Settings'
  ];

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (log.actor || '').toLowerCase().includes(term) ||
      (log.action || '').toLowerCase().includes(term) ||
      (log.target || '').toLowerCase().includes(term) ||
      (log.details || '').toLowerCase().includes(term);

    let matchesCategory = true;
    if (categoryFilter !== 'All') {
      matchesCategory = (log.category || '').toLowerCase() === categoryFilter.toLowerCase();
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-emerald-400" />
            Security Audit Trail & Governance Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable transaction records capturing all administrative interventions, approvals, suspensions, and configuration shifts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Audit Records:</span>
          <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {logs.length} Logged Events
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs by actor, action type, affected target, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Audit Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp & IP</th>
                <th className="py-3.5 px-4">Administrator Actor</th>
                <th className="py-3.5 px-4">Action Code</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Target Record</th>
                <th className="py-3.5 px-4">Intervention Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No audit records match the search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="text-white font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.ip || '192.168.1.101'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{log.actor}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.actorEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {log.category}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-white text-[11px]">
                      {log.target}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-xs leading-relaxed max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

