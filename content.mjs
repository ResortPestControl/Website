// Page content. Each page: path, title (the <title> before " | Resort Pest Control"),
// description (Google's snippet, aim for 140-160 characters), and body HTML.
import { SITE } from "./site.mjs";
import { barrierMap, rodentMap, termiteMap, serviceAreaMap } from "./maps.mjs";
import { ant, roach, rodent, termite, building, spider, silverfish } from "./pestArt.mjs";
import { icon, tiles } from "./icons.mjs";

/** A landscape card: drawing on the left, title, text and link on the right. */
const rowCard = (art, title, text, href, more) =>
  `<div class="card row"><div class="pest-art">${art}</div><div class="row-body"><h3>${title}</h3><p>${text}</p><a class="more" href="${href}">${more}</a></div></div>`;

const ART = {
  pest: () => `<span class="art-pair">${ant("Ant", { head: "#a8432a", thorax: "#a8432a", gaster: "#4a2418" })}${roach("Cockroach", { body: "#8a3f1a", shield: "#9a4a20", band: "#e8c98a" })}</span>`,
  rodent: () => rodent("Roof rat", { fur: "#3a332e", ear: 7, tail: 1.25, body: 0.9 }),
  termite: () => termite("Termite"),
  condo: () => building("Condo building"),
};


// Google reviews: only real reviews from the Google Business Profile (SITE.reviews).
// The strip stays hidden until there are some.
const reviewsStrip = () =>
  SITE.reviews.length
    ? `<section class="block reviews"><div class="wrap">
<div class="section-head"><h2>What customers say</h2>${SITE.googleReviewsUrl ? `<p><a href="${SITE.googleReviewsUrl}">See all our Google reviews</a></p>` : ""}</div>
<div class="review-row">${SITE.reviews
        .map((r) => `<figure class="review"><div class="stars" aria-label="${r.stars} out of 5 stars">${"★".repeat(r.stars)}</div><blockquote>${r.text}</blockquote><figcaption>${r.name}</figcaption></figure>`)
        .join("")}</div>
</div></section>`
    : reviewBand();

/** Until there are reviews to show: ask customers for one. */
const reviewBand = () => `<section class="review-ask"><div class="wrap">
<span class="stars" aria-hidden="true">★★★★★</span>
<p><b>Happy with our service?</b> A quick Google review helps other Southwest Florida families and communities find us.</p>
<a class="btn small green" href="${SITE.reviewUrl}" rel="noopener">Leave us a review</a>
</div></section>`;

const tel = `<a href="tel:${SITE.phoneE164}">${SITE.phone}</a>`;

const ctaBand = (heading = "Ready for a pest-free property?", text = "Call our office or send a request and we'll get back to you the same business day.") => `
<section class="cta-band"><div class="wrap">
<div><h2>${heading}</h2><p>${text}</p></div>
<div class="actions" style="margin:0"><a class="btn" href="tel:${SITE.phoneE164}">Call ${SITE.phone}</a><a class="btn ghost" style="color:#fff!important;border-color:#fff" href="/contact/">Request service</a></div>
</div></section>`;

const asideBox = `<aside class="aside"><div class="portal-box">
<h3>Talk to our team</h3>
<p>Family-owned in Southwest Florida for over 30 years. Licensed, state-certified technicians.</p>
<p><a class="btn" href="tel:${SITE.phoneE164}" style="display:block;text-align:center">Call ${SITE.phone}</a></p>
<p style="margin:0"><a class="btn ghost" href="/contact/" style="display:block;text-align:center">Request service online</a></p>
</div>
<div class="card" style="margin-top:16px"><h3>Already a customer?</h3><p>See your schedule, service reports, property map and invoices any time.</p><a class="more" href="${SITE.portal}">Customer Login</a></div>
</aside>`;

const faq = (items) => ({
  html: items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join(""),
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })),
  },
});

/* --------------------------------- pages --------------------------------- */
const homeFaq = faq([
  ["What areas do you serve?", `We're based in Naples and serve all of Southwest Florida: Lee and Collier counties, from Marco Island and Naples to Bonita Springs, Estero, Fort Myers and Cape Coral. See our <a href="/service-areas/">service areas</a>.`],
  ["Do you work with condo associations and HOAs?", `Yes. Much of our work is ongoing programs for condominium associations, HOAs, clubs and multi-unit communities, set up with the property manager and board. <a href="/condo-hoa-pest-control/">Learn about community programs</a>.`],
  ["What if pests come back after a treatment?", "If live pests show up inside after a residential treatment, we come back and retreat at no extra charge."],
  ["Can I see what was done at my property?", `Yes. Every customer gets a portal with their schedule and service reports. Properties with a barrier, rodent or termite program also get maps showing where the barrier was applied and every rodent and termite station with its activity. <a href="/mapping/">See how mapping works</a>.`],
]);

