'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, Mail, Phone, Tag, CheckCircle2, Clock, Trash2, Archive, Star } from 'lucide-react';

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'qualified' | 'archived'>('pending');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setLeads(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('leads')
      .update({ lead_status: status })
      .eq('id', id);

    if (!error) {
      setLeads(leads.map(l => l.id === id ? { ...l, lead_status: status } : l));
    }
  }

  async function deleteLead(id: string) {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) setLeads(leads.filter(l => l.id !== id));
  }

  async function deleteAllLeads() {
    if (!confirm(`CRITICAL: Are you sure you want to delete ALL ${activeTab} leads? This cannot be undone.`)) return;
    
    let query = supabase.from('leads').delete();
    
    if (activeTab === 'archived') {
      query = query.eq('lead_status', 'closed');
    } else if (activeTab === 'qualified') {
      query = query.eq('lead_status', 'qualified');
    } else {
      query = query.not('lead_status', 'in', '("closed", "qualified")');
    }

    const { error } = await query;
    if (!error) {
      if (activeTab === 'archived') {
        setLeads(leads.filter(l => l.lead_status !== 'closed'));
      } else if (activeTab === 'qualified') {
        setLeads(leads.filter(l => l.lead_status !== 'qualified'));
      } else {
        setLeads(leads.filter(l => l.lead_status === 'closed' || l.lead_status === 'qualified'));
      }
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (activeTab === 'archived') return lead.lead_status === 'closed';
    if (activeTab === 'qualified') return lead.lead_status === 'qualified';
    return lead.lead_status !== 'closed' && lead.lead_status !== 'qualified';
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-syne">Leads Management</h2>
          <p className="text-zinc-400 font-poppins">Manage potential clients from your AI Assistant.</p>
        </div>
        <button 
          onClick={deleteAllLeads}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg transition-all text-sm font-bold border border-red-500/20 font-poppins"
        >
          <Trash2 size={16} />
          Delete All {activeTab}
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-zinc-900/50 border border-zinc-800 rounded-xl w-fit">
        {(['pending', 'qualified', 'archived'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize font-poppins ${
              activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-zinc-500 font-poppins">Loading leads...</p>
        ) : filteredLeads.length === 0 ? (
          <div className="p-20 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 font-medium font-poppins">No {activeTab} leads found.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div key={lead.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold font-syne">{lead.full_name || 'No name'}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium font-poppins ${
                      lead.lead_status === 'closed' ? 'bg-green-500/10 text-green-500' :
                      lead.lead_status === 'qualified' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {lead.lead_status}
                    </span>
                  </div>
                  <div className="text-zinc-400 font-medium font-poppins">{lead.brand_name}</div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-zinc-400 font-poppins">
                  <div className="flex items-center space-x-1">
                    <Mail size={16} />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone size={16} />
                    <span>{lead.whatsapp}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateStatus(lead.id, 'qualified')}
                    className={`p-2 hover:bg-zinc-900 rounded-lg transition-colors ${lead.lead_status === 'qualified' ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-500'}`}
                    title="Mark as Qualified"
                  >
                    <Star size={20} fill={lead.lead_status === 'qualified' ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={() => updateStatus(lead.id, 'closed')}
                    className={`p-2 hover:bg-zinc-900 rounded-lg transition-colors ${lead.lead_status === 'closed' ? 'text-green-400 bg-green-500/10' : 'text-zinc-500'}`}
                    title="Archive Lead (Closed)"
                  >
                    <Archive size={20} />
                  </button>
                  <button 
                    onClick={() => deleteLead(lead.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                    title="Delete Lead"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-zinc-500 uppercase tracking-wider font-poppins">
                    <Tag size={12} />
                    <span>Service & Project</span>
                  </div>
                  <p className="text-sm font-poppins">
                    {lead.service_type} - {lead.project_type}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-zinc-500 uppercase tracking-wider font-poppins">
                    <span>Brief Summary</span>
                  </div>
                  <p className="text-sm text-zinc-300 font-poppins">
                    {lead.summary_brief || lead.objective || 'No additional details.'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}