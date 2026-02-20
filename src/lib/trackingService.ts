import { supabase } from '@/lib/supabaseClient';

export async function logInvoiceEvent(invoiceId: string, eventType: string, metadata: any = {}) {
  const { error } = await supabase
    .schema('billing')
    .from('invoice_events')
    .insert([{
      invoice_id: invoiceId,
      event_type: eventType,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      }
    }]);
  
  if (error) console.error('Error logging event:', error);
}

export async function logAuditAction(action: string, invoiceId: string, details: any = {}) {
  // En una aplicación real, obtendríamos el user_id de la sesión
  const { error } = await supabase
    .schema('billing')
    .from('audit_log')
    .insert([{
      action,
      invoice_id: invoiceId,
      details,
    }]);
  
  if (error) console.error('Error logging audit:', error);
}
