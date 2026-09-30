import { getInquiries, saveInquiry } from '../../../lib/server-store';
import { inquirySchema } from '../../../lib/validations';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const inquiries = await getInquiries();
        return res.status(200).json({ success: true, data: inquiries });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'POST':
      try {
        const parseResult = inquirySchema.safeParse(req.body);
        if (!parseResult.success) {
          const errorMessage = parseResult.error.errors.map(err => err.message).join(', ');
          return res.status(400).json({ success: false, error: errorMessage });
        }
        const validatedData = parseResult.data;
        const saved = await saveInquiry(validatedData);

        // Dispatch to EmailJS if credentials configured
        const serviceID = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateID = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        const privateKey = process.env.EMAILJS_PRIVATE_KEY;

        let emailSent = false;
        if (serviceID && templateID && publicKey) {
          try {
            const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                service_id: serviceID,
                template_id: templateID,
                user_id: publicKey,
                accessToken: privateKey || undefined,
                template_params: {
                  from_name: validatedData.name,
                  from_email: validatedData.email,
                  reply_to: validatedData.email,
                  to_email: 'esp.hasil.insight@gmail.com',
                  subject: validatedData.subject,
                  message: validatedData.message,
                  service_type: validatedData.serviceType || 'General Inquiry'
                }
              })
            });
            if (emailRes.ok) {
              emailSent = true;
            } else {
              const errText = await emailRes.text().catch(() => '');
              console.warn('EmailJS API response note:', errText);
            }
          } catch (mailErr) {
            console.warn('EmailJS dispatch note:', mailErr.message);
          }
        }

        return res.status(201).json({ success: true, data: saved, emailSent });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
