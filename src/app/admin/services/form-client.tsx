'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  Layout, Save, X, PenTool, Smartphone, GitMerge, Layers, Cpu, 
  Code, Palette, Search, Megaphone, Monitor, Globe, 
  MessageSquare, BarChart, Rocket, Zap, Heart, Star,
  Shield, Camera, Video, Music, ShoppingCart, Database,
  Cloud, Lock, Mail, Users, Briefcase, Bookmark,
  Bell, CheckCircle, HelpCircle, Info, Settings, Share2,
  Trash2, Plus, ArrowRight, ExternalLink, Filter, Grid
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { id: 'layout', icon: Layout, label: 'Layout' },
  { id: 'pen-tool', icon: PenTool, label: 'Design' },
  { id: 'smartphone', icon: Smartphone, label: 'Mobile' },
  { id: 'git-merge', icon: GitMerge, label: 'Strategy' },
  { id: 'layers', icon: Layers, label: 'UI/UX' },
  { id: 'cpu', icon: Cpu, label: 'AI/Tech' },
  { id: 'code', icon: Code, label: 'Development' },
  { id: 'palette', icon: Palette, label: 'Branding' },
  { id: 'search', icon: Search, label: 'SEO/Research' },
  { id: 'megaphone', icon: Megaphone, label: 'Marketing' },
  { id: 'monitor', icon: Monitor, label: 'Web/Desktop' },
  { id: 'globe', icon: Globe, label: 'Global' },
  { id: 'message-square', icon: MessageSquare, label: 'Communication' },
  { id: 'bar-chart', icon: BarChart, label: 'Analytics' },
  { id: 'rocket', icon: Rocket, label: 'Launch' },
  { id: 'zap', icon: Zap, label: 'Fast/Performant' },
  { id: 'heart', icon: Heart, label: 'Passion/Social' },
  { id: 'star', icon: Star, label: 'Premium/Quality' },
  { id: 'shield', icon: Shield, label: 'Security' },
  { id: 'camera', icon: Camera, label: 'Photography' },
  { id: 'video', icon: Video, label: 'Video Production' },
  { id: 'shopping-cart', icon: ShoppingCart, label: 'E-commerce' },
  { id: 'database', icon: Database, label: 'Data/Back-end' },
  { id: 'cloud', icon: Cloud, label: 'Cloud Solutions' },
  { id: 'lock', icon: Lock, label: 'Privacy' },
  { id: 'mail', icon: Mail, label: 'Email' },
  { id: 'users', icon: Users, label: 'Community' },
  { id: 'briefcase', icon: Briefcase, label: 'Business' },
];

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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400">Seleccionar Icono Visual</label>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold bg-zinc-900 px-2 py-1 rounded">
              Actual: {formData.icon_name}
            </span>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 bg-black border border-zinc-800 rounded-xl p-4 max-h-64 overflow-y-auto no-scrollbar">
            {AVAILABLE_ICONS.map((item) => {
              const IconComp = item.icon;
              const isSelected = formData.icon_name === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon_name: item.id })}
                  title={item.label}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border transition-all
                    ${isSelected 
                      ? 'bg-white text-black border-white scale-110 shadow-lg' 
                      : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white'}
                  `}
                >
                  <IconComp size={20} />
                </button>
              );
            })}
          </div>
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
