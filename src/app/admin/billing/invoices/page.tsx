'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Invoice } from '@/lib/types'
import Link from 'next/link'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {
    setLoading(true)
    const { data, error } = await supabase
      .schema('billing')
      .from('invoices')
      .select(`
        *,
        client:client_id (name, company_name)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching invoices:', error)
    } else {
      setInvoices(data || [])
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'overdue': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'void': return 'bg-red-900/10 text-red-900 border-red-900/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Facturas</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/billing/clients"
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Gestionar Clientes
          </Link>
          <Link
            href="/admin/billing/invoices/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Nueva Factura
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando facturas...</div>
      ) : (
        <div className="overflow-x-auto bg-[#1a1a1a] rounded-lg border border-gray-800">
          <table className="w-full text-left text-gray-300">
            <thead className="text-gray-400 border-b border-gray-800 bg-[#111]">
              <tr>
                <th className="px-6 py-4">Número</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#222] transition-colors">
                  <td className="px-6 py-4 font-mono text-blue-400">
                    {invoice.invoice_number}
                    {invoice.is_test && <span className="ml-2 text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1 rounded">TEST</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{(invoice.client as any)?.name}</div>
                    <div className="text-xs text-gray-500">{(invoice.client as any)?.company_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {invoice.issue_date}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    {invoice.total.toLocaleString()} {invoice.currency}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(invoice.status)} uppercase font-bold`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button className="text-gray-400 hover:text-white">PDF</button>
                      <button className="text-blue-400 hover:text-blue-300">Enviar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                    No se encontraron facturas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
