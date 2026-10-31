export const site = {
  name: "BuildYourProjects",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.buildyourprojects.xyz",
  description:
    "Project submission kits, report formatting and viva preparation for Indian engineering students, plus custom final-year project builds.",
  tagline: "Your project, submission-ready.",
  whatsappNumber: "919447452039",
  phone: "+91 94474 52039",
  phoneHref: "tel:9447452039",
  email: "buildyourprojects754@gmail.com",
  linkedin: "https://www.linkedin.com/in/ananthakrishnan754",
  instagram: "https://instagram.com/shutter_bug07",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body?: string) {
  const query = new URLSearchParams({ subject });
  if (body) query.set("body", body);
  return `mailto:${site.email}?${query.toString()}`;
}