const home = {
  path: "/",
  title: "Southwest Florida Pest Control, Naples to Fort Myers | Resort Pest Control",
  description:
    "Family-owned pest control in Southwest Florida for 30+ years, serving Lee and Collier counties. Condos, HOAs, businesses and homes. Rodent stations mapped and reported every visit.",
  schema: [homeFaq.schema],
  body: `
<section class="hero"><div class="wrap grid">
<div>
<div class="eyebrow">Southwest Florida · Lee &amp; Collier counties</div>
<h1>Pest control for Southwest Florida communities, businesses and homes</h1>
<p class="lede">Family-owned for 30+ years. Condos, HOAs, businesses and homes across Lee and Collier counties.</p>
<div class="actions"><a class="btn" href="tel:${SITE.phoneE164}">Call ${SITE.phone}</a><a class="btn ghost" href="/contact/">Request a free quote</a></div>
</div>
<div class="hero-card">
<h2 style="font-size:1.3rem">Why properties choose us</h2>
${tiles([["family", "Family-owned, 30+ years"], ["badge", "Licensed &amp; state-certified"], ["pin", "Every station mapped"], ["report", "Reports &amp; maps online"], ["shield", "Free retreats"]], "compact")}
</div>
</div></section>
${reviewsStrip()}
<section class="block"><div class="wrap">
<div class="section-head"><h2>Pest control services</h2></div>
<div class="rows">
${rowCard(ART.pest(), "General pest control", "Interior and exterior service with a perimeter barrier for ants, roaches, spiders and more.", "/services/pest-control/", "Pest control")}
${rowCard(ART.rodent(), "Rodent control", "Tamper-resistant bait stations, monitoring and exclusion for roof rats and mice.", "/services/rodent-control/", "Rodent control")}
${rowCard(ART.termite(), "Termite control", "Inspections and treatment for subterranean and drywood termites.", "/services/termite-control/", "Termite control")}
${rowCard(ART.condo(), "Condos, HOAs &amp; commercial", "Ongoing programs set up with property managers and boards.", "/condo-hoa-pest-control/", "Community programs")}
</div>
</div></section>

<section class="block alt"><div class="wrap split">
<div>
<div class="eyebrow">Mapping &amp; reporting</div>
<h2>See every treatment and station on a map of your property</h2>
<p>After every visit, your report shows what was done and where, on a map. Tap a station to see its reading.</p>
${tiles([["spray", "Barrier map"], ["station", "Rodent stations"], ["pin", "Termite stations"], ["report", "In your portal"]], "two")}
<div class="actions"><a class="btn green" href="/mapping/">How mapping works</a><a class="btn ghost" href="${SITE.portalDemo}">Try the live demo</a></div>
</div>
<div>${rodentMap(true)}</div>
</div></section>

<section class="block"><div class="wrap">
<div class="section-head"><h2>How we work</h2><p>Find the source, keep pests out, treat only where it matters.</p></div>
${tiles([["search", "1. Inspect", "Find the pest and its source"], ["seal", "2. Prevent", "Seal the gaps they use"], ["spray", "3. Treat", "Targeted inside and out"], ["chart", "4. Monitor", "Check, record, report"]], "four")}
</div></section>

<section class="block alt"><div class="wrap">
<div class="section-head"><h2>Frequently asked questions</h2></div>
<div class="prose">${homeFaq.html}</div>
</div></section>
${ctaBand()}`,
};

const services = {
  path: "/services/",
  title: "Pest Control Services in Southwest Florida",
  h1: "Pest control services",
  crumbs: [],
  lede: "Residential and commercial pest control across Southwest Florida, Lee and Collier counties, built on integrated pest management.",
  description:
    "Pest, rodent and termite control for communities, businesses and homes across Southwest Florida from a family-owned company with 30+ years in Lee and Collier counties.",
  body: `
<section class="block"><div class="wrap">
<div class="rows">
${rowCard(ART.pest(), "General pest control", "Interior and exterior service with a perimeter barrier treatment around your home or building. Covers ants, cockroaches, spiders, silverfish and other common Florida pests.", "/services/pest-control/", "Learn more")}
${rowCard(ART.rodent(), "Rodent control", "Tamper-resistant exterior bait stations, interior trapping where needed, monitoring every visit and exclusion work that seals entry points.", "/services/rodent-control/", "Learn more")}
${rowCard(ART.termite(), "Termite control", "Inspections and treatment options for subterranean and drywood termites, the two kinds that damage Southwest Florida buildings.", "/services/termite-control/", "Learn more")}
${rowCard(ART.condo(), "Condos, HOAs &amp; commercial", "Ongoing programs for associations, clubs, offices and restaurants, with reports for managers and boards.", "/condo-hoa-pest-control/", "Learn more")}
</div>
</div></section>
${ctaBand()}`,
};

function servicePage({ slug, title, h1, lede, description, intro, bullets, sections, faqItems }) {
  const f = faqItems ? faq(faqItems) : null;
  return {
    path: `/services/${slug}/`,
    title,
    h1,
    lede,
    description,
    crumbs: [["/services/", "Services"]],
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: h1,
        serviceType: h1,
        provider: { "@id": `${SITE.url}/#business` },
        areaServed: SITE.counties.map((c) => ({ "@type": "AdministrativeArea", name: `${c}, FL` })),
      },
      ...(f ? [f.schema] : []),
    ],
    body: `
<div class="wrap layout"><div class="prose">
<p class="lede-sm">${intro}</p>
<h2>What's included</h2>
${tiles(bullets)}
${sections}
${f ? `<h2>Common questions</h2>${f.html}` : ""}
</div>${asideBox}</div>
${ctaBand()}`,
  };
}

