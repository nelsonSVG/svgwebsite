'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Invoice, Client, InvoiceItem } from '@/lib/types'
import { format } from 'date-fns'
import { Sparkles, Loader2 } from 'lucide-react'

export default function NewInvoicePage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [isTest, setIsTest] = useState(false)
  
  const [formData, setFormData] = useState({
    client_id: '',
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    currency: 'USD',
    tax_rate: 0,
    language: 'en'
  })

  const [items, setItems] = useState<Partial<InvoiceItem>[]>([
    { description: '', quantity: 1, unit_price: 0, total: 0 }
  ])
  const [aiPrompt, setAiPrompt] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [showAiInput, setShowAiInput] = useState(false)
  const [suggestedClient, setSuggestedClient] = useState<{name: string, email: string, company_name?: string} | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    const { data } = await supabase.schema('billing').from('clients').select('*').order('name')
    setClients(data || [])
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, total: 0 }])
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'unit_price') {
      const q = field === 'quantity' ? value : (newItems[index].quantity || 0)
      const p = field === 'unit_price' ? value : (newItems[index].unit_price || 0)
      newItems[index].total = q * p
    }
    
    setItems(newItems)
  }

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
  const tax = subtotal * (formData.tax_rate / 100)
  const total = subtotal + tax

  async function handleAiAssistant() {
    if (!aiPrompt) return
    setIsAiLoading(true)
    setSuggestedClient(null)
    try {
      const res = await fetch('/api/billing/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      })
      const data = await res.json()
      
      if (data.items) {
        setItems(data.items.map((item: any) => ({
          ...item,
          total: (item.quantity || 0) * (item.unit_price || 0)
        })))
        
        if (data.client && data.client.name) {
          // Intentar buscar si el cliente ya existe
          const { data: existingClient } = await supabase
            .schema('billing')
            .from('clients')
            .select('id')
            .ilike('name', `%${data.client.name}%`)
            .limit(1)
            .single()

          if (existingClient) {
            setFormData(prev => ({ ...prev, client_id: existingClient.id }))
          } else {
            setSuggestedClient(data.client)
          }
        }

        setShowAiInput(false)
        setAiPrompt('')
      } else {
        alert(data.error || 'Error with AI assistant')
      }
    } catch (err) {
      alert('Error calling AI')
    } finally {
      setIsAiLoading(false)
    }
  }

  async function createSuggestedClient() {
    if (!suggestedClient) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .schema('billing')
        .from('clients')
        .insert([{
          name: suggestedClient.name,
          email: suggestedClient.email || 'pending@change.me',
          company_name: suggestedClient.company_name,
          language_preference: 'en',
          payment_preference: 'card'
        }])
        .select()
        .single()

      if (error) throw error
      
      setFormData(prev => ({ ...prev, client_id: data.id }))
      setClients([...clients, data])
      setSuggestedClient(null)
      alert('Client created and assigned successfully!')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.client_id) return alert('Seleccione un cliente')
    setLoading(true)

    try {
      // 1. Obtener siguiente número de factura vía RPC
      const series = isTest ? 'TEST' : 'NC'
      const { data: invoice_number, error: rpcError } = await supabase
        .rpc('get_next_invoice_number', { series_name: series })

      if (rpcError) throw rpcError

      // 2. Crear factura
      const { data: invoice, error: invError } = await supabase
        .schema('billing')
        .from('invoices')
        .insert([{
          invoice_number,
          client_id: formData.client_id,
          status: 'draft',
          subtotal,
          tax,
          total,
          currency: formData.currency,
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          is_test: isTest,
          language: formData.language
        }])
        .select()
        .single()

      if (invError) throw invError

      // 3. Crear items
      const itemsToInsert = items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total
      }))

      const { error: itemsError } = await supabase
        .schema('billing')
        .from('invoice_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      alert(`Factura ${invoice_number} creada exitosamente`)
      window.location.href = '/admin/billing/invoices'
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white font-syne">New Invoice</h1>
        <button
          type="button"
          onClick={() => setShowAiInput(!showAiInput)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-purple-500/20"
        >
          <Sparkles size={18} />
          AI Assistant
        </button>
      </div>

      {showAiInput && (
        <div className="mb-6 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <label className="block text-sm font-medium text-purple-300 mb-2 italic">What do you want to invoice? (e.g., "Invoice for $500 for web design for a new client Elon Musk")</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your invoice here..."
              className="flex-1 bg-black border border-purple-500/30 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAiAssistant())}
            />
            <button
              type="button"
              onClick={handleAiAssistant}
              disabled={isAiLoading || !aiPrompt}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isAiLoading ? <Loader2 className="animate-spin" size={18} /> : 'Generate'}
            </button>
          </div>
        </div>
      )}
      
      {suggestedClient && (
        <div className="mb-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between animate-in zoom-in-95">
          <div>
            <p className="text-blue-300 text-sm font-medium">New client detected: <span className="text-white font-bold">{suggestedClient.name}</span></p>
            <p className="text-blue-400/60 text-xs">Would you like to create this client automatically?</p>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setSuggestedClient(null)}
              className="px-3 py-1 text-xs text-gray-400 hover:text-white"
            >
              Ignore
            </button>
            <button 
              type="button"
              onClick={createSuggestedClient}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-500/20"
            >
              Create & Assign
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Client</label>
              <select
                required
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company_name || 'Individual'})</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer text-gray-400">
                <input
                  type="checkbox"
                  checked={isTest}
                  onChange={(e) => setIsTest(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-blue-600"
                />
                <span>Is this a test invoice? (TEST Series)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Issue Date</label>
              <input
                type="date"
                required
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none"
              >
                <option value="USD">USD - Dollars</option>
                <option value="COP">COP - Colombian Pesos</option>
                <option value="EUR">EUR - Euros</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Line Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-6">
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm outline-none"
                  />
                </div>
                <div className="col-span-2 text-right py-2 text-zinc-300 font-medium">
                  ${(item.total || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-zinc-800 pt-4 space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Tax (%)</span>
                <input
                  type="number"
                  value={formData.tax_rate}
                  onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
                  className="w-16 bg-black border border-zinc-800 rounded px-2 py-0.5 text-white text-sm"
                />
              </div>
              <span className="text-zinc-400">${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-xl pt-2">
              <span>Total</span>
              <span>${total.toLocaleString()} {formData.currency}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}
