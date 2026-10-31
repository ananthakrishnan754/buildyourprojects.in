import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Draft privacy notice for BuildYourProjects: what the site collects, how enquiries are handled, and which services are planned for payments and delivery.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy notice"
      updated="31 October 2026"
      intro="This notice explains what happens to information when you browse the site, message us or enquire about a custom project. It is a draft pending owner and legal review."
      sections={[
        {
          heading: "1. What we collect",
          bullets: [
            "Information you send us directly: your name, branch, project details and contact number when you message on WhatsApp or email.",
            "The project enquiry form on this site does not store data. It opens WhatsApp with a prefilled message.",
            "When payments launch, the payment provider will process the information needed to take payment and issue a receipt.",
            "Hosting and server logs may record standard technical information such as IP address, browser type and requested pages.",
          ],
        },
        {
          heading: "2. How we use it",
          bullets: [
            "To reply to enquiries and scope custom project work.",
            "To deliver a purchased digital product and provide support.",
            "To keep records of orders, refunds and payment status.",
            "To keep the site secure and diagnose technical problems.",
          ],
        },
        {
          heading: "3. What we do not do",
          bullets: [
            "We do not sell personal information.",
            "We do not run advertising or third-party analytics in this phase of the rebuild.",
            "We do not ask you to send card details over WhatsApp or email.",
          ],
        },
        {
          heading: "4. Sharing",
          paragraphs: [
            "We may share the minimum information needed with service providers that run the storefront. These are expected to include Razorpay for payments, Supabase for order records, an email provider for receipts and delivery, and Vercel for hosting. Each provider processes data under its own terms.",
          ],
        },
        {
          heading: "5. Cookies and storage",
          paragraphs: [
            "This phase does not add analytics cookies. The site may use essential storage needed for basic functionality. If analytics is added later, this notice will be updated before it is enabled.",
          ],
        },
        {
          heading: "6. Retention",
          paragraphs: [
            "Enquiry conversations are kept only as long as needed to handle the request and any follow-up work. Order and payment records may be kept longer where required for accounting, tax or dispute handling.",
          ],
        },
        {
          heading: "7. Security",
          paragraphs: [
            "Access to order data is limited to the people who need it. Payment secrets and service keys are stored in environment variables, not in the public repository. No system is completely secure, so please avoid sending sensitive documents unless they are needed for the work.",
          ],
        },
        {
          heading: "8. Your choices",
          paragraphs: [
            "You can ask us to correct or delete the personal information we hold about you, subject to record-keeping obligations. Use the contact page or email buildyourprojects754@gmail.com. If you are under 18, please involve a parent or guardian.",
          ],
        },
        {
          heading: "9. Changes",
          paragraphs: [
            "This notice will be updated when payments, delivery and any analytics go live. The date at the top of the page will change.",
          ],
        },
      ]}
    />
  );
}