const pestControl = servicePage({
  slug: "pest-control",
  title: "Home & Condo Pest Control in Southwest Florida",
  h1: "General pest control",
  lede: "Year-round protection from ants, cockroaches, spiders and other Southwest Florida pests.",
  description:
    "Interior and exterior pest control with a perimeter barrier for Southwest Florida homes and condos. Free retreats if pests come back inside. Call (239) 352-4100.",
  intro:
    "Pests are active all year here. We treat inside and out and put a barrier around the whole building.",
  bullets: [
    ["search", "Inspection", "Which pests, and how they get in"],
    ["family", "Interior treatment", "Kitchens, baths, garages"],
    ["spray", "Perimeter barrier", "Around the entire building"],
    ["palm", "Eaves &amp; landscaping", "Where pests nest"],
    ["seal", "Prevention tips", "Keep them from coming back"],
    ["shield", "Free retreats", "If pests come back inside"],
  ],
  sections: `<h2>Pests we treat</h2>
<div class="pest-chips">
<a class="pest-chip" href="/pests/ants/">${ant("Ants", { head: "#a8432a", thorax: "#a8432a", gaster: "#4a2418" })}Ants</a>
<a class="pest-chip" href="/pests/cockroaches/">${roach("Cockroaches", { body: "#8a3f1a", shield: "#9a4a20", band: "#e8c98a" })}Cockroaches</a>
<a class="pest-chip" href="/pests/">${spider("Spiders")}Spiders</a>
<a class="pest-chip" href="/pests/">${silverfish("Silverfish")}Silverfish</a>
</div>
<p>Plus earwigs, millipedes, centipedes, pantry pests and more. <a href="/pests/">Pest guide</a></p>
<h2>Every barrier treatment, on the map</h2>
<p>Each report shows which buildings got the barrier. <a href="/mapping/#barrier-map">How our maps work</a></p>
${barrierMap(true)}`,
  faqItems: [
    ["How often should my home be serviced?", "Most Southwest Florida homes do best with regular quarterly service. We'll recommend a schedule after your first inspection."],
    ["Are your treatments safe for kids and pets?", "We use integrated pest management and environmentally responsible products, applied only where needed. Your technician will tell you if anything should be kept away from treated areas and for how long."],
  ],
});

const rodentControl = servicePage({
  slug: "rodent-control",
  title: "Rodent & Rat Control in Southwest Florida",
  h1: "Rodent control",
  lede: "Bait stations, monitoring and exclusion for roof rats and mice, with every station mapped and reported.",
  description:
    "Rat and mouse control in Southwest Florida: tamper-resistant bait stations, exclusion and visit-by-visit station reports on a map of your property.",
  intro:
    "Roof rats live in palms and landscaping and slip in through small gaps. We control them outside, keep them out, and track every station.",
  bullets: [
    ["search", "Inspection", "Droppings, gnawing, entry points"],
    ["station", "Locked bait stations", "Tamper-resistant, around buildings"],
    ["pin", "Every station mapped", "Numbered and pinned"],
    ["chart", "Checked every visit", "Activity recorded"],
    ["seal", "Exclusion", "Gaps and openings sealed"],
    ["report", "Reports with maps", "In your customer portal"],
  ],
  sections: `<h2>See your stations on a map</h2>
<p>Every station on an aerial map, colored by activity. Tap one to see its reading. <a href="/mapping/">How our maps work</a></p>
${rodentMap(true)}`,
  faqItems: [
    ["What are the signs of rats in my home?", "Droppings, gnaw marks on wiring or food packaging, greasy rub marks along walls, chewed fruit outdoors and scratching or running noises in the attic at night."],
    ["Are bait stations safe around pets and children?", "We use locked, tamper-resistant stations designed so bait can be reached by rodents but not by children, pets or wildlife."],
  ],
});

const termiteControl = servicePage({
  slug: "termite-control",
  title: "Termite Inspection & Treatment in Southwest Florida",
  h1: "Termite control",
  lede: "Inspections and treatment for the subterranean and drywood termites that damage Southwest Florida buildings.",
  description:
    "Termite inspections and treatment in Lee and Collier counties for subterranean and drywood termites. Licensed, family-owned for 30+ years.",
  intro:
    "Florida has some of the highest termite pressure in the country. We find which kind you have and treat it.",
  bullets: [
    ["search", "Full inspection", "Inside and out"],
    ["termite", "Identify the type", "Subterranean or drywood"],
    ["spray", "Matched treatment", "For the type and extent"],
    ["calendar", "Follow-up", "Confirm it worked"],
  ],
  sections: `<h2>Signs of termites</h2>
${tiles([["wing", "Swarms &amp; wings", "Near windows, often spring"], ["tube", "Mud tubes", "On foundations or walls"], ["droppings", "Pellet droppings", "Below wood"], ["hollow", "Hollow wood", "Sounds hollow or blisters"]])}
<p>Seeing any of these? <a href="/contact/">Request a termite inspection</a></p>
<h2>Termite stations on your map</h2>
<p>Live activity flagged in red. <a href="/mapping/#termite-map">How our maps work</a></p>
${termiteMap(true)}`,
});

