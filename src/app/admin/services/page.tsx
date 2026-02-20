'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Layout } from 'lucide-react';

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) setServices(data || []);
    setLoading(false);
  }

  async function deleteService(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;

    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      setServices(services.filter(s => s.id !== id));
    } else {
      alert('Error al eliminar: ' + error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Servicios</h2>
          <p className="text-zinc-400">Gestiona los servicios que ofreces en la web.</p>
        </div>
        <Link 
          href="/admin/services/new"
          className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Servicio</span>
        </Link>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Servicio</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Descripción</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Icono</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                  Cargando servicios...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                  No hay servicios creados aún.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{service.title}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 max-w-xs truncate">
                    {service.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs flex items-center gap-2 w-fit">
                      <Layout size={14} />
                      {service.icon_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link 
                      href={`/admin/services/edit/${service.id}`}
                      className="inline-block text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
