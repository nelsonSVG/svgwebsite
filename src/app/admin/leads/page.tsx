'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, Mail, Phone, Tag, CheckCircle2, Clock } from 'lucide-react';

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Prospectos (Leads)</h2>
        <p className="text-zinc-400">Personas que han contactado a través del asistente IA.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-zinc-500">Cargando prospectos...</p>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">Aún no has recibido ningún lead.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold">{lead.full_name || 'Sin nombre'}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      lead.lead_status === 'closed' ? 'bg-green-500/10 text-green-500' :
                      lead.lead_status === 'qualified' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {lead.lead_status}
                    </span>
                  </div>
                  <div className="text-zinc-400 font-medium">{lead.brand_name}</div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
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
                    className="p-2 hover:bg-zinc-900 rounded-lg text-blue-500 transition-colors"
                    title="Marcar como calificado"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button 
                    onClick={() => updateStatus(lead.id, 'closed')}
                    className="p-2 hover:bg-zinc-900 rounded-lg text-green-500 transition-colors"
                    title="Marcar como cerrado"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button 
                    onClick={() => updateStatus(lead.id, 'in_progress')}
                    className="p-2 hover:bg-zinc-900 rounded-lg text-yellow-500 transition-colors"
                    title="Marcar como pendiente"
                  >
                    <Clock size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <Tag size={12} />
                    <span>Servicio & Proyecto</span>
                  </div>
                  <p className="text-sm">
                    {lead.service_type} - {lead.project_type}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <span>Resumen del Brief</span>
                  </div>
                  <p className="text-sm text-zinc-300">
                    {lead.summary_brief || lead.objective || 'Sin detalles adicionales.'}
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
