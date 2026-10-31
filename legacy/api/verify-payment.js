const crypto = require('crypto');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Handle UroPay Webhook Payload
  const {
    payment_id,
    status,
    amount,
    notes,
    button_id
  } = req.body;

  try {
    // Optional HMAC verification if UroPay sends a signature header
    const uropaySignature = req.headers['x-uropay-signature'];
    const secret = process.env.UROPAY_WEBHOOK_SECRET;

    if (secret && uropaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (generatedSignature !== uropaySignature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    if (status === 'SUCCESS' || status === 'COMPLETED') {
      // Find or update record by metadata or internal notes if mapped
      if (admin.apps.length) {
        const db = admin.firestore();
        // If notes contains document ID or registration reference
        const docId = notes?.enrollmentDocId || req.query.docId;
        
        if (docId) {
          const docRef = db.collection('course_registrations').doc(docId);
          const docSnap = await docRef.get();
          
          await docRef.update({
            paymentStatus: 'paid',
            uropayPaymentId: payment_id || 'uropay_verified',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          // Dispatch confirmation email via Nodemailer
          if (docSnap.exists) {
            const studentData = docSnap.data();
            const studentEmail = studentData?.email || req.body.customer_email;
            const studentName = studentData?.name || req.body.customer_name || "Student";
            const courseTitle = studentData?.courseName || "Your Tech Course";

            if (studentEmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
              try {
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: process.env.GMAIL_USER, // e.g. buildyourprojects754@gmail.com
                    pass: process.env.GMAIL_APP_PASSWORD
                  }
                });

                const mailOptions = {
                  from: `"buildyourprojects" <${process.env.GMAIL_USER}>`,
                  to: studentEmail,
                  subject: `🎉 Enrollment Confirmed: ${courseTitle}`,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                      <h2 style="color: #2563EB; margin-top: 0;">Welcome to buildyourprojects!</h2>
                      <p>Hi <strong>${studentName}</strong>,</p>
                      <p>We have successfully received your payment of <strong>₹${amount || 799}</strong> for the course <strong>${courseTitle}</strong>.</p>
                      
                      <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #22C55E;">
                        <h3 style="margin-top: 0; color: #1F2937;">Next Critical Step:</h3>
                        <p style="margin-bottom: 0; line-height: 1.5;">Please ensure you have joined our official WhatsApp group. All session links, timing details, and daily logic building portal access will be shared directly in the group.</p>
                      </div>

                      <p style="text-align: center; margin: 32px 0;">
                        <a href="https://chat.whatsapp.com/invite-link" style="background-color: #22C55E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 1.1rem;">Join WhatsApp Group</a>
                      </p>

                      <p style="line-height: 1.5;">If you have any questions, feel free to reply directly to this email or reach out on WhatsApp at +91 9447452039.</p>
                      <p style="margin-top: 24px; color: #6B7280; font-size: 0.9rem;">Best regards,<br><strong style="color: #374151;">The buildyourprojects Team</strong></p>
                    </div>
                  `
                };

                await transporter.sendMail(mailOptions);
              } catch (emailErr) {
                console.error("Confirmation email dispatch error:", emailErr);
              }
            }
          }
        }
      }

      return res.status(200).json({ success: true, message: 'UroPay payment verified successfully' });
    }

    return res.status(200).json({ success: true, status_received: status });
  } catch (error) {
    console.error('UroPay Verification error:', error);
    return res.status(500).json({ success: false, message: 'Server error during UroPay verification' });
  }
}
