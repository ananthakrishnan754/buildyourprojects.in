import { products, formatPrice } from "@/data/products";
import { projectService, projects } from "@/data/projects";
import { site } from "@/data/site";

export const dynamic = "force-static";

export function GET() {
  const productLines = products
    .map(
      (product) =>
        `- **${product.name}** — ${formatPrice(product.price)}. ${product.summary} Link: ${site.url}/products/${product.slug}`,
    )
    .join("\n");

  const content = `# ${site.name}
> Submission kits, report formatting and viva preparation for Indian engineering students, plus custom final-year project builds.

${site.url}

## Products
${productLines}

Checkout is not live yet. Buy buttons are disabled with a coming-soon state until payments and delivery are implemented and tested.

## Projects service
${projectService.subtitle}

- Published starting price band: ${projectService.pricing.band}
- Includes: ${projectService.inclusions.map((item) => item.title).join(", ")}
- Catalogue: ${projects.length} project starting points at ${site.url}/projects
- Enquiry: ${site.whatsappNumber} (WhatsApp) or ${site.email}

## Policies
- Terms: ${site.url}/terms
- Privacy: ${site.url}/privacy
- Refund: ${site.url}/refund
- Contact: ${site.url}/contact

No courses are offered. Course URLs permanently redirect to ${site.url}/products.
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
