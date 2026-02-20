'use client'

import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Invoice, Client, InvoiceItem } from '@/lib/types'
import { Loader2, Download, CreditCard } from 'lucide-react'
import { format } from 'date-fns'

export default function PublicInvoicePage({ params }: { params: Promise<{ number: string }> }) {
  const resolvedParams = use(params)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoice() {
      const { data, error } = await supabase
        .schema('billing')
        .from('invoices')
        .select(`
          *,
          client:client_id (*),
          items:invoice_items (*)
        `)
        .eq('invoice_number', resolvedParams.number)
        .single()
      
      if (data) setInvoice(data)
      setLoading(false)
    }
    fetchInvoice()
  }, [resolvedParams.number])

  const handleEpaycoPayment = () => {
    if (!invoice) return

    // Configuración de Epayco (Script de Checkout)
    const handler = (window as any).ePayco.checkout.configure({
      key: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY || 'TU_PUBLIC_KEY',
      test: true // Cambiar a false en producción
    })

    const data = {
      name: `Factura ${invoice.invoice_number}`,
      description: `Pago de servicios SVG Agency - ${invoice.invoice_number}`,
      invoice: invoice.invoice_number,
      currency: invoice.currency.toLowerCase(),
      amount: invoice.total.toString(),
      tax_base: invoice.subtotal.toString(),
      tax: invoice.tax.toString(),
      country: 'co',
      lang: invoice.language === 'es' ? 'es' : 'en',
      
      //Onpage checkout
      external: 'false',
      
      //Atributos cliente
      extra1: invoice.id,
      email_billing: (invoice.client as any)?.email,
      name_billing: (invoice.client as any)?.name,
      address_billing: (invoice.client as any)?.address,

      //Redirección
      confirmation: `${process.env.NEXT_PUBLIC_BASE_URL}/api/billing/webhook/epayco`,
      response: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/response`,
    }

    handler.open(data)
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-white" size={32} />
    </div>
  )

  if (!invoice) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      Factura no encontrada.
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      {/* Cargar Script Epayco */}
      <script src="https://checkout.epayco.co/checkout.js" async />

      <div className="max-w-4xl mx-auto bg-white text-black rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:row justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tighter mb-2">INVOICE</h1>
              <p className="text-zinc-500 font-mono">{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold">SVG Visual Digital</h2>
              <p className="text-zinc-500">Cali, Colombia</p>
              <p className="text-zinc-500">nelson@svg.com.co</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Bill To</p>
              <p className="font-bold text-xl">{(invoice.client as any)?.name}</p>
              <p className="text-zinc-500">{(invoice.client as any)?.company_name}</p>
              <p className="text-zinc-500">{(invoice.client as any)?.address}</p>
              <p className="text-zinc-500">{(invoice.client as any)?.email}</p>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Info</p>
              <p><span className="text-zinc-500">Date:</span> {format(new Date(invoice.issue_date), 'PPP')}</p>
              <p><span className="text-zinc-500">Due:</span> {format(new Date(invoice.due_date), 'PPP')}</p>
              <p><span className="text-zinc-500">Status:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'
                }`}>
                  {invoice.status}
                </span>
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="border-t border-zinc-100 pt-8 mb-12">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <th className="pb-4">Description</th>
                  <th className="pb-4 text-center">Qty</th>
                  <th className="pb-4 text-right">Price</th>
                  <th className="pb-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {(invoice as any).items?.map((item: InvoiceItem) => (
                  <tr key={item.id}>
                    <td className="py-4 text-zinc-700">{item.description}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">{item.unit_price.toLocaleString()}</td>
                    <td className="py-4 text-right font-bold">{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-2 mb-12">
            <div className="flex justify-between w-64 text-zinc-500">
              <span>Subtotal</span>
              <span>{invoice.subtotal.toLocaleString()}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between w-64 text-zinc-500">
                <span>Tax</span>
                <span>{invoice.tax.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between w-64 pt-4 border-t border-zinc-100 mt-2">
              <span className="font-bold text-xl">Total</span>
              <span className="font-black text-2xl">{invoice.total.toLocaleString()} {invoice.currency}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-center gap-4 pt-8 border-t border-zinc-100">
            {invoice.status !== 'paid' && (
              <button
                onClick={handleEpaycoPayment}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
              >
                <CreditCard size={20} />
                Pagar con Tarjeta (Epayco)
              </button>
            )}
            <button className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-8 py-4 rounded-xl font-bold transition-all">
              <Download size={20} />
              Descargar PDF
            </button>
          </div>
        </div>
        <div className="bg-zinc-50 p-8 text-center text-zinc-400 text-sm">
          <p>Thank you for your business. SVG Visual Digital Design Agency.</p>
        </div>
      </div>
    </div>
  )
}
