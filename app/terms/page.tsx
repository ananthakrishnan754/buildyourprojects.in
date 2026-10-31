import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Draft terms for BuildYourProjects digital study aids, templates and custom project services. Pending owner and legal review.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      updated="31 October 2026"
      intro="These terms describe how BuildYourProjects intends to sell digital study aids, templates and custom project services. The storefront is pre-launch: payments are not live and no order can be placed yet."
      sections={[
        {
          heading: "1. Who we are",
          paragraphs: [
            "BuildYourProjects is a solo-run education project based in India. You can reach us through the contact details on this site. These terms apply to the website and to any product or custom project service we offer.",
          ],
        },
        {
          heading: "2. What we sell",
          paragraphs: [
            "Our digital products are study aids, templates and tools. They are designed to help you structure, format and prepare your own engineering project work. They are not ghost-writing services and they do not guarantee marks, grades or approval by any institution.",
            "The Submission Kit includes a report format with fields for your own results. ReportForge formats content that you supply. Viva Vault is a question bank for your own preparation.",
          ],
        },
        {
          heading: "3. Academic integrity",
          paragraphs: [
            "You are responsible for following your college or university rules. If your institution requires work to be entirely your own, use these products only as study aids and references. You must be able to explain and defend any work you submit.",
          ],
        },
        {
          heading: "4. Pricing and payment",
          bullets: [
            "Prices are shown in Indian rupees and are the prices in effect when an order is placed.",
            "Checkout is not live in this build. When it launches, payments will be processed by Razorpay in test mode first and then in the approved mode.",
            "Taxes, if applicable, will be shown before payment.",
            "We do not store card details. Payment information is handled by the payment provider.",
          ],
        },
        {
          heading: "5. Delivery",
          paragraphs: [
            "The intended delivery method is a secure download link plus an email receipt after payment confirmation. Delivery details, link expiry and support steps will be confirmed before checkout opens.",
          ],
        },
        {
          heading: "6. Refunds",
          paragraphs: [
            "Refunds are covered by the separate refund policy draft. Digital products are generally non-refundable after download, but failed, duplicate or undelivered payments will be investigated.",
          ],
        },
        {
          heading: "7. Custom project service",
          paragraphs: [
            "Custom projects are quoted individually after a scope discussion. The written quote, timeline and deliverables for each project take priority over general website copy. Hardware costs, revisions and timeline changes may affect the final price.",
          ],
        },
        {
          heading: "8. Intellectual property and permitted use",
          bullets: [
            "You receive a personal, non-transferable licence to use the digital product for your own study and project preparation.",
            "You may not resell, redistribute, publish or share the files as a competing product.",
            "Third-party libraries, fonts and tools included in a project remain subject to their own licences.",
          ],
        },
        {
          heading: "9. Availability and liability",
          paragraphs: [
            "We aim to keep the site available and the content accurate, but the site is provided as-is during the rebuild. To the extent permitted by law, we are not liable for indirect losses, institutional decisions or marks. Nothing in these terms limits rights that cannot be limited under applicable consumer law.",
          ],
        },
        {
          heading: "10. Changes and contact",
          paragraphs: [
            "We may update these terms as the storefront launches. The date at the top of the page will change. For questions, use the contact page or email buildyourprojects754@gmail.com.",
          ],
        },
      ]}
    />
  );
}
