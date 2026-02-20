'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProjectForm() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'web',
    category_label: 'Web Design',
    description: '',
    client: '',
    year: new Date().getFullYear().toString(),
    services: [] as string[],
    images: [] as string[]
  });

  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [isEdit]);

  async function fetchProject() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) {
      setFormData(data);
    }
    setFetching(false);
  }

  const handleServiceAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && serviceInput.trim()) {
      e.preventDefault();
      if (!formData.services.includes(serviceInput.trim())) {
        setFormData({
          ...formData,
          services: [...formData.services, serviceInput.trim()]
        });
      }
      setServiceInput('');
    }
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter(s => s !== service)
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const files = Array.from(e.target.files);
    const newImages = [...formData.images];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-assets')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('project-assets')
          .getPublicUrl(filePath);
        
        newImages.push(publicUrl);
      }
    }

    setFormData({ ...formData, images: newImages });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Traducir automáticamente
    let titleEs = '';
    let descriptionEs = '';
    let categoryLabelEs = '';

    try {
      const [titleRes, descRes, catRes] = await Promise.all([
        fetch('/api/translate', {
          method: 'POST',
          body: JSON.stringify({ text: formData.title, context: "Project title for a design agency portfolio" })
        }).then(r => r.json()),
        fetch('/api/translate', {
          method: 'POST',
          body: JSON.stringify({ text: formData.description, context: "Project description for a design agency portfolio" })
        }).then(r => r.json()),
        fetch('/api/translate', {
          method: 'POST',
          body: JSON.stringify({ text: formData.category_label, context: "Project category label" })
        }).then(r => r.json())
      ]);
      titleEs = titleRes.translation;
      descriptionEs = descRes.translation;
      categoryLabelEs = catRes.translation;
    } catch (err) {
      console.error('Auto-translation failed:', err);
    }

    const { error } = await supabase
      .from('projects')
      .upsert({
        ...formData,
        title_es: titleEs || formData.title,
        description_es: descriptionEs || formData.description,
        category_label_es: categoryLabelEs || formData.category_label,
        updated_at: new Date().toISOString()
      });

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      router.push('/admin/projects');
      router.refresh();
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/projects" className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight font-syne">
            {isEdit ? 'Edit Project' : 'New Project'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Project ID (slug)</label>
            <input
              type="text"
              required
              disabled={isEdit}
              placeholder="e.g., techflow-dashboard"
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Title</label>
            <input
              type="text"
              required
              placeholder="Project title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Category (ID)</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="web">Web Design</option>
              <option value="branding">Branding</option>
              <option value="apps">Applications</option>
              <option value="uiux">UI/UX</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Category Label</label>
            <input
              type="text"
              required
              placeholder="e.g., Web Design"
              value={formData.category_label}
              onChange={e => setFormData({ ...formData, category_label: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Client</label>
            <input
              type="text"
              placeholder="Client name"
              value={formData.client}
              onChange={e => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Year</label>
            <input
              type="text"
              placeholder="2024"
              value={formData.year}
              onChange={e => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2 font-poppins">
          <label className="text-sm font-medium text-zinc-400">Description</label>
          <textarea
            rows={4}
            placeholder="Detailed project description..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div className="space-y-2 font-poppins">
          <label className="text-sm font-medium text-zinc-400">Services (Press Enter to add)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.services.map(service => (
              <span key={service} className="flex items-center space-x-1 px-3 py-1 bg-zinc-800 rounded-full text-sm">
                <span>{service}</span>
                <button type="button" onClick={() => removeService(service)} className="hover:text-red-500">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add service..."
            value={serviceInput}
            onChange={e => setServiceInput(e.target.value)}
            onKeyDown={handleServiceAdd}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="space-y-4 font-poppins">
          <label className="text-sm font-medium text-zinc-400">Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative aspect-[4/5] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <label className={`
              aspect-[4/5] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-600 transition-colors
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}>
              {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
              <span className="mt-2 text-xs text-zinc-500">{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 font-poppins"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{isEdit ? 'Update Project' : 'Save Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