const condo = {
  path: "/condo-hoa-pest-control/",
  title: "Condo & HOA Pest Control in Southwest Florida",
  h1: "Pest control for condos, HOAs and commercial properties",
  eyebrow: "Communities & property managers",
  lede: "Ongoing pest and rodent programs for associations, clubs and businesses, with clear reports for managers and boards.",
  crumbs: [],
  description:
    "Pest and rodent programs for Southwest Florida condo associations, HOAs, clubs and businesses. Mapped bait stations, visit reports and an online portal for managers.",
  body: `
<section class="block"><div class="wrap split">
<div>
<h2>Built for associations</h2>
<p>An ongoing program set up with your manager and board.</p>
${tiles([["calendar", "Scheduled service", "Buildings and common areas"], ["station", "Mapped stations", "Checked every visit"], ["spray", "Perimeter barrier", "Around each building"], ["clock", "Quick unit calls", "When a resident needs us"], ["report", "Board-ready reports", "After every visit"], ["building", "One portal", "For all your properties"]])}
</div>
<div>${rodentMap(true)}</div>
</div></section>

<section class="block alt"><div class="wrap">
<div class="section-head"><h2>Your property, mapped</h2><p>Every building, barrier treatment and station on one map, updated every visit. Tap a station or building to see its latest reading.</p></div>
<div class="map-trio">${barrierMap(true)}${termiteMap(true)}</div>
<div class="actions"><a class="btn green" href="${SITE.portalDemo}">Try the demo property</a><a class="btn ghost" href="/mapping/">How mapping works</a></div>
</div></section>

<section class="block"><div class="wrap">
<div class="section-head"><h2>The owner portal for managers and boards</h2><p>Every property gets its own portal: everything in one place.</p></div>
${tiles([["calendar", "Schedule"], ["report", "Service reports"], ["pin", "Property map"], ["dollar", "Invoices &amp; payments"], ["chat", "Service requests"], ["people", "Contacts"]])}
<div class="actions"><a class="btn green" href="${SITE.portal}">Customer Login</a><a class="btn ghost" href="${SITE.portalDemo}">Try the demo property</a></div>
</div></section>

<section class="block"><div class="wrap">
<div class="section-head"><h2>Commercial properties</h2><p>We also serve offices, restaurants, clubs and other businesses across Lee and Collier counties with scheduled service that fits around your hours.</p></div>
</div></section>
${ctaBand("Manage a community or business?", "We'll walk your property, map your buildings and propose a program for your board.")}`,
};

const mapping = {
  path: "/mapping/",
  title: "Barrier, Rodent & Termite Station Maps",
  h1: "Mapping and reporting",
  eyebrow: "Our technology",
  lede: "We map every building on your property and record barrier treatments, rodent stations and termite stations at every visit, so you can see exactly what was done.",
  crumbs: [],
  description:
    "See barrier treatments, rodent bait stations and termite stations on an aerial map of your property, updated every visit in your online portal.",
  body: `
<section class="block"><div class="wrap">
<div class="section-head">
<h2>Your property, mapped</h2>
<p>Most pest companies hand you a paper ticket. We built our own system, FieldBook, so you can see exactly what was done. Each property gets an aerial map with its buildings drawn in, and every treatment and station is recorded on it at every visit. Depending on your program, your reports include up to three maps.</p>
<div class="actions"><a class="btn green" href="${SITE.portalDemo}">Open the live demo</a><a class="btn ghost" href="${SITE.portal}">Customer Login</a></div>
</div>
<nav class="map-tabs" aria-label="Maps on this page"><a href="#barrier-map">Barrier treatment</a><a href="#rodent-map">Rodent stations</a><a href="#termite-map">Termite stations</a></nav>
<div class="mapgrid">
${barrierMap()}
${rodentMap()}
${termiteMap()}
</div>
<p class="note">Maps shown are illustrations on a sample property. Your maps are drawn from your own property's aerial photo, buildings and stations.</p>
</div></section>

<section class="block alt"><div class="wrap">
<div class="section-head"><h2>How it works</h2></div>
<ol class="steps">
<li><b>We map your property</b>Buildings are drawn on an aerial photo of your property, and every rodent and termite station is pinned and numbered.</li>
<li><b>Technicians record every station</b>On each visit the technician works through the map on a tablet and records the barrier treatment, the activity at each rodent and termite station, and notes.</li>
<li><b>You get a report</b>After the visit, a report with your maps is published to your portal.</li>
<li><b>Trends over time</b>Because every station is tracked visit after visit, you can see where activity is concentrated and confirm the program is working.</li>
</ol>
</div></section>

<section class="block"><div class="wrap split">
<div class="portal-box">
<h2>Why it matters for boards and managers</h2>
<ul class="checks">
<li>Proof of service for every building, not just a signature</li>
<li>Problem areas are obvious, so fixes can be targeted</li>
<li>Reports ready to share at board meetings</li>
<li>Station counts and history stay with the property, even when staff changes</li>
</ul>
</div>
<div>
<h2>See it for yourself</h2>
<p>Our demo property, "Naples Shores," shows exactly what customers see: the schedule, reports, the station map, invoices and service requests.</p>
<p><a class="btn" href="${SITE.portalDemo}">Explore the demo portal</a></p>
</div>
</div></section>
${ctaBand("Want your property mapped?", "Call us or send a request and we'll set up a walk-through.")}`,
};

