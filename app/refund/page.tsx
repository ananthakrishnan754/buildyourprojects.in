import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Refund policy",
  description:
    "Draft refund policy for BuildYourProjects digital study aids and custom project services. Pending owner and legal review.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund policy"
      updated="31 October 2026"
      intro="This draft explains how refund requests will be handled once checkout is live. No payment can be taken yet, so no order or refund can currently be created."
      sections={[
        {
          heading: "1. Digital products",
          paragraphs: [
            "Submission Kit, ReportForge and Viva Vault are digital products. Because a download cannot be returned, a refund is generally not available after the files or access have been delivered, unless the product is defective or not as described.",
          ],
        },
        {
          heading: "2. Before delivery",
          paragraphs: [
            "If you paid but never received the download link or access email, contact us with the order details. We will resend the delivery or refund the order after checking the payment record.",
          ],
        },
        {
          heading: "3. Defective or wrong delivery",
          paragraphs: [
            "If the delivered file is corrupted, the wrong product was sent, or a material part of the published contents is missing, tell us within 7 days of delivery. We will fix the delivery first. If it cannot be fixed, we will review a refund.",
          ],
        },
        {
          heading: "4. Duplicate and failed payments",
          paragraphs: [
            "Duplicate charges and payments that succeeded without an order being fulfilled are refunded after verification. Failed payments that were never captured by the payment provider are not charged at all; your bank may take time to release any temporary hold.",
          ],
        },
        {
          heading: "5. Change of mind",
          paragraphs: [
            "Change of mind after download is not normally refundable. If you bought the wrong pack by mistake and have not downloaded it, contact us quickly and we will review an exchange or refund before delivery.",
          ],
        },
        {
          heading: "6. Custom project service",
          paragraphs: [
            "Custom projects are governed by the written quote for that project. Deposits, hardware purchases and work already completed may be non-refundable. Any cancellation terms will be stated in the quote before work starts.",
          ],
        },
        {
          heading: "7. How to request a refund",
          bullets: [
            "Email buildyourprojects754@gmail.com or message the WhatsApp number on the contact page.",
            "Include the order email, payment reference and a short description of the problem.",
            "We will acknowledge the request and ask for any missing details.",
            "Approved refunds are returned through the original payment method. Bank processing time depends on the provider.",
          ],
        },
        {
          heading: "8. Your statutory rights",
          paragraphs: [
            "Nothing in this policy limits rights you may have under applicable consumer law. If a mandatory rule gives you a stronger remedy, that rule applies.",
          ],
        },
      ]}
    />
  );
}
