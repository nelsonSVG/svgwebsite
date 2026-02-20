import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Invoice, Client, InvoiceItem } from './types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: -1,
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 200,
    paddingVertical: 2,
  },
  grandTotal: {
    borderTopWidth: 2,
    borderTopColor: '#000',
    marginTop: 5,
    paddingTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

export const InvoicePDF = ({ invoice, client, items }: { invoice: Invoice, client: Client, items: InvoiceItem[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={{ fontSize: 14, marginTop: 5, color: '#666' }}>#{invoice.invoice_number}</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Nelson Casallas</Text>
          <Text style={{ fontSize: 9, color: '#666', marginTop: 2 }}>Independent Contractor / Design & Web Consultant</Text>
          <Text style={{ marginTop: 8 }}>nelson@svg.com.co</Text>
          <Text>Cali, Colombia</Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={[styles.section, { flex: 1 }]}>
          <Text style={styles.sectionTitle}>BILL TO</Text>
          <Text style={{ fontWeight: 'bold' }}>{client.name}</Text>
          {client.company_name && <Text>{client.company_name}</Text>}
          {client.tax_id && <Text>NIT/Tax ID: {client.tax_id}</Text>}
          {client.address && <Text>{client.address}</Text>}
          <Text>{client.email}</Text>
        </View>
        <View style={[styles.section, { flex: 1, textAlign: 'right' }]}>
          <Text style={styles.sectionTitle}>DATE & DUE</Text>
          <Text>Issue Date: {invoice.issue_date}</Text>
          <Text>Due Date: {invoice.due_date}</Text>
          <Text>Currency: {invoice.currency}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Unit Price</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>
        {items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{item.unit_price.toLocaleString()}</Text>
            <Text style={styles.colTotal}>{item.total.toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={{ flex: 1 }}>Subtotal:</Text>
          <Text style={{ width: 80, textAlign: 'right' }}>{invoice.subtotal.toLocaleString()}</Text>
        </View>
        {invoice.tax > 0 && (
          <View style={styles.totalRow}>
            <Text style={{ flex: 1 }}>Tax:</Text>
            <Text style={{ width: 80, textAlign: 'right' }}>{invoice.tax.toLocaleString()}</Text>
          </View>
        )}
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={{ flex: 1 }}>TOTAL:</Text>
          <Text style={{ width: 80, textAlign: 'right' }}>{invoice.total.toLocaleString()} {invoice.currency}</Text>
        </View>
      </View>

      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>TAX & LEGAL NOTE</Text>
        <Text style={{ color: '#666', fontSize: 9 }}>
          Services were provided remotely from Colombia by an independent contractor. No U.S. sales tax applies.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PAYMENT METHOD: ACH TRANSFER ONLY</Text>
        <View style={{ color: '#666', lineHeight: 1.5, fontSize: 9 }}>
          <Text>This account accepts ACH transfers exclusively.</Text>
          <Text>Beneficiary name: Nelson Casallas</Text>
          <Text>Bank name: Lead Bank</Text>
          <Text>Account number: 213031980680 | Routing number: 101019644</Text>
          <Text>Account type: checking</Text>
          <Text>Recipient Address: Calle 19A 82-65, Bogotá D.C., Colombia</Text>
          <Text>Bank address: 1801 Main St, Kansas City, Missouri 64108</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your business! SVG Visual Digital Design Agency.</Text>
      </View>
    </Page>
  </Document>
);