/* ------------------------------ pest guide ------------------------------ */
// Drawing for each species, keyed by card name.
const SPECIES_ART = {
  "Ghost ant": () => ant("Ghost ant", { head: "#3a2a20", thorax: "#efe6d6", gaster: "#efe6d6", legs: "#b9ab95", size: 0.75 }),
  "White-footed ant": () => ant("White-footed ant", { head: "#1f1a17", thorax: "#1f1a17", gaster: "#1f1a17", legs: "#d8c46a", size: 0.85 }),
  "Red imported fire ant": () => ant("Red imported fire ant", { head: "#a8432a", thorax: "#a8432a", gaster: "#4a2418" }),
  "Florida carpenter ant": () => ant("Florida carpenter ant", { head: "#c8542a", thorax: "#c8542a", gaster: "#1f1a17", size: 1.15 }),
  "Big-headed ant": () => ant("Big-headed ant", { head: "#7a4a26", thorax: "#7a4a26", gaster: "#7a4a26", headR: 13, size: 0.9 }),
  "Tawny crazy ant": () => ant("Tawny crazy ant", { head: "#9a5a2e", thorax: "#9a5a2e", gaster: "#9a5a2e", size: 0.85 }),
  'American cockroach ("palmetto bug")': () => roach("American cockroach", { body: "#8a3f1a", shield: "#9a4a20", band: "#e8c98a", size: 1.1 }),
  "German cockroach": () => roach("German cockroach", { body: "#b8833f", shield: "#c4924e", stripes: "#3a2a20", size: 0.75 }),
  "Smokybrown cockroach": () => roach("Smokybrown cockroach", { body: "#4a2516", shield: "#4a2516" }),
  "Florida woods roach": () => roach("Florida woods roach", { body: "#2e1d16", shield: "#3a2418", shortWings: true }),
  "Australian cockroach": () => roach("Australian cockroach", { body: "#8a3f1a", shield: "#9a4a20", band: "#e8c98a", edge: "#e8c24a" }),
  "Asian cockroach": () => roach("Asian cockroach", { body: "#b8833f", shield: "#c4924e", stripes: "#3a2a20", size: 0.75 }),
  "Roof rat": () => rodent("Roof rat", { fur: "#3a332e", ear: 7, tail: 1.25, body: 0.9 }),
  "Norway rat": () => rodent("Norway rat", { fur: "#7a6a5e", ear: 4.5, tail: 0.75, body: 1.1, snout: 0.85 }),
  "House mouse": () => rodent("House mouse", { fur: "#9a8b7c", ear: 7.5, tail: 0.9, body: 0.65, snout: 0.7 }),
};

function speciesCards(list) {
  return `<div class="rows species">${list
    .map(
      ([name, size, looks, where]) =>
        `<div class="card row"><div class="pest-art">${SPECIES_ART[name] ? SPECIES_ART[name]() : ""}</div><div class="row-body"><h3>${name}</h3><dl class="facts"><div><dt>Size</dt><dd>${size}</dd></div><div><dt>What it looks like</dt><dd>${looks}</dd></div><div><dt>Where it's found</dt><dd>${where}</dd></div></dl></div></div>`,
    )
    .join("")}</div>`;
}

const pestsIndex = {
  path: "/pests/",
  title: "Florida Pest Identification Guide",
  h1: "Pest identification guide",
  lede: "Common pests in Southwest Florida, how to recognize them and what to do next.",
  crumbs: [],
  description:
    "Identify common Southwest Florida pests: ants, cockroaches, rodents, termites and more. A guide from Resort Pest Control.",
  body: `
<section class="block"><div class="wrap">
<div class="rows">
${rowCard(ant("Ant", { head: "#a8432a", thorax: "#a8432a", gaster: "#4a2418" }), "Ants", "Ghost ants, white-footed ants, fire ants, carpenter ants and more.", "/pests/ants/", "Ant guide")}
${rowCard(roach("Cockroach", { body: "#8a3f1a", shield: "#9a4a20", band: "#e8c98a" }), "Cockroaches", 'American "palmetto bugs," German roaches, smokybrown and others.', "/pests/cockroaches/", "Cockroach guide")}
${rowCard(ART.rodent(), "Rodents", "Roof rats, Norway rats and house mice.", "/pests/rodents/", "Rodent guide")}
${rowCard(ART.termite(), "Termites", "Subterranean and drywood termites.", "/services/termite-control/", "Termites")}
</div>
</div></section>
${ctaBand("Not sure what you're seeing?", "Send us a photo or give us a call. We'll identify it and tell you what to do.")}`,
};

const ants = {
  path: "/pests/ants/",
  title: "Common Ants in Southwest Florida",
  h1: "Ants",
  crumbs: [["/pests/", "Pest Guide"]],
  lede: "Florida is home to dozens of ant species. These are the ones we see most often in Southwest Florida homes and buildings.",
  description:
    "Identify common Southwest Florida ants: ghost ants, white-footed ants, fire ants, carpenter ants and more, and learn how to get rid of them.",
  body: `<div class="wrap">
${speciesCards([
  ["Ghost ant", "About 1/16 inch", "Tiny, with a dark head and pale, almost see-through legs and body.", "Indoors in kitchens and bathrooms, wall voids and potted plants. Loves sweets."],
  ["White-footed ant", "About 1/8 inch", "Black to dark brown with pale yellowish feet.", "Huge colonies outdoors in trees and landscaping that trail inside along walls and window frames."],
  ["Red imported fire ant", "1/16 to 1/4 inch (varied sizes)", "Reddish-brown to dark, aggressive when disturbed.", "Mounds in lawns and landscape beds. Painful stings that form pustules."],
  ["Florida carpenter ant", "1/4 to 1/2 inch", "Large, with an orange-red front and black rear.", "Nests in moist or damaged wood, palms and wall voids. Most active at night."],
  ["Big-headed ant", "About 1/8 inch", "Brown; larger workers have oversized heads.", "Nests in soil and under pavers, leaving small piles of dirt along slabs and walks."],
  ["Tawny crazy ant", "About 1/8 inch", "Reddish-brown, moves erratically in huge numbers.", "Outdoors under debris and landscaping; can overwhelm yards and get into electrical boxes."],
])}
</div>
<div class="wrap layout"><div class="prose" style="max-width:none">
<h2>Getting rid of ants</h2>
<p>Store-bought sprays usually just scatter ants and can split colonies. We identify the species, follow the trails to the colony and use baits and treatments that work for that ant. A perimeter barrier then helps keep them from coming back. <a href="/services/pest-control/">See our pest control service</a>.</p>
</div>${asideBox}</div>
${ctaBand()}`,
};

const roaches = {
  path: "/pests/cockroaches/",
  title: "Cockroaches & Palmetto Bugs in Southwest Florida",
  h1: "Cockroaches",
  crumbs: [["/pests/", "Pest Guide"]],
  lede: "From outdoor \"palmetto bugs\" to German roaches that breed indoors, here's how to tell them apart.",
  description:
    "Identify cockroaches in Southwest Florida: American (palmetto bugs), German, smokybrown, Florida woods and Australian roaches, and how to stop them.",
  body: `<div class="wrap">
