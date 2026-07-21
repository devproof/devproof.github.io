# devproof.ai website — design note (2026-07-21)

Static marketing + docs site, drafted from `private/pitch/devproof-pitch.pdf`.
Lives in `private/website/` (open with `index.html`; no build step).

## Audiences & jobs

1. **Developers** — primary. Job: get them to the GitHub repo and the quickstart.
2. **Engineering managers** — primary. Job: credibility — what it is, why own it,
   what the components are.
3. **Investors** — REMOVED for now (user decision 2026-07-21). A dark `.band`
   section ("The models are free. The moat is the platform that runs them at
   scale." + fixed-cost-asset line + request-the-deck mailto) was built and
   then taken out of index.html; the `.band` CSS stays in site.css if it
   comes back.

## Content decisions

- **Two use cases, in order: Managed Agents first, Model Hosting second.**
  Deck slides 6, 11, 12 drive the agents story; 8, 10 drive hosting.
- **Deck slides 3–4 (fear/risk: "one policy decision from dark", "four ways
  renting breaks you") are deliberately weak on the web**: compressed into one
  short "Why own it" paragraph with four inline words (access · cost · outage ·
  scale). No breaking-news card, no risk grid.
- GitHub repo linked prominently: https://github.com/devproof/devproofai
  (header, hero CTA, components section, footer).
- **Components explained with live screenshots** (captured from the running
  console): Console, Control plane, Operator, Gateway, Session runner, Catalog.
- **Screenshots come from a purpose-built demo, not test data** (user decision
  2026-07-21): workspace "Meridian Support" — a fictional robotics-fleet support
  operation. `support-triage` agent works an inbox CSV export, reads the
  `support-kb` LLM wiki, delegates KB updates to `kb-librarian` (the wiki's
  single writer). Runs on the `support` routing → glm-5.2 (per user: no qwen —
  too weak). Old dremio/profile test data was deleted with the user's permission.
- **Feature emphasis requested by the user**: full skill support, full MCP
  support, isolated secure session containers — first-class cards on the
  landing page.
- **Basic docs** under `docs/`: getting started (helm install → deploy →
  connect → first agent), concepts (workspaces, agents, sessions, environments,
  skills, memory, wikis, routings), API/integration (OpenAI + Anthropic
  compatible, Claude Code, Python client).

## Tokens (pinned by existing brand — blueprint identity)

- Color: paper `#EAEEF3` bg · ink navy `#0F2038` · blueprint blue `#1E5BC6` ·
  cyber cyan `#57E6FF` (dark panels only) · proof orange `#E8641B` (accents,
  CTAs, checkmarks) · muted `#5C6B7D` · line `#D3DBE6`.
- Type: IBM Plex Sans Condensed (display, bold uppercase) / IBM Plex Sans
  (body) / IBM Plex Mono (eyebrows `// like-this`, code, captions).
- Layout: light blueprint graph-paper background (like the deck), dark navy
  terminal panels as contrast, screenshots in browser-chrome frames.

## Round-2 decisions (user feedback 2026-07-21)

- Hero title is TECHNICAL and modest ("LLM serving + managed agents on
  Kubernetes."), not the brand tagline — that lives in the logo lockup only.
- No unexplained Q.E.D. lines in copy (the hero terminal now ends in a plain
  blinking prompt); the small "… proven ∎" section closers stay.
- The hero terminal must be a COMPLETE, accurate flow: OCI helm install (from
  README.md — never `./helm-charts`, never `--skip-schema-validation`), a
  console step (deploy model, create routing, mint key), BOTH Anthropic env
  vars, then the claude call.
- Never claim "nothing proprietary"/"open source" for the platform — it's
  source-available under Elastic License 2.0 (Python client is Apache-2.0).
  Use "no lock-in" / "standard building blocks" instead.
- Demo sessions showcase skills + files: `triage-inbox` skill (SKILL.md +
  references/) and a diagnostics log attachment whose root cause the agent
  finds (stuck `lidar-cal` wake-lock after fw 3.2.1 → overnight drain).
- Docs include real install options from helm-charts/README.md: OCI install,
  `llmkube.enabled=false` (agents-only), external Postgres
  (`postgres.enabled=false` + `externalDatabase.*`), external S3
  (`minio.enabled=false` + `s3.*`, podIdentity/IRSA), exposure values,
  `helm upgrade --force-conflicts`.

## Round-3 additions (user feedback 2026-07-21)

- **Animated captures** (assembled from live console frames with Pillow):
  `assets/img/console-session-live.webp` (hero "not a chatbot" figure — a real
  session recorded frame-by-frame, ending with the final row clicked open to
  its rendered result; `.gif` sibling is in the main repo README, committed
  and pushed as f26946d) and `assets/img/console-routing-trace.webp`
  (the live gateway trace filling + an entry expanded).
- Concepts page went deep: pools/deployments elasticity, ALL seven routing
  condition types with a JSON example + use case each, a new
  **Tracing & observability** section (live trace animation, routing
  overview stats, session transcripts), and an expanded **Usage & cost
  tracking** section (real vs billed, usage-time pricing, both /usage pages).
  Screenshots added throughout (deployments, rules, sessions, files-concept,
  environments, skills, wiki, trace, routing overview, usage ×2).
- **Legal pages**: `imprint.html` + `privacy.html` — BOTH in English (user
  decisions 2026-07-21; renamed from impressum.html/datenschutz.html), framed
  as a 100% PRIVATE, non-commercial offering. Address = Karlstr. 23, 82140
  Olching. Host is GitHub Pages (privacy §3 names GitHub Inc. + EU-U.S. DPF).
  No email anywhere on the site — contact runs through `contact.html`.
- **Contact page** (`contact.html`): Web3Forms form (name/email/message +
  required consent checkbox + honeypot), submitted via `fetch` so the
  third-party request happens ONLY on send and the confirmation stays on-site.
  The real access key is wired in and **verified end to end** (one labelled
  test submission returned `success` and delivered). Web3Forms keys are public
  by design — they only route mail, so keeping it in the HTML is fine. The
  form sets no cookies (privacy §3 documents the processor).
- **Google Analytics is planned** (user, 2026-07-21) and the privacy policy is
  ALREADY WRITTEN FOR IT — privacy §4 describes GA4 as consent-gated, so the
  text stays correct both before and after GA goes live ("only with your
  consent" is true while no consent has been given). Do NOT re-introduce
  absolute "no cookies / no analytics" claims.
- **Consent banner is implemented + LIVE** (`assets/consent.js`, styles in
  site.css, script tag on every page). GA4 id `G-7GZLLM3R5X` is configured
  there — do NOT paste Google's raw gtag snippet into any page, it would load
  GA before consent and contradict privacy §4. Setting `GA_ID` back to
  `G-XXXXXXXXXX` disables everything (no banner, no storage, no cookies). With
  an id set:
  Reject/Accept at equal weight, gtag.js loads ONLY after Accept, only
  "granted"/"denied" goes to localStorage, and a "Cookie settings" footer link
  is injected for withdrawal. Verified live in both states incl. the docs/
  sub-path — BASE comes from the RAW script src, because `element.src` is
  pre-resolved and silently breaks the banner's privacy link there.
- The privacy policy is deliberately MINIMAL (user: "keep it at a minimum for
  private people") — six short sections: controller, hosting, contact form,
  cookies+analytics (merged), rights, version. Overview and External-links
  sections were dropped as not legally required. Each remaining section keeps
  only the Art. 13 essentials: recipient, data categories, purpose, legal
  basis, third-country safeguard. Don't let it grow back. Address/hosting placeholders in [brackets] MUST be filled
  before publishing. Fonts are SELF-HOSTED since 2026-07-21 (IBM Plex woff2 in
  `assets/fonts/` + `assets/fonts.css`, OFL-licensed; zero third-party requests
  at runtime — verified via performance entries), so the Datenschutz has no
  Google-Fonts section and needs no cookie banner. If the project ever turns
  commercial, the imprint must grow to full § 5 DDG details.
- Demo leftovers for future captures: routing `main` (rules demo), API key
  `meridian-ops` (apikey_6snkgipkrqnt) used for trace traffic.

## Signature

The **proof motif**: animated proofmark in the hero (check draws, Q.E.D.
tombstone pops) beside a terminal that "proves" the claim — `helm install`,
model Ready, agent session finished, `∎ Q.E.D.` Major sections close with a
small `∎`. One orchestrated moment; everything else stays quiet.
