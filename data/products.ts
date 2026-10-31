export type ProductCategory = "submit" | "format" | "viva";

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  categoryLabel: string;
  kicker: string;
  tagline: string;
  summary: string;
  description: string;
  deliverables: { title: string; detail: string }[];
  bestFor: string[];
  note: string;
  faq: { question: string; answer: string }[];
};

export const products: Product[] = [
  {
    slug: "submission-kit",
    name: "Submission Kit",
    price: 499,
    category: "submit",
    categoryLabel: "Submit",
    kicker: "Hero kit",
    tagline:
      "Working code, an IEEE-format report, a defence deck and viva answers in one pack.",
    summary:
      "Pick a pre-built mini-project and get the complete submission pack around it, not another tutorial.",
    description:
      "The Submission Kit is for the student who needs a complete, runnable project submission. You choose one pre-built mini-project, then receive the source code, the report structure, the defence deck and the viva preparation material as one pack.",
    deliverables: [
      {
        title: "Runnable source code",
        detail: "One-command setup and seeded demo data for a pre-built mini-project.",
      },
      {
        title: "IEEE-format report template",
        detail:
          "Abstract, literature survey, methodology, results, conclusion and references, with clearly marked fields for your own results.",
      },
      {
        title: "12-slide defence deck",
        detail: "A presentation outline that matches the report structure.",
      },
      {
        title: "25 project-specific viva answers",
        detail: "Short model answers you can rehearse before the review.",
      },
      {
        title: "Demo walkthrough",
        detail: "A guide to running the project and explaining the build in your own words.",
      },
      {
        title: "Setup and troubleshooting guide",
        detail: "Windows and macOS setup steps, dependency list and common fixes.",
      },
    ],
    bestFor: [
      "Final-year students who need a complete submission pack",
      "Students who want a working base they can explain and extend",
      "Anyone who would rather start from a proven structure than a blank folder",
    ],
    note:
      "The report is a format with fields for your own results. You must be able to explain the work you submit.",
    faq: [
      {
        question: "Is this a finished project I can submit as-is?",
        answer:
          "It is a starter pack and study aid. You receive the code and the report structure, and you fill in your own results, screenshots and conclusions so the submission reflects work you understand and can defend.",
      },
      {
        question: "Which mini-project do I get?",
        answer:
          "The project list and final pack contents are being confirmed before checkout opens. The product page will show the exact options and sample pages before the buy button is enabled.",
      },
      {
        question: "When can I buy it?",
        answer:
          "Checkout is not live in this build. The buy button stays disabled with a clear coming-soon state until payments and delivery are implemented and tested.",
      },
    ],
  },
  {
    slug: "reportforge",
    name: "ReportForge",
    price: 299,
    category: "format",
    categoryLabel: "Format",
    kicker: "Formatting tool",
    tagline:
      "Turn the project details you already have into a clean report and matching deck.",
    summary:
      "A formatting tool for students who have the content and need a university-ready document structure.",
    description:
      "ReportForge formats what you supply. You provide the title, abstract, tools, modules, screenshots, results and citations; it returns a structured report and a matching defence deck. It does not write your academic content for you.",
    deliverables: [
      {
        title: "Formatted .docx report",
        detail:
          "Automatic table of contents, heading numbering, figure and table captions, and a reference list built from your own citations.",
      },
      {
        title: "Matching .pptx deck",
        detail: "A defence deck generated from the same project details.",
      },
      {
        title: "Formatting checklist",
        detail: "A short pre-submission check for margins, numbering, captions and references.",
      },
    ],
    bestFor: [
      "Students who already have project content and screenshots",
      "Anyone fighting with heading styles, captions and reference lists",
      "Students who need a consistent report and deck before a deadline",
    ],
    note:
      "ReportForge is a formatter, not a ghost-writing service. The academic content, results and citations remain yours.",
    faq: [
      {
        question: "Does ReportForge write my report for me?",
        answer:
          "No. It formats the material you supply. You bring the project details, results and citations; the tool handles structure, numbering, captions and layout.",
      },
      {
        question: "Which university formats will be supported?",
        answer:
          "The supported format list is still being finalised. It will be published on this page before checkout opens, and you will pick your format during onboarding.",
      },
      {
        question: "When can I buy it?",
        answer:
          "Checkout is not live in this build. The buy button stays disabled with a clear coming-soon state until payments and delivery are implemented and tested.",
      },
    ],
  },
  {
    slug: "viva-vault",
    name: "Viva Vault",
    price: 149,
    category: "viva",
    categoryLabel: "Viva",
    kicker: "Viva prep",
    tagline:
      "A searchable bank of viva questions and short answers, organised for the night before.",
    summary:
      "Branch-wise and project-type questions, flashcards and a simple way to explain your project in 60 seconds.",
    description:
      "Viva Vault is a preparation tool for the review room. It groups common viva questions by branch and project type, gives short model answers, and includes flashcards plus a template for explaining your project clearly under pressure.",
    deliverables: [
      {
        title: "Searchable question bank",
        detail: "Questions grouped by branch and project type, with short model answers.",
      },
      {
        title: "Printable PDF",
        detail: "A revision copy you can mark up offline.",
      },
      {
        title: "Flashcard export",
        detail: "CSV and Anki-compatible cards for spaced repetition.",
      },
      {
        title: "60-second explanation template",
        detail: "A fill-in structure for the opening question every panel asks.",
      },
    ],
    bestFor: [
      "Students preparing for a project viva or review",
      "Anyone who can explain the build but freezes on theory questions",
      "Students who want a last-minute revision pass that is easy to scan",
    ],
    note:
      "The question bank is a study aid. Use it to prepare your own answers, not to memorise claims you cannot defend.",
    faq: [
      {
        question: "How many questions are included?",
        answer:
          "The target is a 300+ question bank across branches and project types. The final count will be published before checkout opens.",
      },
      {
        question: "Is this branch-specific?",
        answer:
          "The bank is being organised by branch (CSE/IT, ECE, EEE, Mechanical and Civil) and by project type, with a shared core of questions every panel tends to ask.",
      },
      {
        question: "When can I buy it?",
        answer:
          "Checkout is not live in this build. The buy button stays disabled with a clear coming-soon state until payments and delivery are implemented and tested.",
      },
    ],
  },
];

export const productCategories: { value: "all" | ProductCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submit", label: "Submit" },
  { value: "format", label: "Format" },
  { value: "viva", label: "Viva" },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