${speciesCards([
  ["American cockroach (\"palmetto bug\")", "1 1/2 to 2 inches", "Large, reddish-brown, with a pale band behind the head.", "Sewers, drains, mulch and garages. Wanders indoors, especially after rain."],
  ["German cockroach", "1/2 to 5/8 inch", "Light brown with two dark stripes behind the head.", "Kitchens and bathrooms. Breeds indoors fast and spreads between units in multi-family buildings."],
  ["Smokybrown cockroach", "1 to 1 1/2 inches", "Shiny, uniformly dark mahogany brown.", "Tree holes, mulch, gutters and attics. Attracted to lights at night."],
  ["Florida woods roach", "1 1/4 to 1 5/8 inches", "Dark reddish-brown to black, short wings; gives off a strong odor when disturbed.", "Leaf litter, mulch and woodpiles; comes indoors occasionally."],
  ["Australian cockroach", "1 1/4 to 1 1/2 inches", "Like an American roach but with pale yellow stripes along the wing edges.", "Outdoors in plants and mulch; moves into garages and lanais."],
  ["Asian cockroach", "About 1/2 inch", "Looks like a German roach but flies readily.", "Lawns and leaf litter; flies toward lights in the evening."],
])}
</div>
<div class="wrap layout"><div class="prose" style="max-width:none">
<h2>Stopping cockroaches</h2>
<p>Outdoor roaches like palmetto bugs are kept out with a perimeter barrier and sealing entry points. German roaches need a different, indoor-focused plan with baits, especially in condos and restaurants. <a href="/services/pest-control/">See our pest control service</a>.</p>
</div>${asideBox}</div>
${ctaBand()}`,
};

const rodents = {
  path: "/pests/rodents/",
  title: "Roof Rats, Norway Rats & Mice in Southwest Florida",
  h1: "Rodents",
  crumbs: [["/pests/", "Pest Guide"]],
  lede: "Roof rats are the most common rodent problem in Southwest Florida. Here's how to recognize the rodents you may see.",
  description:
    "Identify roof rats, Norway rats and house mice in Southwest Florida, the signs of an infestation and how professional rodent control works.",
  body: `<div class="wrap">
${speciesCards([
  ["Roof rat", "13 to 18 inches including tail", "Slender, dark brown to black, with a tail longer than its body and large ears.", "Palm trees, dense vegetation, attics and roof lines. Excellent climbers."],
  ["Norway rat", "Up to 16 inches including tail", "Heavy-bodied, brownish-gray, with a tail shorter than its body and small ears.", "Burrows in soil along foundations, seawalls and dumpsters."],
  ["House mouse", "5 to 7 inches including tail", "Small, gray-brown, with large ears.", "Inside walls, cabinets and storage areas; can fit through a gap the width of a pencil."],
])}
</div>
<div class="wrap layout"><div class="prose" style="max-width:none">
<h2>Signs of rodents</h2>
<ul><li>Droppings along walls, in cabinets or in the attic</li><li>Gnawed wires, wood or packaging</li><li>Greasy rub marks along beams and walls</li><li>Scratching or scurrying noises at night</li><li>Half-eaten fruit under palms and fruit trees</li></ul>
<h2>How we control rodents</h2>
<p>We place locked bait stations around your buildings, seal the openings rodents use, and check every station at every visit. For communities and businesses, each station is pinned on a map of your property so you can see where the activity is. <a href="/services/rodent-control/">See our rodent control service</a>.</p>
</div>${asideBox}</div>
${ctaBand()}`,
};


/* ------------------------------ town pages ------------------------------ */
const TOWNS = [
  ["naples", "Naples", "Collier County", "Our office is on Horseshoe Drive in Naples, so most of the city is a short drive away. We look after condos, HOAs, clubs, businesses and homes from Old Naples to North Naples and Golden Gate."],
  ["marco-island", "Marco Island", "Collier County", "Island condos and waterfront homes see heavy pressure from roof rats in the palms and from ants and palmetto bugs after summer rains."],
  ["bonita-springs", "Bonita Springs", "Lee County", "Gated communities, golf clubs and homes between Naples and Estero, with ongoing programs for associations and their managers."],
  ["estero", "Estero", "Lee County", "Country club and HOA communities where boards want every rodent and termite station mapped and reported."],
  ["fort-myers", "Fort Myers", "Lee County", "Homes, condos and businesses across Fort Myers, from the river district to the newer communities east of I-75."],
  ["cape-coral", "Cape Coral", "Lee County", "Canal-front homes and condos, where landscaping and seawalls give roof rats, ants and termites plenty of cover."],
];

const townPages = TOWNS.map(([slug, town, county, local]) => ({
  path: `/service-areas/${slug}/`,
  title: `Pest Control in ${town}, FL`,
  h1: `Pest control in ${town}`,
  eyebrow: `${county} · Southwest Florida`,
  lede: local,
  crumbs: [["/service-areas/", "Service areas"]],
  description: `Pest, rodent and termite control in ${town}, FL (${county}) from a family-owned Southwest Florida company with 30+ years of local service. Call ${SITE.phone}.`,
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Pest control in ${town}, FL`,
      serviceType: "Pest control",
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: { "@type": "City", name: `${town}, FL` },
    },
  ],
  body: `
<section class="block"><div class="wrap">
<div class="section-head"><h2>What we do in ${town}</h2></div>
<div class="rows">
${rowCard(ART.pest(), "General pest control", "Inside and out, with a perimeter barrier.", "/services/pest-control/", "Pest control")}
${rowCard(ART.rodent(), "Rodent control", "Locked bait stations, mapped and checked every visit.", "/services/rodent-control/", "Rodent control")}
${rowCard(ART.termite(), "Termite control", "Inspections and treatment for subterranean and drywood termites.", "/services/termite-control/", "Termite control")}
${rowCard(ART.condo(), "Condos, HOAs &amp; commercial", "Ongoing programs with reports for managers and boards.", "/condo-hoa-pest-control/", "Community programs")}
</div>
${tiles([["family", "Family-owned, 30+ years"], ["badge", "Licensed &amp; state-certified"], ["pin", "Every station mapped"], ["shield", "Free residential retreats"]], "four")}
</div></section>
${ctaBand(`Pest control in ${town}?`, "Call our office or send a request and we'll get back to you the same business day.")}`,
}));

