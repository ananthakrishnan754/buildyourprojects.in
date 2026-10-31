# Phase 1 — Deep Research: product shortlist + design patterns

Owner: Scout. Source of truth: `docs/BRIEF.md`.
Date: 2026-10-31. Branch: `rebuild/storefront`.

**How to read this report.** Every factual claim carries a URL and, where the page
shows one, a date. Vendor self-reported traction ("700K+ assignments", "10 lakh+
learners") is labelled **vendor claim** and was not independently verified. Where I
could not verify something, it says **unverified** instead of a number. Prices were
read on 2026-10-31 and change often; treat them as bands, not quotes.

**What this phase does not do.** No site code, no design, no implementation. The
launch set below is a recommendation for Phase 2/3 to accept or reject.

---

## 0. Method and its limits

- Read marketplace listings (Topmate, Gumroad, Etsy India, Instamojo), Indian
  creator stores, Reddit threads, and competitor product pages for student-facing
  digital goods.
- Sampled Indian AI study apps and AI deck/resume tools for price anchors.
- Read the payment-aggregator terms for Razorpay and Cashfree directly.
- Reviewed award-gallery and design-system write-ups for storefront patterns.

Limits, stated up front:

1. **Sales counts are rarely public.** Gumroad and Topmate show some counts; most
   Indian creator stores do not. Demand is therefore inferred from *listing
   density, price dispersion, and repeated seller behaviour*, not from revenue.
2. **Short-video metrics are not verifiable.** Instagram/YouTube do not expose
   stable public view counts to an unauthenticated fetch, and screenshots in search
   results are not evidence. Any "this Reel went viral" claim in this report is
   marked **unverified**; I did not use one to justify a product.
3. **Build-hour estimates are mine.** They are engineering judgements, not measured
   data, and are marked as estimates.
4. **Razorpay's India merchant fee is not published as a single number** on the
   page I could read. Margin maths uses explicit fee assumptions and a sensitivity
   table instead of pretending to a precise rate.

---

# Part A — Products (80%)

## 1. What Indian students actually pay for

### 1.1 Price bands by channel

| Channel | What sells to students | Observed price band | Evidence |
|---|---|---|---|
| Topmate | E-books / guides | ₹199–₹1,999 (platform-stated average) | [topmate.io/features/digital-products](https://topmate.io/features/digital-products), accessed 2026-10-31 |
| Topmate | Templates (Notion, decks, Excel) | ₹299–₹2,999 (platform-stated average) | same page |
| Topmate | "Digital tools" (calculators, trackers, scripts) | ₹499–₹4,999 (platform-stated average) | same page |
| Topmate | DSA interview book | ₹299 (discounted from ₹499) | [topmate.io/roadsidecoder](https://topmate.io/roadsidecoder), accessed 2026-10-31 |
| Topmate | Student earning guide, 54 sales shown | ₹499 (from ₹899) | [topmate.io/hardware_geek/2179465](https://topmate.io/hardware_geek/2179465), accessed 2026-10-31 |
| Topmate | CS-student project guide | ₹39 | [topmate.io/techtalkswithaish/1943334](https://topmate.io/techtalkswithaish/1943334), accessed 2026-10-31 |
| Gumroad | Notion student OS, **589 sales** shown | USD-priced; template niche | [gridfiti.gumroad.com/l/ultimate-student-template](https://gridfiti.gumroad.com/l/ultimate-student-template), accessed 2026-10-31 |
| Gumroad | Student Notion template | $19.99 | [studytosuccess.gumroad.com/l/htuis](https://studytosuccess.gumroad.com/l/htuis), accessed 2026-10-31 |
| Etsy India | Digital note templates | ₹55–₹793 | [etsy.com/in-en/market/notes_template](https://www.etsy.com/in-en/market/notes_template), accessed 2026-10-31 |
| Etsy India | Engineering resume template, 1.4k reviews | ₹722 (50% off ₹1,444) | [etsy.com/in-en/market/engineering_templates](https://www.etsy.com/in-en/market/engineering_templates), accessed 2026-10-31 |
| Etsy India | Engineering mechanics cheat sheet, 12 reviews | ₹352 | same page |
| Telegram creator store | Exam subscription, 6 mo / 1 yr / 2 yr | ₹2,499 / ₹2,999 / ₹3,499 | [t.me/s/StudifiedPDF](https://t.me/s/StudifiedPDF), post dated 2026-01-03 |
| Telegram creator store | Current-affairs test series, 1 year | ₹199 | [t.me/s/PARCHAMCLASSES06](https://t.me/s/PARCHAMCLASSES06), post dated 2025-09-02 |
| Telegram bundle | "All courses", lifetime | ₹1,599 | [studyfever.in](https://www.studyfever.in/), accessed 2026-10-31 |
| PW (Physics Wallah) Pi | All lectures + notes + AI doubts | ₹499/month; "10 lakh+ learners" (**vendor claim**) | [pi.pw.live](https://pi.pw.live/), accessed 2026-10-31 |
| Unacademy | UPSC CSE subscription | ₹2,604/month | [unacademy.com UPSC subscribe](https://unacademy.com/goal/upsc-optional/Kscgy/subscribe), accessed 2026-10-31 |

**Read:** there is a working ₹39–₹499 impulse band and a separate ₹1,999–₹4,999
"serious" band. A ₹15,000 project service (the current site) sits outside both, so
the storefront should not try to sell at service prices.

### 1.2 Willingness-to-pay signals (not just listings)

- A student-side Reddit post asks where to sell notes and gets "sell it to your
  juniors" as the top answer — distribution is the bottleneck, not willingness
  ([r/IndianSideHustle, 2026-09-20](https://www.reddit.com/r/IndianSideHustle/comments/1wla324/where_can_i_post_my_notes_and_get_some_money/)).
- Sellers already price tiny services: typing at ₹50/10 pages
  ([r/indianstudents, 2025-05-11](https://www.reddit.com/r/indianstudents/comments/1kk35xk/typing_service_50_for_10_pages_convert/)),
  handwritten rewriting at $0.50/page
  ([r/IndianFreelancers, 2025-12-24](https://www.reddit.com/r/IndianFreelancers/comments/1pup61v/im_a_college_student_offering_neat_handwritten/)),
  resume makeover at ₹100
  ([r/Indiajobs, 2025-11-11](https://www.reddit.com/r/Indiajobs/comments/1ouev4l/offering_resume_makeover_help_premium_templates/)).
- A founder asking ₹400–750/**month** for a resume tool was told to charge
  **per download** because "resume is more like one time thing" — the top comment
  ([r/indianstartups, 2025-07-22](https://www.reddit.com/r/indianstartups/comments/1m6dn44/for_indian_students_job_seekers_would_you_pay_5_9/)).
  This is direct evidence against subscriptions for one-shot products.
- Students pay ₹99–₹399/month for AI study apps: Studora ₹99
  ([studoraedu.lovable.app](https://studoraedu.lovable.app/)), SageFlow ₹199
  ([edulab.in/sageflow](https://edulab.in/sageflow.html)), SuperrBrain ₹399
  ([superrbrain.com](https://www.superrbrain.com/)), Studentify ₹299
  ([studentify.net](https://studentify.net/)), padho.ai ₹999
  ([padho.ai/pricing](https://padho.ai/pricing)) — all accessed 2026-10-31.
  So subscriptions *can* work for a recurring study habit, but the category is
  crowded and content-heavy.

### 1.3 What is crowded vs. what is open

| Category | Verdict | Why |
|---|---|---|
| Generic AI study app (doubts, flashcards, planner) | Crowded — avoid hero | At least six Indian apps at ₹99–₹999/mo plus PW at ₹499/mo (§1.2) |
| Citation generator | Crowded — avoid | Strong free products; paid is $24/yr–£6.99/mo ([MyBib](https://www.mybib.com/blog/a-2026-update), [CiteThisForMe](https://www.itechguides.com/products/cite-this-for-me/pricing/)) |
| Generic AI deck generator | Crowded — avoid | Gamma ₹400/mo, SlidesAI $10/mo, Slideso ₹399/mo (§1.4) |
| Handwriting converter | Excluded on policy | Free tools plus ₹5/page paid (§1.4, §3.3) |
| Project submission packs (code + report + PPT + viva) | **Open at ₹499** | Competitors are small/un-branded and price ₹299–₹13,500 (§1.4) |
| College-format report/PPT *formatting* (not writing) | **Open** | Docs are bundled into expensive services; few sell the formatter alone |
| Branch/project viva banks | **Open** | Mostly free SEO pages or kit bundles; no strong paid standalone brand found |

### 1.4 Competitor price map for the recommended categories

| Competitor | Offer | Price | Source |
|---|---|---|---|
| SubmitKit | Mini project: runnable code + IEEE black book + PPT + 25 viva Q&A | **₹299** (mini), **₹499** (major) | [submitkit.in/projects](https://submitkit.in/projects?tier=MINI), accessed 2026-10-31 |
| projectkit.in | Ready-built hardware kit + report + PPT + code + 25 viva questions | from **₹1,199** | [projectkit.in](https://projectkit.in/), accessed 2026-10-31 |
| finalyearkit.com | 34 project kits | from **₹1,499** | [finalyearkit.com](https://finalyearkit.com/final-year-projects), accessed 2026-10-31 |
| GetYourProject | Source + report + slides + viva kit, 10–12 days | **₹13,500** (from ₹15,000) | [getyourproject.in](https://getyourproject.in/final-year-projects), accessed 2026-10-31 |
| CruxBit | Custom final-year build | **₹4,000–₹25,000+** | [cruxbit.tech](https://cruxbit.tech/services/college-projects), accessed 2026-10-31 |
| projectbuddyy.in | Free SEO library of formats + viva Q&A (content marketing, no price shown) | Free | [projectbuddyy.in/resources](https://projectbuddyy.in/resources), accessed 2026-10-31 |
| Gamma | AI decks | ₹400/mo yearly, ₹500 monthly (checked 2026-09-30) | [startuporiginals.in](https://startuporiginals.in/news/ai/best-ai-tool-for-ppt) |
| SlidesAI | AI decks in Slides/PowerPoint | $10/user/mo, $120/yr; free 12 decks/yr | [slidesai.io/pricing](https://www.slidesai.io/pricing), accessed 2026-10-31 |
| Slideso | AI decks, India pricing | ₹399/mo | [slideso.com/pricing](https://slideso.com/pricing), accessed 2026-10-31 |
| acry.ai | Student resume/career workspace | ₹299/mo | [acry.ai/pricing](https://acry.ai/pricing), accessed 2026-10-31 |
| LikhAI | Text → handwriting PDF | **₹5/page** | [likhai.in](https://likhai.in/), accessed 2026-10-31 |
| Veetu Paadam | Learns your handwriting | ₹199/mo | [veetupaadam.com](https://veetupaadam.com/), accessed 2026-10-31 |
| Intently | ChatGPT → handwritten assignment | price not shown; "700K+ assignments created" (**vendor claim**) | [intently.in](https://www.intently.in/), accessed 2026-10-31 |
| NoteGenius | Notes → assignment/PPT/flashcards | ₹29 / 25 credits; ₹49 / 50 credits | [notesgenius.lovable.app](https://notesgenius.lovable.app/), accessed 2026-10-31 |
| Scrib (EasyLearnova) | Topic → handwritten exam notes | 10 credits = ₹89 | [scrib.easylearnova.com](https://scrib.easylearnova.com/), accessed 2026-10-31 |

**Key pricing insight:** the ₹299–₹499 band is already validated by SubmitKit for
exactly our hero concept. We should match, not undercut to ₹99 — undercutting
signals a worse artefact and destroys the margin needed for video ads.

---

## 2. The "GPT calculator" pattern, generalised

The literal "GPT calculator" is a token-cost calculator
([gptcalculator.xyz](https://gptcalculator.xyz/), Show HN 2023-03-29,
[news.ycombinator.com/item?id=35352247](https://news.ycombinator.com/item?id=35352247)).
That is not the interesting part. The pattern the brief means is:

> one input → one visible transformation → one downloadable artefact, in under
> 30 seconds, with no signup.

Why it works in a 15-second vertical video:

1. **Single input the viewer can imagine typing.** "Paste your assignment."
2. **Transformation is visual.** Text becomes handwriting; notes become slides;
   a form becomes a 60-page report.
3. **Output is a file.** A file is proof; a chat answer is not.
4. **No account friction.** The viewer can reproduce it immediately after the Reel.
5. **Price is a rounding error.** ₹49–₹499 is below the "think about it" threshold.

**Checklist used in scoring:** can the demo run in ≤15s with no cuts? Is the
output visually different from the input? Can a viewer repeat it in <60s on a
phone? Is the deliverable a file? Does it still make sense without an account?

Candidates that fail the visual test (viva banks, idea packs) are still viable, but
they need a different content format: quiz-style Reels ("Can you answer this viva
question?") rather than a tool demo.

---

## 3. Candidate longlist and scoring

### 3.1 Scoring method

Each candidate scored 0–100:

| Factor | Weight | How scored |
|---|---|---|
| Demand evidence | 30% | 5 = multiple paid competitors with public prices; 1 = only forum speculation |
| Build effort | 15% | 5 = ≤20h; 3 = ~50h; 1 = ≥100h (inverse of estimate) |
| Gross margin | 15% | 5 = ≥90% after fees; 3 = 75–85%; 1 = <60% |
| Video-friendliness | 20% | 5 = visible transformation in <15s; 3 = needs explanation; 1 = not visual |
| Policy risk | 5% | 1 = low risk (inverted); 5 = likely prohibited / facilitates cheating |
| Repeat purchase | 15% | 5 = every semester; 1 = once per degree |

Build hours are **estimates**. Policy risk is judged against §5, not against
whether the product is technically legal.

### 3.2 Score table

| # | Candidate | Demand evidence | Build (est. h) | Price (INR) | Margin | Video /5 | Policy risk /5 (1=low) | Repeat /5 | **Score** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Project Submission Kit** (working mini-project + report + PPT + viva) | SubmitKit ₹299/₹499; projectkit ₹1,199; finalyearkit ₹1,499 | 50 | 499 | 92% | 5 | 1 | 4 | **90** |
| 2 | **College-format Report + PPT Formatter** (formats user's own content) | Docs are a paid component in every kit; CruxBit/GetYourProject sell docs at service prices | 35 | 299 | 90% | 5 | 2 | 5 | **89** |
| 3 | **Viva Vault** (branch + project Q&A bank, flashcards) | SubmitKit bundles 25 viva Q&A; projectbuddyy runs a free viva library | 30 | 149 | 95% | 3 | 1 | 5 | **82** |
| 4 | Mini-project ideas + synopsis pack | projectbuddyy topics; finalyearkit ₹1,499 | 15 | 99 | 95% | 3 | 1 | 3 | **73** |
| 5 | Resume + portfolio + GitHub README kit | Etsy engineering resume ₹722 (1.4k reviews); Reddit ₹100 makeover; acry ₹299/mo | 20 | 199 | 95% | 4 | 1 | 1 | **71** |
| 6 | Generic AI deck generator/template pack | Gamma ₹400/mo; SlidesAI $10/mo; Slideso ₹399/mo | 60 | 199 | 80% | 4 | 1 | 3 | **71** |
| 7 | Semester notes / cheat-sheet packs | Telegram ₹2,499–₹3,499/yr; Etsy cheat sheet ₹352; Topmate ₹39–₹299 | 80 | 149 | 90% | 3 | 3 | 2 | **65** |
| 8 | GitHub README / portfolio templates only | Etsy/Gumroad template listings | 10 | 99 | 95% | 3 | 1 | 1 | **61** |
| 9 | **Handwriting assignment generator** | LikhAI ₹5/page; Intently vendor-claims 700K+ assignments; free competitors | 40 | 79 | 85% | 5 | **5** | 3 | **80 (disqualified)** |
| 10 | **AI assignment answer generator** | NoteGenius ₹29/25 credits; Scrib ₹89/10 credits | 50 | 99 | 80% | 5 | **5** | 3 | **80 (disqualified)** |

### 3.3 Why the two highest-video candidates are excluded

**Handwriting generators** score 80 on the raw model — higher than the viva bank —
because they are perfect Reel material. They are excluded on policy, not on merit:

- The dominant marketed use is submitting work as if handwritten. LikhAI's own copy:
  "submit assignments minutes before the deadline without lifting a pen"
  ([likhai.in](https://likhai.in/), accessed 2026-10-31). AssignmentAI markets
  "Skip the endless GitHub bugs… 3 AM panics" and "submit assignments minutes
  before the deadline"
  ([assignmentai.in](https://www.assignmentai.in/)).
- That is deception of the institution, even where it is not illegal. The brief
  forbids ghost-writing/cheating services. Building the tool and then writing a
  disclaimer would not change the primary use.
- The category is also price-collapsing: free (WriteByHand, Handify) and ₹5/page
  (LikhAI) set the anchor ([writebyhand.in](https://writebyhand.in/),
  [handify.in/pricing](https://handify.in/pricing), both accessed 2026-10-31).

**AI assignment answer generators** are the same problem one step further: the
product *is* the ghost-writing. NoteGenius explicitly advertises "AI generates
complete assignment answers"
([notesgenius.lovable.app](https://notesgenius.lovable.app/)). Excluded.

**Semester notes/cheat-sheets** score 65 and carry a second risk: derivative
copyright. Reselling notes that compress a publisher's textbook is a takedown
target even when the notes are "yours". Only original, cited summaries would be
safe, and that is 80+ hours of content work per branch.

---

## 4. Recommended launch set (exactly 3)

### 4.1 HERO — "Submission Kit" — ₹499

**What it does.** A student picks one of 3–5 pre-built mini-projects (e.g. QR
attendance, IoT air-quality monitor, ML resume screener). They get a complete,
runnable submission pack, not a tutorial.

**Deliverable after purchase (ZIP + gated download page):**

1. Working source code, one-command run, seeded demo data.
2. IEEE-format report `.docx` with college-ready structure: abstract, literature
   survey, methodology, results, conclusion, references — with clearly marked
   "fill your own results" fields so the student owns the content.
3. 12-slide defence deck (`.pptx`) matching the report.
4. 25 project-specific viva Q&A with short model answers.
5. 4-minute demo video + a one-page "how to explain your project" script.
6. Setup guide (Windows + macOS), dependency list, troubleshooting.

**Price:** ₹499 (anchor ₹1,999). Bundle with the two supporting products: ₹799.

**Why it fits this audience and this site:**

- The site already sells custom projects at ₹15,200–₹18,000
  (`projects.html`). ₹499 is the same buyer at 1/30th the price, and it is an
  obvious upsell path to the custom build when the student needs customisation.
- SubmitKit proves the exact SKU at ₹299–₹499; projectkit/finalyearkit prove
  demand at ₹1,199–₹1,499. We sit in the validated band with a stronger artefact.
- Repeat purchase: mini-projects recur each semester and across juniors; the same
  buyer can return for a second domain.
- Zero AI cost at delivery; margin is payment fees only.
- Policy-safe: it is a study aid/starter kit. The report template is a format, and
  the student must fill in their own results and be able to explain the work.

**One-line video hook:**
> "Your entire project submission — working code, IEEE report, PPT and viva answers — for ₹499."

**Demo beats for a 15s Reel:** 0–3s show the blank college requirement; 3–7s run
the project; 7–11s flip through the 60-page report and deck; 11–15s show the viva
Q&A and price card.

### 4.2 SUPPORT 1 — "ReportForge" — ₹299

**What it does.** The student pastes their project details (title, abstract, tools,
modules, screenshots, results) and picks their university format. The tool returns
a formatted report `.docx` and a matching defence deck.

**Deliverable:** formatted `.docx` (auto TOC, heading numbering, figure/table
captions, reference list from the student's own citations), `.pptx` deck, and a
formatting checklist.

**Critical positioning:** it **formats what the student supplies**; it does not
generate the academic content. This keeps it a tool, not ghost-writing, and is the
line that must hold in copy, onboarding, and the UI.

**Price:** ₹299. Why: it is the single most complained-about, least-loved part of
submission (formatting), it is reusable every semester, and it is cheap enough to
buy without comparing.

**Why it fits:** every kit competitor bundles documentation; almost none sells the
formatter alone. It also cross-sells the hero ("already have a project? just format
it") and captures students who cannot afford ₹499.

**One-line video hook:**
> "Paste your project. Get a 60-page IEEE report and defence PPT in 3 minutes."

### 4.3 SUPPORT 2 — "Viva Vault" — ₹149

**What it does.** A searchable bank of 300+ viva questions with short model
answers, organised by branch (CSE/IT/ECE/EEE/Mech/Civil) and by project type, plus
flashcards and a "explain your project in 60 seconds" template.

**Deliverable:** web access + printable PDF + flashcard deck (CSV/Anki-compatible).

**Price:** ₹149. Why: low enough for an impulse buy the night before viva, high
enough to clear fees; content-heavy but one-time production cost.

**Why it fits:** viva is the highest-anxiety moment and the least-served; the
existing site already has project content authority; it is a natural free-sample
funnel (10 free questions → ₹149 full bank).

**One-line video hook:**
> "The 300 viva questions your examiner actually asks — with answers you can memorise tonight."

**Format note:** this is not a visual tool, so its Reels are quiz-format ("Can you
answer this viva question? 90% of CSE students can't."), not screen recordings.

### 4.4 Ladder and bundle economics

```
Free: 10 viva questions + 1 sample project PDF
  → ₹149 Viva Vault
  → ₹299 ReportForge
  → ₹499 Submission Kit
  → ₹799 Bundle (all three)
  → ₹15,200+ custom project (existing service)
```

| Product | Price | Fee @3% + GST (est.) | Fee @5% + ₹3 + GST (Instamojo digital) | Fee @10% (Topmate) | Net @5% | Margin @5% |
|---|---|---|---|---|---|---|
| Viva Vault | ₹149 | ~₹4.6 | ~₹12.5 | ~₹14.9 | ~₹136 | ~92% |
| ReportForge | ₹299 | ~₹9.2 | ~₹21.3 | ~₹29.9 | ~₹278 | ~93% |
| Submission Kit | ₹499 | ~₹15.4 | ~₹32.6 | ~₹49.9 | ~₹466 | ~93% |
| Bundle | ₹799 | ~₹24.6 | ~₹49.7 | ~₹79.9 | ~₹749 | ~94% |

Fees are estimates: 3% is a placeholder for a direct PG, 5% + ₹3 is Instamojo's
published digital-goods rate, 10% is Topmate's published commission. GST at 18% on
the fee only. Razorpay's exact India rate must be confirmed at onboarding
(**unverified**).

**Blended target:** AOV ₹380–₹450; at 100 orders/month that is ₹38k–₹45k gross,
~₹35k–₹42k net. This is a storefront test, not the main business — the custom
project service remains the revenue anchor.

**AI cost:** ReportForge is the only product with variable cost. If it uses an LLM
for restructuring (not writing), estimate ₹3–₹12 per report at current small-model
prices (**unverified**, depends on provider). At ₹299, even ₹30/use leaves >85%
margin. Enforce server-side rate limiting and a per-order token cap.

**Build estimates (to be validated in Phase 3):**

| Work | Estimate |
|---|---|
| 3 project kits (code + docs + video) | 30–40h |
| ReportForge (DOCX/PPTX generation + templates) | 25–35h |
| Viva Vault content + UI | 25–35h |
| Storefront product pages + delivery | Phase 3 scope |
| **Total product content/build before storefront** | **~80–110h** |

---

## 5. Policy: what we will and will not sell

### 5.1 Product policy (owner-facing)

**Allowed:** study aids, templates, formatters, starter kits, question banks,
calculators, checklists, and tools that help a student do their own work faster.

**Not allowed:** anything whose primary use is to submit work the student did not
do or cannot explain — ghost-written assignments, "complete your assignment" AI,
handwriting converters marketed for submission, pre-written answers sold as
original work, or fake certificates/IDs.

**Copy rules that follow from this:**

- Never say "submit without doing the work", "beat your deadline", "looks like you
  wrote it", or "your teacher won't know".
- Say "format", "structure", "starter", "explain", "prepare", "check".
- Every kit page carries a one-line integrity note: *"You must be able to explain
  and defend this work. Your college's rules apply."*

### 5.2 Razorpay prohibited-business policy

Source: [razorpay.com/terms](https://razorpay.com/terms/), clause 17 "Prohibited
Products and Services", accessed 2026-10-31. (The Singapore page carries the same
list: [razorpay.com/sg/tnc](https://razorpay.com/sg/tnc/).)

Relevant clauses and how they hit us:

| Clause | Text (summary) | Impact |
|---|---|---|
| 8 | "Copyrighted media … unauthorized copies of books, music, movies, and other licensed or protected materials" | Do not resell textbook-derived notes, publisher PDFs, or third-party course videos. |
| 9 | "Copyrighted software … unauthorized copies" | Every kit must be original code or permissively licensed code with attribution. |
| 17 | "Illegal goods … materials … enabling illegal acts" | The clause that would catch a cheating product, if a bank decided to apply it. |
| 33/44 | Any product not compliant with applicable law | Consumer-protection and IT Rules compliance (refund/terms pages). |
| 34 | Services "prone to Buy & Deny attitude … chargeback and fraud losses" | Digital goods are chargeback-prone. Needs a clear, visible refund policy. |
| 37 | Intangible goods where the partner/acquiring bank judges the business "detrimental to the image" | Discretionary. A clean, professional storefront reduces this risk. |

**Important:** the list does **not** name "assignment help", "academic writing", or
"coaching" explicitly. The risk is discretionary (clauses 17, 34, 37), not a named
prohibition. That is an argument for conservative positioning, not for testing the
line.

### 5.3 Cashfree prohibited-business policy

Sources: [cashfree.com/tnc](https://www.cashfree.com/tnc/) and
[cashfree.com/docs/help/onboarding-related/onboarding-faqs](https://www.cashfree.com/docs/help/onboarding-related/onboarding-faqs),
accessed 2026-10-31.

- Same negative list as Razorpay (copyrighted media/software, illegal goods,
  counterfeit, etc.), plus "Risky Categories" that include **SaaS** and
  **Restricted Categories** that require risk-team approval.
- **The decisive difference:** Cashfree's onboarding FAQ says the **Education**
  line of business requires a "UGC, ICSE, CBSE, or AICTE certificate". A solo
  creator selling study aids cannot produce that.
- **Implication:** do not onboard as "Education". Onboard as **digital goods /
  e-commerce / SaaS** with a clear product description ("downloadable study
  templates and software tools"). If an underwriter reclassifies the business as
  education, onboarding may stall. Ask before building the integration.

### 5.4 Practical onboarding recommendation

1. Prefer a mainstream Indian PG with a published digital-goods policy and clear
   refund rules; keep Razorpay behind a config flag as the brief requires.
2. Prepare these pages **before** applying: Terms, Privacy, Refund/Cancellation,
   Contact, and a "What you get / what you must do yourself" product page.
3. Describe the business as "digital study templates and software tools for
   engineering students", not "assignment help" or "academic services".
4. Keep a written refund policy that covers non-delivery and duplicate charges;
   digital-goods "all sales final" alone increases chargeback risk.
5. Do not process live money until the owner confirms (brief §10).

### 5.5 IP checklist for every product

- [ ] Code written by us, or MIT/Apache-licensed with `NOTICE` attribution.
- [ ] No textbook scans, publisher figures, or third-party slide decks.
- [ ] No college logos, no real student names/screenshots without consent.
- [ ] Report templates are *formats*, not filled-in content.
- [ ] Viva answers are original explanations, not copied from a question bank.
- [ ] Product licence: personal use, no redistribution (state it on the page).

---

# Part B — Design inspiration (20%)

Scope: patterns for a **dark, high-motion storefront** that converts mobile,
video-driven traffic. References below are award galleries and design-system
write-ups; I extracted mechanics, not skins.

## 6. Eight patterns to borrow

Scope: mechanics for a dark, high-motion storefront that converts mobile,
video-driven traffic. I extracted mechanics, not skins.

### P1 — Pinned scroll story (one visual, three text beats)
**Reference:** [we.inc scrollytelling](https://we.inc/components/collections/scrollytelling) and [Awwwards J-Vers](https://www.awwwards.com/inspiration/scroll-storytelling-j-vers).
**Borrow:** a `position: sticky` visual pinned at `top: 0` with short text steps
scrolling past; `IntersectionObserver` sets the active step and *one* thing changes
in the visual per step (a line appears, a page turns, a price flips). Use it to pin
a phone mockup while three beats scroll: code → report → viva.
**Don't:** pin a visual that never changes; a static image is a plain card grid.

### P2 — Sticky card stack with depth
**Reference:** [GodUI ScrollStack anatomy](https://godui.design/docs/lab/layout/scroll-stack/learn).
**Borrow:** every card is `position: sticky` at the same offset; one shared scroll
progress drives each card's `scale`, `brightness`, and `blur` as it is buried; a
≈16px `translateY` peek keeps the buried edge visible. Depth = `total - 1 - index`;
clamp the scale so a 2-card stack does not shrink to a speck.
**Why:** the 3-product launch set is literally a stack, and the process section
(enquiry → build → viva) gets depth without WebGL. Cost: one scroll listener.

### P3 — One loud hero effect on disciplined dark chrome
**References:** Stripe's canvas mesh gradient ([uiscanner, 2026-07-04](https://uiscanner.com/blog/best-designed-saas-websites-to-study)) and Vercel's true-black discipline ([Dupe, 2026-03-18](https://dupe.design/blog/design-dna-extraction)).
**Borrow:** one animated gradient/spotlight behind the hero only; elsewhere a 4–5
step grey ladder (`#000`, `#0A0A0A`, `#141414`, `#2A2A2A`, `#888`), tight display
tracking (−0.02em to −0.04em), one accent used once per viewport.
**Why:** video traffic gives the hero ~2 seconds; one moving element reads premium,
five read slow. Ship a static poster for reduced motion and slow connections.

### P4 — Bento grid with hover-revealed demo
**Reference:** Linear's bento grid and "homepage is the product" ([toimi.pro, 2026-04-21](https://toimi.pro/blog/best-saas-website-designs/); [uiscanner](https://uiscanner.com/blog/best-designed-saas-websites-to-study)).
**Borrow:** 4–6 tiles, size = hierarchy (one 2×2 hero tile, rest 1×1), uniform
gutters, hover plays a muted 2–3s loop of real output. Mobile collapses to one
column with static images.
**Why:** the grid must show *output*, not illustrations; the hero product gets
double space without a second layout.

### P5 — Kinetic headline word-swap
**Reference:** Linear swaps "teams"/"agents" in one sentence ([toimi.pro](https://toimi.pro/blog/best-saas-website-designs/)).
**Borrow:** one fixed sentence, one rotating noun — "Everything you need to
**submit** / **format** / **defend**." Swap every ~2.4s through a 200ms vertical
mask; stop on `prefers-reduced-motion`.
**Why:** one hero sells three products, and it is a strong 3-second Reel opening.

### P6 — Cursor-following spotlight card reveal
**Reference:** Awwwards Honorable Mention *Ognissanti*, "content-reveal spotlight on mouse hover" ([awwwards.com/sites/ognissanti](https://www.awwwards.com/sites/ognissanti)).
**Borrow:** a radial gradient mask follows the pointer over a product card,
revealing a second layer (after-state or price) plus a 1px border highlight; update
CSS custom properties on `pointermove` throttled to rAF; disable on touch.
**Why:** interactivity without video, and no canvas.

### P7 — Video-first product cards, chrome-free
**Reference:** Godly's autoplaying muted previews on bare media plates ([design.md](https://github.com/Shuvam-Banerji-Seal/modern-design.md/blob/main/websites/godly/design.md); [profile](https://jeenavanderheul.com/skilltree/resource/godly/)).
**Borrow:** 6–8s muted loop per product (`autoplay loop playsinline
preload="none"`), `poster` JPG, no border/shadow, one price pill; lazy-load below
the fold; never more than one loop playing on mobile.
**Why:** our products *are* transformations; one loop is both the demo and the ad.
Budget ≤1.5 MB per loop (brief §6), with a static fallback for data saver.

### P8 — Specific-number proof band (not a logo wall)
**References:** Stripe's stats band and Vercel's single sentence with three named customer metrics ([Plinth, 2026-06-09](https://plinthstudio.dev/blog/saas-homepage-teardowns)).
**Borrow:** 3 proof items, each a specific number, directly under the hero; replace
a logo wall with one sentence. Until real numbers exist, use *deliverable* numbers
("60-page report", "25 viva answers"), never invented customer counts.

## 7. Motion system (so Phase 2 has tokens, not vibes)

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 120ms | hover colour, focus ring |
| `--dur-base` | 200ms | button press, card lift |
| `--dur-slow` | 400ms | reveals, mask swaps |
| `--dur-story` | 700ms | section-level transitions |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | entrances |
| `--ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | layout moves |
| stagger | 40–60ms | card grids, list reveals |

Rules:

- Animate **transform and opacity only** during scroll. Never animate `height`,
  `top`, or `filter` on large surfaces while scrolling.
- One scroll library: Lenis for smooth scroll + GSAP ScrollTrigger for pinning
  (brief §4). Do not stack Framer Motion and GSAP on the same element.
- `prefers-reduced-motion: reduce` → no pinning, no scrub, no autoplay; keep all
  content visible. Start content visible in HTML and let JS add the hidden state,
  so a JS failure never hides the offer.
- Mobile: cap pinned sections at one per page; pinning + video + blur is the usual
  cause of jank on ₹10k Android phones.

## 8. What not to copy

- **Gradient halos with no relationship to the section** and motion that fires on
  every scroll event — the documented failure mode of Linear clones
  ([MeritWEB](https://www.meritweb.com/guides/linear-and-the-dark-page/)).
- **Pure-black text at 60–80% grey** on dark surfaces; it fails contrast. Use a
  calibrated grey ladder and check WCAG AA.
- **Autoplaying video with sound**, or more than one autoplay loop on mobile.
- **Custom cursors** on a storefront; they break tap targets and add no conversion.
- **Copying a brand's skin** (Linear purple, Stripe mesh, Vercel blue). Borrow the
  mechanic, re-skin to our tokens.

---

## 9. Risks, unknowns, and what Phase 2 must decide

| # | Risk / unknown | Status | Mitigation |
|---|---|---|---|
| 1 | ₹499 kit cannibalises ₹15k custom service | **Unverified** | Position kit as "starter, not customisation"; upsell on the kit page; track attach rate |
| 2 | ReportForge drifts into ghost-writing | Design risk | UI only formats user-supplied fields; no "generate content" button; copy review before launch |
| 3 | Payment onboarding rejected as "education" | Real risk (Cashfree FAQ) | Onboard as digital goods/SaaS; have Terms/Refund pages ready; keep Razorpay fallback |
| 4 | Chargebacks on digital goods | Real risk (Razorpay cl. 34) | Clear deliverables, refund policy, delivery confirmation email |
| 5 | Viva content accuracy per branch | Execution risk | Start with CSE/IT + ECE only; have a student reviewer per branch |
| 6 | AI cost per ReportForge use | **Unverified** | Cap tokens per order; log cost; price at ₹299 leaves headroom |
| 7 | Reel performance claims | **Unverified** | Do not put view counts in the report; measure after launch with UTM links |
| 8 | Build-hour estimates | Estimates | Re-estimate in Phase 3 after a 1-day spike |

**Open question for the owner (only if it blocks Phase 3):** are the 3 kit domains
acceptable (QR attendance, IoT air-quality monitor, ML resume screener), or should
they match the branches the existing service sells most? This does not block
research or design.

---

## 10. Sources

All accessed 2026-10-31 unless a publication date is shown. Grouped to keep this
report readable; each link is the exact page cited above.

**Marketplaces / creator economy** — [Topmate digital products](https://topmate.io/features/digital-products) · [Topmate pricing](https://topmate.io/pricing) · [RoadsideCoder](https://topmate.io/roadsidecoder) · [Hardware Geek](https://topmate.io/hardware_geek/2179465) · [Aishwarya Lakshmy](https://topmate.io/techtalkswithaish/1943334) · [Gumroad pricing](https://gumroad.com/pricing) · [Student OS](https://gridfiti.gumroad.com/l/ultimate-student-template) · [Student Second Brain](https://studytosuccess.gumroad.com/l/htuis) · [Etsy notes](https://www.etsy.com/in-en/market/notes_template) · [Etsy engineering](https://www.etsy.com/in-en/market/engineering_templates) · [Instamojo fee calculator](https://instamojo.zendesk.com/hc/en-us/articles/360059033872-Online-store-fee-calculator) · [Instamojo PG pricing](https://www.instamojo.com/payment-gateway/) · [Studified Telegram](https://t.me/s/StudifiedPDF) (2026-01-03) · [Parcham Telegram](https://t.me/s/PARCHAMCLASSES06) (2025-09-02) · [Studyfever](https://www.studyfever.in/) · [PW Pi](https://pi.pw.live/) · [Unacademy UPSC](https://unacademy.com/goal/upsc-optional/Kscgy/subscribe)

**Reddit** — [IndianSideHustle](https://www.reddit.com/r/IndianSideHustle/comments/1wla324/) (2026-09-20) · [indianstudents](https://www.reddit.com/r/indianstudents/comments/1kk35xk/) (2025-05-11) · [IndianFreelancers](https://www.reddit.com/r/IndianFreelancers/comments/1pup61v/) (2025-12-24) · [Indiajobs](https://www.reddit.com/r/Indiajobs/comments/1ouev4l/) (2025-11-11) · [indianstartups](https://www.reddit.com/r/indianstartups/comments/1m6dn44/) (2025-07-22) · [LawStudentsIndia](https://www.reddit.com/r/LawStudentsIndia/comments/1tcybvg/) (2026-05-14) · [sidehustle](https://www.reddit.com/r/sidehustle/comments/1ph73dq/) (2025-12-08)

**Competitors / price anchors** — [SubmitKit](https://submitkit.in/projects?tier=MINI) · [projectkit](https://projectkit.in/) · [finalyearkit](https://finalyearkit.com/final-year-projects) · [GetYourProject](https://getyourproject.in/final-year-projects) · [CruxBit](https://cruxbit.tech/services/college-projects) · [projectbuddyy](https://projectbuddyy.in/resources) · [SlidesAI](https://www.slidesai.io/pricing) · [Slideso](https://slideso.com/pricing) · [StartupOriginals PPT comparison](https://startuporiginals.in/news/ai/best-ai-tool-for-ppt) (2026-10-03) · [acry.ai](https://acry.ai/pricing) · [LikhAI](https://likhai.in/) · [AssignmentAI](https://www.assignmentai.in/) · [WriteByHand](https://writebyhand.in/) · [Handify](https://handify.in/pricing) · [Intently](https://intently.in/) · [Veetu Paadam](https://veetupaadam.com/) · [NoteGenius](https://notesgenius.lovable.app/) · [Scrib](https://scrib.easylearnova.com/) · [MyBib](https://www.mybib.com/blog/a-2026-update) · [CiteThisForMe pricing](https://www.itechguides.com/products/cite-this-for-me/pricing/) · [Studora](https://studoraedu.lovable.app/) · [SageFlow](https://edulab.in/sageflow.html) · [SuperrBrain](https://www.superrbrain.com/) · [Studentify](https://studentify.net/) · [padho.ai](https://padho.ai/pricing)

**Payments policy** — [Razorpay terms, clause 17](https://razorpay.com/terms/) · [Razorpay SG terms](https://razorpay.com/sg/tnc/) · [Cashfree terms](https://www.cashfree.com/tnc/) · [Cashfree onboarding FAQ](https://www.cashfree.com/docs/help/onboarding-related/onboarding-faqs)

**Design** — [we.inc scrollytelling](https://we.inc/components/collections/scrollytelling) · [Awwwards scroll storytelling](https://www.awwwards.com/inspiration/scroll-storytelling-j-vers) · [GodUI ScrollStack](https://godui.design/docs/lab/layout/scroll-stack/learn) · [Ognissanti](https://www.awwwards.com/sites/ognissanti) · [uiscanner](https://uiscanner.com/blog/best-designed-saas-websites-to-study) (2026-07-04) · [Dupe design DNA](https://dupe.design/blog/design-dna-extraction) (2026-03-18) · [toimi.pro](https://toimi.pro/blog/best-saas-website-designs/) (2026-04-21) · [Plinth teardown](https://plinthstudio.dev/blog/saas-homepage-teardowns) (2026-06-09) · [MeritWEB](https://www.meritweb.com/guides/linear-and-the-dark-page/) · [Godly design.md](https://github.com/Shuvam-Banerji-Seal/modern-design.md/blob/main/websites/godly/design.md) · [Godly profile](https://jeenavanderheul.com/skilltree/resource/godly/)

## 11. One-paragraph handoff to Phase 2

Build the storefront around three products at ₹149 / ₹299 / ₹499 (bundle ₹799),
with the Submission Kit as hero. Keep every claim a deliverable claim ("60-page
report", "25 viva answers") until real order data exists. Design in near-black with
one accent, one pinned story, one card stack, one spotlight interaction, and
video-first product cards; everything else stays quiet so the hero effect and the
product loops can be loud. Treat the handwriting/assignment-generator category as
out of scope on policy grounds, and onboard payments as digital goods, not
education.
