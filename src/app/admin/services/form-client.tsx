'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Layout, Save, X } from 'lucide-react';

export default function ServiceForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'layout'
  });

  useEffect(() => {
    if (isEditing) {
      fetchService();
    }
  }, [id]);

  async function fetchService() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setFormData({
        title: data.title,
        description: data.description || '',
        icon_name: data.icon_name || 'layout'
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. Traducir automáticamente si estamos creando o si el título/descripción cambió
    let titleEs = '';
    let descriptionEs = '';

    try {
      const [titleRes, descRes] = await Promise.all([
        fetch('/api/translate', {
          method: 'POST',
          body: JSON.stringify({ text: formData.title, context: "Service title for a design agency" })
        }).then(r => r.json()),
        fetch('/api/translate', {
          method: 'POST',
          body: JSON.stringify({ text: formData.description, context: "Service description for a design agency" })
        }).then(r => r.json())
      ]);
      titleEs = titleRes.translation;
      descriptionEs = descRes.translation;
    } catch (err) {
      console.error('Auto-translation failed:', err);
    }

    const serviceData = {
      title: formData.title,
      description: formData.description,
      icon_name: formData.icon_name,
      title_es: titleEs || formData.title,
      description_es: descriptionEs || formData.description,
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('services')
        .insert([serviceData]);
      error = insertError;
    }

    setLoading(false);
    if (!error) {
      router.push('/admin/services');
    } else {
      alert('Error: ' + error.message);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
        </h2>
        <button 
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Título del Servicio</label>
          <input 
            required
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors"
            placeholder="Ej: Web Design"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Descripción</label>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors resize-none"
            placeholder="Describe el servicio..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Nombre del Icono (Lucide)</label>
          <select 
            value={formData.icon_name}
            onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors"
          >
            <option value="layout">Layout (Web)</option>
            <option value="pen-tool">Pen Tool (Branding)</option>
            <option value="smartphone">Smartphone (Apps)</option>
            <option value="git-merge">Git Merge (Flow)</option>
            <option value="layers">Layers (UI/UX)</option>
            <option value="cpu">CPU (AI)</option>
          </select>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-white text-black py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>{loading ? 'Guardando...' : 'Guardar Servicio'}</span>
          </button>
          <button 
            type="button"
            onClick={() => router.push('/admin/services')}
            className="flex-1 bg-zinc-900 text-white py-3 rounded-lg font-bold hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