/* ------------------------------ seasonal tips ------------------------------ */
const TIPS = [
  ["Spring", () => termite("Termite swarmer", { wings: true }), "Termite swarm season", "Winged termites indoors or piles of wings by windows mean a colony nearby. Save one in a bag and call us for an inspection."],
  ["Summer", () => ant("Ant", { head: "#a8432a", thorax: "#a8432a", gaster: "#4a2418" }), "Rainy season drives pests in", "Heavy rain floods nests, so ants and palmetto bugs head indoors. Keep mulch a few inches back from the walls and fix leaky outdoor taps."],
  ["Fall", () => rodent("Roof rat", { fur: "#3a332e", ear: 7, tail: 1.25, body: 0.9 }), "Rodents look for shelter", "As nights cool, roof rats move into attics. Trim palm fronds and branches away from the roof and seal gaps around pipes and vents."],
  ["Winter", () => roach("Cockroach", { body: "#8a3f1a", shield: "#9a4a20", band: "#e8c98a" }), "Season residents return", "Units closed up for summer can hide roaches and ants. Book a service before you or your owners arrive so the place is ready."],
];

const tips = {
  path: "/tips/",
  title: "Seasonal Pest Tips for Southwest Florida",
  h1: "Seasonal pest tips",
  lede: "What to watch for in Southwest Florida through the year.",
  crumbs: [],
  description: "Seasonal pest tips for Southwest Florida homes and communities: termite swarms, rainy-season ants and roaches, rodents in the fall and getting units ready for winter.",
  body: `
<section class="block"><div class="wrap">
<div class="rows">
${TIPS.map(([season, art, title, text]) => `<div class="card row"><div class="pest-art">${art()}</div><div class="row-body"><div class="eyebrow">${season}</div><h3>${title}</h3><p>${text}</p></div></div>`).join("\n")}
</div>
</div></section>
${ctaBand("Seeing something now?", "Send us a photo or give us a call. We'll identify it and tell you what to do.")}`,
};

/* ---------------------------- areas / about / contact ---------------------------- */
const areas = {
  path: "/service-areas/",
  title: "Pest Control in Lee & Collier Counties, Southwest Florida",
  h1: "Service areas",
  lede: "From our Naples office we serve communities, businesses and homes across Southwest Florida: all of Lee and Collier counties.",
  crumbs: [],
  description:
    "Resort Pest Control serves Southwest Florida: Naples, Marco Island, Bonita Springs, Estero, Fort Myers, Cape Coral and all of Lee and Collier counties.",
  body: `
<section class="block"><div class="wrap split">
<div>
<h2>Where we work</h2>
<p>All of <b>Lee County</b> and <b>Collier County</b>, including:</p>
<div class="town-links">${SITE.areas
  .map((a) => {
    const t = TOWNS.find(([, town]) => town === a);
    return t ? `<a class="town on" href="/service-areas/${t[0]}/">${icon("pin", 20)}${a}</a>` : `<span class="town">${icon("pin", 20)}${a}</span>`;
  })
  .join("")}</div>
<p>Not sure if you're in our area? Call ${tel} and we'll let you know.</p>
</div>
<div>${serviceAreaMap()}</div>
</div></section>
${ctaBand()}`,
};

