// Page content. Each page: path, title (the <title> before " | Resort Pest Control"),
// description (Google's snippet, aim for 140-160 characters), and body HTML.
import { SITE } from "./site.mjs";
import { barrierMap, rodentMap, termiteMap, serviceAreaMap } from "./maps.mjs";

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
<p class="lede">Resort Pest Control is a family-owned Southwest Florida company that has protected Southwest Florida properties for over 30 years. We specialize in condominiums, HOAs and clubs, and we bring the same care to every home.</p>
<div class="actions"><a class="btn" href="tel:${SITE.phoneE164}">Call ${SITE.phone}</a><a class="btn ghost" href="/contact/">Request a free quote</a></div>
</div>
<div class="hero-card">
<h2 style="font-size:1.3rem">Why Southwest Florida properties choose us</h2>
<ul class="checks">
<li>Family-owned and local for over 30 years</li>
<li>Licensed, state-certified technicians</li>
<li>Every rodent station mapped and checked each visit</li>
<li>Online portal with reports, maps and invoices</li>
<li>Free retreats if pests come back inside</li>
</ul>
</div>
</div></section>

<section class="block"><div class="wrap">
<div class="section-head"><h2>Pest control services</h2><p>Integrated pest management: we find the source, treat it, and seal the gaps pests use to get inside, using environmentally responsible products.</p></div>
<div class="cards">
<div class="card"><h3>General pest control</h3><p>Interior and exterior service with a perimeter barrier for ants, roaches, spiders and more.</p><a class="more" href="/services/pest-control/">Pest control</a></div>
<div class="card"><h3>Rodent control</h3><p>Tamper-resistant bait stations, monitoring and exclusion for roof rats and mice.</p><a class="more" href="/services/rodent-control/">Rodent control</a></div>
<div class="card"><h3>Termite control</h3><p>Inspections and treatment for subterranean and drywood termites.</p><a class="more" href="/services/termite-control/">Termite control</a></div>
<div class="card"><h3>Condos, HOAs & commercial</h3><p>Ongoing programs set up with property managers and boards.</p><a class="more" href="/condo-hoa-pest-control/">Community programs</a></div>
</div>
</div></section>

<section class="block alt"><div class="wrap split">
<div>
<div class="eyebrow">Mapping &amp; reporting</div>
<h2>See every bait station on a map of your property</h2>
<p>We map each building and every rodent station on your property. At every visit our technician records what each station shows, and your report colors the map so you can see at a glance where activity is and whether it's going down.</p>
<ul class="checks"><li>Numbered stations on an aerial map of your property</li><li>Activity levels recorded at every visit</li><li>Reports and the map available in your customer portal</li></ul>
<div class="actions"><a class="btn green" href="/mapping/">How mapping works</a><a class="btn ghost" href="${SITE.portalDemo}">Try the live demo</a></div>
</div>
<div>${rodentMap()}</div>
</div></section>

