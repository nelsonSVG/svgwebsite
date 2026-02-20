'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Client } from '@/lib/types'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    tax_id: '',
    address: '',
    language_preference: 'en',
    payment_preference: 'card'
  })

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    setLoading(true)
    const { data, error } = await supabase
      .schema('billing')
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching clients:', error)
    } else {
      setClients(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (editingClient) {
      const { error } = await supabase
        .schema('billing')
        .from('clients')
        .update(formData)
        .eq('id', editingClient.id)
      
      if (error) alert(error.message)
    } else {
      const { error } = await supabase
        .schema('billing')
        .from('clients')
        .insert([formData])
      
      if (error) alert(error.message)
    }

    setIsModalOpen(false)
    setEditingClient(null)
    setFormData({
      name: '',
      email: '',
      company_name: '',
      tax_id: '',
      address: '',
      language_preference: 'en',
      payment_preference: 'card'
    })
    fetchClients()
  }

  function handleEdit(client: Client) {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      company_name: client.company_name || '',
      tax_id: client.tax_id || '',
      address: client.address || '',
      language_preference: client.language_preference,
      payment_preference: client.payment_preference
    })
    setIsModalOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <button
          onClick={() => {
            setEditingClient(null)
            setFormData({
              name: '',
              email: '',
              company_name: '',
              tax_id: '',
              address: '',
              language_preference: 'en',
              payment_preference: 'card'
            })
            setIsModalOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          New Client
        </button>
      </div>

      {loading && clients.length === 0 ? (
        <div className="text-gray-400">Loading clients...</div>
      ) : (
        <div className="overflow-x-auto bg-[#1a1a1a] rounded-lg border border-zinc-800">
          <table className="w-full text-left text-gray-300">
            <thead className="text-gray-400 border-b border-zinc-800 bg-[#111]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Preferences</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-900 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{client.name}</td>
                  <td className="px-6 py-4">{client.email}</td>
                  <td className="px-6 py-4">{client.company_name || '-'}</td>
                  <td className="px-6 py-4 text-xs">
                    <span className="bg-zinc-800 px-2 py-1 rounded mr-2 uppercase">{client.language_preference}</span>
                    <span className="bg-zinc-800 px-2 py-1 rounded uppercase">{client.payment_preference}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingClient ? 'Edit Client' : 'New Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tax ID / NIT</label>
                  <input
                    type="text"
                    value={formData.tax_id}
                    onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                  <select
                    value={formData.language_preference}
                    onChange={(e) => setFormData({ ...formData, language_preference: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Pref. Payment</label>
                  <select
                    value={formData.payment_preference}
                    onChange={(e) => setFormData({ ...formData, payment_preference: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="card">Card (Stripe/Epayco)</option>
                    <option value="transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingClient ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