const about = {
  path: "/about/",
  title: "About Our Family-Owned Southwest Florida Pest Control Company",
  h1: "About Resort Pest Control",
  lede: "Family-owned and operated, proudly serving the Southwest Florida community for over 30 years.",
  crumbs: [],
  description:
    "Resort Pest Control is a family-owned company with 30+ years serving Southwest Florida condos, HOAs, clubs, businesses and homes.",
  body: `
<div class="wrap layout"><div class="prose">
<p class="lede-sm">Family-owned and local for 30+ years, with long relationships with the condos, HOAs, clubs and businesses we protect.</p>
<h2>What we believe</h2>
${tiles([["seal", "Prevention first", "Find the source, keep pests out"], ["leaf", "Responsible", "Right product, right place"], ["report", "Show our work", "Reports and maps online"], ["shield", "Stand behind it", "Free residential retreats"]])}
<h2>Licensed and certified</h2>
${tiles([["badge", "State-certified technicians", "Southwest Florida pest specialists"], ["pin", "Our own mapping system", "Built in-house. <a href=\"/mapping/\">See it</a>"]])}
</div>${asideBox}</div>
${ctaBand()}`,
};

const contact = {
  path: "/contact/",
  title: "Contact Us | Request Pest Control in Southwest Florida",
  h1: "Contact us",
  lede: "Call our office or send a request and we'll get back to you the same business day.",
  crumbs: [],
  description:
    "Contact Resort Pest Control in Naples, FL. Call (239) 352-4100 or request a free quote online. 2685 Horseshoe Dr S, Suite 215, Naples, FL 34104.",
  body: `
<section class="block"><div class="wrap split" style="align-items:start">
<div>
<div class="contact-grid">
<div class="card"><h3>Call</h3><a class="big-phone" href="tel:${SITE.phoneE164}">${SITE.phone}</a><p style="margin:6px 0 0">Office hours: ${SITE.hoursText}</p></div>
<div class="card"><h3>Visit</h3><p style="margin:0">${SITE.street}<br>${SITE.city}, ${SITE.region} ${SITE.zip}</p></div>
<div class="card"><h3>Customers</h3><p>Schedule, reports, maps and invoices.</p><a class="more" href="${SITE.portal}">Customer Login</a></div>
</div>
<iframe class="map-embed" style="margin-top:18px" title="Map to Resort Pest Control" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(`2685 Horseshoe Dr S, ${SITE.city}, ${SITE.region} ${SITE.zip}`)}&z=15&output=embed"></iframe>
</div>
<form class="portal-box" method="post" action="${SITE.formEndpoint}">
<h2>Request service</h2>
<p class="form-error" id="form-error" hidden>Sorry, that didn't go through. Please check your name and email, or call us at ${tel}.</p>
<script>if (/[?&]error=1/.test(location.search)) document.getElementById("form-error").hidden = false;</script>
<p style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave this empty <input name="company_website" tabindex="-1" autocomplete="off"></label></p>
<fieldset class="ptype"><legend>Property type</legend>
<label><input type="radio" name="property_type" value="Home" checked>${icon("family", 28)}<span>Home</span></label>
<label><input type="radio" name="property_type" value="Condo / HOA">${icon("building", 28)}<span>Condo / HOA</span></label>
<label><input type="radio" name="property_type" value="Business / commercial">${icon("report", 28)}<span>Business</span></label>
</fieldset>
<div class="fields">
<label>First name*<input name="first_name" required autocomplete="given-name"></label>
<label>Last name<input name="last_name" autocomplete="family-name"></label>
<label>Email*<input type="email" name="email" required autocomplete="email"></label>
<label>Phone<input type="tel" name="phone" autocomplete="tel"></label>
<label class="full">Property address<input name="address" autocomplete="street-address"></label>
<label class="full">I'm interested in
<select name="interest"><option>General pest control</option><option>Rodent control</option><option>Termites</option><option>Condo / HOA / commercial program</option><option>Something else</option></select></label>
<label class="full">Message<textarea name="message" rows="4"></textarea></label>
</div>
<button class="btn" type="submit" style="margin-top:12px">Send request</button>
<p style="font-size:.85rem;color:var(--muted);margin:10px 0 0">We'll only use your details to respond to your request. <a href="/privacy/">Privacy</a></p>
</form>
</div></section>`,
};

const thanks = {
  path: "/contact/thanks/",
  title: "Thank You",
  h1: "Thanks, we got your request",
  lede: `We'll be in touch the same business day. Need us sooner? Call ${tel}.`,
  description: "Thanks for contacting Resort Pest Control.",
  noindex: true,
  body: `<section class="block"><div class="wrap"><a class="btn green" href="/">Back to home</a></div></section>
${reviewBand()}`,
};

const privacy = {
  path: "/privacy/",
  title: "Privacy Policy",
  h1: "Privacy policy",
  description: "How Resort Pest Control handles information you send through this website.",
  body: `<div class="wrap layout"><div class="prose">
<p>When you send a request through this website, we receive the details you enter (such as your name, email, phone, address and message). We use them only to respond to you and provide service. We don't sell or share your information with third parties for marketing.</p>
<p>The customer portal is operated by Resort Pest Control and has its own <a href="https://fieldbook.resortpestcontrol.com/privacy">privacy policy</a>.</p>
<p>Questions? Call ${tel}.</p>
</div></div>`,
};

const notFound = {
  path: "/404",
  title: "Page Not Found",
  h1: "We couldn't find that page",
  lede: "It may have moved when we updated our website.",
  description: "Page not found.",
  noindex: true,
  body: `<section class="block"><div class="wrap"><div class="actions"><a class="btn green" href="/">Home</a><a class="btn ghost" href="/services/">Services</a><a class="btn ghost" href="/contact/">Contact</a></div></div></section>`,
};

export const pages = [
  home, services, pestControl, rodentControl, termiteControl,
  condo, mapping, pestsIndex, ants, roaches, rodents, areas, ...townPages, tips, about, contact, thanks, privacy, notFound,
];
