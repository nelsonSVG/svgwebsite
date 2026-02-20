'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Users, Briefcase, MessageSquare, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    projects: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [leadsRes, projectsRes, testimonialsRes] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        leads: leadsRes.count || 0,
        projects: projectsRes.count || 0,
        testimonials: testimonialsRes.count || 0
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Leads', value: stats.leads, icon: Users, color: 'text-blue-500' },
    { name: 'Proyectos', value: stats.projects, icon: Briefcase, color: 'text-purple-500' },
    { name: 'Testimonios', value: stats.testimonials, icon: MessageSquare, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h2>
        <p className="text-zinc-400">Aquí tienes un resumen de tu portafolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                  <p className="text-3xl font-bold mt-1">{loading ? '...' : stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-zinc-800 ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="text-blue-500" size={20} />
          <h3 className="text-xl font-semibold">Actividad Reciente</h3>
        </div>
        <p className="text-zinc-400 italic">
          Los leads más recientes aparecerán aquí una vez que los clientes interactúen con tu asistente IA.
        </p>
      </div>
    </div>
  );
}
