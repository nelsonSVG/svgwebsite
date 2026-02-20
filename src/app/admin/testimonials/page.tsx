'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    quote: '',
    author: '',
    role: '',
    initials: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTestimonials(data || []);
    setLoading(false);
  }

  const openModal = (testimonial?: any) => {
    if (testimonial) {
      setFormData(testimonial);
    } else {
      setFormData({
        id: '',
        quote: '',
        author: '',
        role: '',
        initials: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('testimonials')
      .upsert({
        ...formData,
        id: formData.id || undefined // Let supabase generate uuid if new
      });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      fetchTestimonials();
      closeModal();
    }
    setSaving(false);
  };

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (!error) setTestimonials(testimonials.filter(t => t.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-syne">Testimonials</h2>
          <p className="text-zinc-400 font-poppins">What your clients say about you.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors font-poppins"
        >
          <Plus size={20} />
          <span>New Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-zinc-500 font-poppins">Loading testimonials...</p>
        ) : testimonials.map((t) => (
          <div key={t.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm font-poppins">
                {t.initials}
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(t)} className="p-2 hover:bg-zinc-900 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteTestimonial(t.id)} className="p-2 hover:bg-zinc-900 rounded-lg text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-zinc-300 italic mb-4 font-poppins">"{t.quote}"</p>
            <div>
              <div className="font-bold font-poppins">{t.author}</div>
              <div className="text-sm text-zinc-500 font-poppins">{t.role}</div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] px-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-lg w-full space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-syne">{formData.id ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <button onClick={closeModal}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 font-poppins">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Quote / Testimonial</label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={e => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Author</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Initials</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={formData.initials}
                    onChange={e => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Role / Company</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2 font-poppins"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                <span>Save</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
