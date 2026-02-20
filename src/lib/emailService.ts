import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail({
  to,
  invoiceNumber,
  pdfBuffer,
  clientName
}: {
  to: string;
  invoiceNumber: string;
  pdfBuffer: Buffer;
  clientName: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SVG Agency <billing@svg.com.co>',
      to: [to],
      subject: `Invoice ${invoiceNumber} from SVG Agency`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Hello ${clientName},</h2>
          <p style="color: #666; line-height: 1.6;">
            We've generated a new invoice <strong>${invoiceNumber}</strong> for you. 
            Please find the details in the attached PDF.
          </p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/billing/view/${invoiceNumber}" 
               style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
               View & Pay Online
            </a>
          </div>
          <p style="color: #999; font-size: 12px;">
            If you have any questions, please reply to this email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