<section class="block"><div class="wrap split">
<div>
<h2>Our approach: integrated pest management</h2>
<p>Spraying alone doesn't solve pest problems in Southwest Florida's climate. We follow integrated pest management (IPM): find out which pests you have and why, remove what attracts them, keep them out, and treat precisely where it matters.</p>
<div class="stats">
<div class="stat"><b>30+ years</b><span>serving Southwest Florida</span></div>
<div class="stat"><b>Family</b><span>owned and operated in Southwest Florida</span></div>
<div class="stat"><b>Licensed</b><span>state-certified technicians</span></div>
</div>
</div>
<ol class="steps">
<li><b>Inspect &amp; identify</b>We find which pests are present, where they're coming from and what's drawing them in.</li>
<li><b>Prevent</b>We seal entry points and recommend simple changes that make your property less inviting.</li>
<li><b>Treat</b>Targeted interior and exterior treatments, with a perimeter barrier around the building.</li>
<li><b>Monitor</b>Regular visits, station checks and reports, so problems are caught early.</li>
</ol>
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
<div class="cards">
<div class="card"><h3>General pest control</h3><p>Interior and exterior service with a perimeter barrier treatment around your home or building. Covers ants, cockroaches, spiders, silverfish and other common Florida pests.</p><a class="more" href="/services/pest-control/">Learn more</a></div>
<div class="card"><h3>Rodent control</h3><p>Tamper-resistant exterior bait stations, interior trapping where needed, monitoring every visit and exclusion work that seals entry points.</p><a class="more" href="/services/rodent-control/">Learn more</a></div>
<div class="card"><h3>Termite control</h3><p>Inspections and treatment options for subterranean and drywood termites, the two kinds that damage Southwest Florida buildings.</p><a class="more" href="/services/termite-control/">Learn more</a></div>
<div class="card"><h3>Condos, HOAs &amp; commercial</h3><p>Ongoing programs for associations, clubs, offices and restaurants, with reports for managers and boards.</p><a class="more" href="/condo-hoa-pest-control/">Learn more</a></div>
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
<p>${intro}</p>
<h2>What's included</h2>
<ul class="checks">${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
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
    "Southwest Florida's heat and humidity mean pests are active all year. Our general pest control service treats the inside and outside of your home or building and puts a protective barrier around the whole perimeter, so pests are stopped before they get in.",
  bullets: [
    "Inspection to identify the pests present and where they enter",
    "Interior treatment of kitchens, baths, garages and other problem areas",
    "Exterior perimeter barrier around the entire building",
    "Treatment of eaves, entry points and landscaping where pests nest",
    "Recommendations to keep pests from coming back",
    "Free retreat if live pests appear inside between residential services",
  ],
  sections: `<h2>Pests we treat</h2>
<p>Ants (including ghost ants, white-footed ants and fire ants), cockroaches, spiders, silverfish, earwigs, millipedes, centipedes, pantry pests and more. Not sure what you're seeing? Our <a href="/pests/">pest identification guide</a> can help.</p>`,
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
    "Roof rats are the most common rodent problem in Southwest Florida. They live in palm trees and dense landscaping and get into attics, garages and wall voids through surprisingly small gaps. Our rodent program controls the population outside, keeps them out of the building, and tracks activity at every station so you can see results.",
  bullets: [
    "Inspection for droppings, rub marks, gnawing and entry points",
    "Locked, tamper-resistant bait stations around buildings",
    "Every station numbered and pinned on a map of your property",
    "Activity recorded at each station at every visit",
    "Exclusion work to seal gaps and openings rodents use",
    "Reports with the station map in your customer portal",
  ],
  sections: `<h2>See your stations on a map</h2>
<p>For communities and commercial properties, we draw your buildings and every bait station on an aerial map. Each visit's readings color the map by activity level, so managers and boards can see exactly where rodents are active and how the numbers change over time. <a href="/mapping/">Learn how our mapping works</a>.</p>
${rodentMap()}`,
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
    "Florida has some of the highest termite pressure in the country. Subterranean termites travel from the soil through mud tubes, and drywood termites live entirely inside the wood they eat. Both can do serious damage before you notice. We inspect, identify which kind you have, and recommend the right treatment.",
  bullets: [
    "Thorough inspection of the structure, inside and out",
    "Identification of subterranean or drywood activity",
    "Treatment options matched to the type and extent of activity",
    "Follow-up inspections to confirm the treatment worked",
  ],
  sections: `<h2>Signs of termites</h2>
<ul><li>Swarms of winged insects indoors, often in spring</li><li>Discarded wings near windows and doors</li><li>Mud tubes on foundations or walls</li><li>Small piles of pellet-like droppings below wood</li><li>Wood that sounds hollow or blisters</li></ul>
<p>Seeing any of these? <a href="/contact/">Request a termite inspection</a>.</p>`,
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
<p>Much of our work is for condominium associations, HOAs, country clubs and multi-unit communities. We set up an ongoing program with your property manager and board, service buildings and common areas on a regular schedule, and respond quickly when a resident needs a service call.</p>
<ul class="checks">
<li>Scheduled service of buildings, grounds and common areas</li>
<li>Rodent bait stations mapped and checked every visit</li>
<li>Perimeter barrier treatments around each building</li>
<li>Quick-response service calls for individual units</li>
<li>Reports after every visit, ready for board meetings</li>
<li>One portal for managers who look after several properties</li>
</ul>
</div>
<div>${rodentMap()}</div>
</div></section>

<section class="block alt"><div class="wrap">
<div class="section-head"><h2>The customer portal for managers and boards</h2><p>Every property gets its own portal page, so managers and boards see everything in one place.</p></div>
<div class="cards">
<div class="card"><h3>Schedule</h3><p>Upcoming visits for each property.</p></div>
<div class="card"><h3>Service reports</h3><p>Every published visit report, ready to share with the board.</p></div>
<div class="card"><h3>Property map</h3><p>Bait stations and their latest activity on an aerial map.</p></div>
<div class="card"><h3>Invoices &amp; payments</h3><p>Open balances and online payment.</p></div>
<div class="card"><h3>Service requests</h3><p>Ask for a service call or a new program in a few taps.</p></div>
<div class="card"><h3>Contacts</h3><p>Keep the right people on your property's account.</p></div>
</div>
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
function speciesCards(list) {
  return `<div class="species">${list
    .map(([name, size, looks, where]) => `<div class="card"><h3>${name}</h3><dl><dt>Size</dt><dd>${size}</dd><dt>What it looks like</dt><dd>${looks}</dd><dt>Where it's found</dt><dd>${where}</dd></dl></div>`)
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
<div class="cards">
<div class="card"><h3>Ants</h3><p>Ghost ants, white-footed ants, fire ants, carpenter ants and more.</p><a class="more" href="/pests/ants/">Ant guide</a></div>
<div class="card"><h3>Cockroaches</h3><p>American "palmetto bugs," German roaches, smokybrown and others.</p><a class="more" href="/pests/cockroaches/">Cockroach guide</a></div>
<div class="card"><h3>Rodents</h3><p>Roof rats, Norway rats and house mice.</p><a class="more" href="/pests/rodents/">Rodent guide</a></div>
<div class="card"><h3>Termites</h3><p>Subterranean and drywood termites.</p><a class="more" href="/services/termite-control/">Termites</a></div>
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
  body: `<div class="wrap layout"><div class="prose" style="max-width:none">
${speciesCards([
  ["Ghost ant", "About 1/16 inch", "Tiny, with a dark head and pale, almost see-through legs and body.", "Indoors in kitchens and bathrooms, wall voids and potted plants. Loves sweets."],
  ["White-footed ant", "About 1/8 inch", "Black to dark brown with pale yellowish feet.", "Huge colonies outdoors in trees and landscaping that trail inside along walls and window frames."],
  ["Red imported fire ant", "1/16 to 1/4 inch (varied sizes)", "Reddish-brown to dark, aggressive when disturbed.", "Mounds in lawns and landscape beds. Painful stings that form pustules."],
  ["Florida carpenter ant", "1/4 to 1/2 inch", "Large, with an orange-red front and black rear.", "Nests in moist or damaged wood, palms and wall voids. Most active at night."],
  ["Big-headed ant", "About 1/8 inch", "Brown; larger workers have oversized heads.", "Nests in soil and under pavers, leaving small piles of dirt along slabs and walks."],
  ["Tawny crazy ant", "About 1/8 inch", "Reddish-brown, moves erratically in huge numbers.", "Outdoors under debris and landscaping; can overwhelm yards and get into electrical boxes."],
])}
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
  body: `<div class="wrap layout"><div class="prose" style="max-width:none">
${speciesCards([
  ["American cockroach (\"palmetto bug\")", "1 1/2 to 2 inches", "Large, reddish-brown, with a pale band behind the head.", "Sewers, drains, mulch and garages. Wanders indoors, especially after rain."],
  ["German cockroach", "1/2 to 5/8 inch", "Light brown with two dark stripes behind the head.", "Kitchens and bathrooms. Breeds indoors fast and spreads between units in multi-family buildings."],
  ["Smokybrown cockroach", "1 to 1 1/2 inches", "Shiny, uniformly dark mahogany brown.", "Tree holes, mulch, gutters and attics. Attracted to lights at night."],
  ["Florida woods roach", "1 1/4 to 1 5/8 inches", "Dark reddish-brown to black, short wings; gives off a strong odor when disturbed.", "Leaf litter, mulch and woodpiles; comes indoors occasionally."],
  ["Australian cockroach", "1 1/4 to 1 1/2 inches", "Like an American roach but with pale yellow stripes along the wing edges.", "Outdoors in plants and mulch; moves into garages and lanais."],
  ["Asian cockroach", "About 1/2 inch", "Looks like a German roach but flies readily.", "Lawns and leaf litter; flies toward lights in the evening."],
])}
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
  body: `<div class="wrap layout"><div class="prose" style="max-width:none">
${speciesCards([
  ["Roof rat", "13 to 18 inches including tail", "Slender, dark brown to black, with a tail longer than its body and large ears.", "Palm trees, dense vegetation, attics and roof lines. Excellent climbers."],
  ["Norway rat", "Up to 16 inches including tail", "Heavy-bodied, brownish-gray, with a tail shorter than its body and small ears.", "Burrows in soil along foundations, seawalls and dumpsters."],
  ["House mouse", "5 to 7 inches including tail", "Small, gray-brown, with large ears.", "Inside walls, cabinets and storage areas; can fit through a gap the width of a pencil."],
])}
<h2>Signs of rodents</h2>
<ul><li>Droppings along walls, in cabinets or in the attic</li><li>Gnawed wires, wood or packaging</li><li>Greasy rub marks along beams and walls</li><li>Scratching or scurrying noises at night</li><li>Half-eaten fruit under palms and fruit trees</li></ul>
<h2>How we control rodents</h2>
<p>We place locked bait stations around your buildings, seal the openings rodents use, and check every station at every visit. For communities and businesses, each station is pinned on a map of your property so you can see where the activity is. <a href="/services/rodent-control/">See our rodent control service</a>.</p>
</div>${asideBox}</div>
${ctaBand()}`,
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
<ul class="checks" style="columns:2">${SITE.areas.map((a) => `<li>${a}</li>`).join("")}</ul>
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
<p>For over 30 years, our family-owned and operated company has proudly served the Southwest Florida community. We know Florida's unique pest challenges, and we've built long relationships with the condominiums, homeowners associations, clubs and businesses we protect.</p>
<h2>What we believe</h2>
<ul class="checks">
<li><b>Prevention first.</b> We follow integrated pest management: identify the pest, remove what attracts it, keep it out and treat precisely.</li>
<li><b>Environmentally responsible.</b> We use the right product in the right place, not more than needed.</li>
<li><b>Show our work.</b> Every visit is recorded, and customers see their reports and station maps online.</li>
<li><b>Stand behind it.</b> If live pests show up inside after a residential treatment, we come back and retreat at no extra charge.</li>
</ul>
<h2>Licensed and state-certified</h2>
<p>Our technicians are licensed and state-certified pest specialists with deep knowledge of Southwest Florida pests.</p>
<h2>Our technology</h2>
<p>We built our own field and customer system, FieldBook, so property managers and homeowners can see their schedule, reports, bait-station maps and invoices online. <a href="/mapping/">Learn about our mapping and reporting</a>.</p>
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
<div class="card"><h3>Call</h3><a class="big-phone" href="tel:${SITE.phoneE164}">${SITE.phone}</a></div>
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
  body: `<section class="block"><div class="wrap"><a class="btn green" href="/">Back to home</a></div></section>`,
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
  condo, mapping, pestsIndex, ants, roaches, rodents, areas, about, contact, thanks, privacy, notFound,
];
