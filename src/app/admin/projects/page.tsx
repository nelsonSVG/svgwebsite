'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProjects(data || []);
    setLoading(false);
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    } else {
      alert('Error al eliminar: ' + error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
        <h2 className="text-3xl font-bold tracking-tight font-syne">Projects</h2>
        <p className="text-zinc-400 font-poppins">Manage the projects displayed in your portfolio.</p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus size={20} />
          <span>New Project</span>
        </Link>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left font-poppins">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Title</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Category</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Client</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                  Loading projects...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                  No projects created yet.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{project.title}</div>
                    <div className="text-xs text-zinc-500">{project.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">
                      {project.category_label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {project.client}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link 
                      href={`/projects/${project.id}`} 
                      target="_blank"
                      className="inline-block text-zinc-400 hover:text-white transition-colors"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <Link 
                      href={`/admin/projects/edit/${project.id}`}
                      className="inline-block text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button 
                      onClick={() => deleteProject(project.id)}
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
