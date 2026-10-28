// Builds the static site into ./dist. No dependencies: `node build.mjs`.
// Every page is a { path, title, description, body } entry below; the shared
// header, footer, schema markup, sitemap and redirects are generated from them.
import { mkdirSync, writeFileSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { pages } from "./content.mjs";
import { SITE } from "./site.mjs";

const OUT = new URL("./dist/", import.meta.url).pathname;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(new URL("./static/", import.meta.url).pathname, OUT, { recursive: true });

const NAV = [
  ["/services/", "Services"],
  ["/condo-hoa-pest-control/", "Condos & HOAs"],
  ["/mapping/", "Mapping & Reports"],
  ["/pests/", "Pest Guide"],
  ["/service-areas/", "Service Areas"],
  ["/about/", "About"],
  ["/contact/", "Contact"],
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: `${SITE.url}/`,
    logo: `${SITE.url}/img/logo-320.png`,
    image: `${SITE.url}/img/og.jpg`,
    telephone: SITE.phoneE164,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.street,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      postalCode: SITE.zip,
      addressCountry: "US",
    },
    areaServed: SITE.areas.map((a) => ({ "@type": "City", name: `${a}, FL` })).concat(SITE.counties.map((c) => ({ "@type": "AdministrativeArea", name: `${c}, FL` }))),
    knowsAbout: ["Pest control", "Rodent control", "Termite control", "Mosquito control", "Integrated pest management"],
    ...(SITE.hours ? { openingHoursSpecification: SITE.hours } : {}),
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

function breadcrumbSchema(page) {
  if (!page.crumbs) return null;
  const items = [["/", "Home"], ...page.crumbs, [page.path, page.h1 || page.title]];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([p, n], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${SITE.url}${p}` })),
  };
}

function header(path) {
  const links = NAV.map(([href, label]) => `<a href="${href}"${path.startsWith(href) ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap"><span>Family-owned pest control in Southwest Florida for 30+ years</span><span><a href="tel:${SITE.phoneE164}">Call ${SITE.phone}</a></span></div></div>
<header class="site-header"><div class="wrap">
<a class="brand" href="/" aria-label="${SITE.name} home"><img src="/img/logo-160.webp" width="56" height="56" alt=""><span>Resort<small>PEST CONTROL</small></span></a>
<button class="menu-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
<nav class="nav" id="nav" aria-label="Main">${links}<a class="btn small green" href="${SITE.portal}">Customer Login</a></nav>
</div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap">
<div class="cols">
<div><a class="brand" href="/"><img src="/img/logo-160.webp" width="56" height="56" alt="" loading="lazy"><span style="color:#fff">Resort<small style="color:#c9d6cd">PEST CONTROL</small></span></a>
<p style="margin-top:14px">${SITE.street}<br>${SITE.city}, ${SITE.region} ${SITE.zip}<br><a href="tel:${SITE.phoneE164}">${SITE.phone}</a></p></div>
<div><h3>Services</h3><ul>
<li><a href="/services/pest-control/">Pest Control</a></li>
<li><a href="/services/rodent-control/">Rodent Control</a></li>
<li><a href="/services/termite-control/">Termite Control</a></li>
<li><a href="/services/mosquito-control/">Mosquito Control</a></li>
<li><a href="/services/bed-bugs/">Bed Bugs</a></li>
<li><a href="/condo-hoa-pest-control/">Condos, HOAs &amp; Commercial</a></li></ul></div>
<div><h3>Customers</h3><ul>
<li><a href="${SITE.portal}">Customer Login</a></li>
<li><a href="/mapping/">Mapping &amp; Reports</a></li>
<li><a href="${SITE.portalDemo}">Try the portal demo</a></li>
<li><a href="${SITE.gorilladesk}">Billing portal (GorillaDesk)</a></li></ul></div>
<div><h3>Company</h3><ul>
<li><a href="/about/">About Us</a></li>
<li><a href="/service-areas/">Service Areas</a></li>
<li><a href="/pests/">Pest Identification</a></li>
<li><a href="/contact/">Contact</a></li>
<li><a href="/privacy/">Privacy</a></li></ul></div>
</div>
<div class="legal"><span>© ${new Date().getFullYear()} ${SITE.legalName} All rights reserved.</span><span>Licensed &amp; state-certified pest control · Naples, Florida</span></div>
</div></footer>
<div class="callbar"><a href="tel:${SITE.phoneE164}">Call now</a><a href="/contact/">Get a quote</a></div>
<script>(()=>{const b=document.querySelector('.menu-toggle'),n=document.getElementById('nav');b&&b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)})})()</script>`;
}

function crumbsHtml(page) {
  if (!page.crumbs) return "";
  const parts = [`<a href="/">Home</a>`, ...page.crumbs.map(([p, n]) => `<a href="${p}">${esc(n)}</a>`), esc(page.h1 || page.title)];
  return `<nav class="crumbs" aria-label="Breadcrumb">${parts.join(" › ")}</nav>`;
}

function render(page) {
  const url = `${SITE.url}${page.path}`;
  const fullTitle = page.path === "/" ? page.title : `${page.title} | ${SITE.name}`;
  const schemas = [page.path === "/" || page.path === "/contact/" ? businessSchema() : null, breadcrumbSchema(page), ...(page.schema || [])].filter(Boolean);
  const head = page.h1
    ? `<section class="page-head"><div class="wrap">${crumbsHtml(page)}${page.eyebrow ? `<div class="eyebrow">${page.eyebrow}</div>` : ""}<h1>${page.h1}</h1>${page.lede ? `<p class="lede">${page.lede}</p>` : ""}</div></section>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
${page.noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.url}/img/og.jpg">
<meta name="theme-color" content="#1d5b3a">
<link rel="icon" href="/img/favicon-48.png" type="image/png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/styles.css">
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
</head>
<body>
${header(page.path)}
<main id="main">
${head}
${page.body}
</main>
${footer()}
</body>
</html>
`;
}

for (const page of pages) {
  const file = page.path === "/404" ? join(OUT, "404.html") : join(OUT, page.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .filter((p) => !p.noindex && p.path !== "/404")
    .map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

// Old Wix addresses keep working (and keep their Google ranking) via 301s.
// Written to the project root (Vercel reads it from there), so commit it after a build.
const vercel = {
  buildCommand: "node build.mjs",
  outputDirectory: "dist",
  cleanUrls: false,
  trailingSlash: true,
  redirects: [
    ["/about-us", "/about/", true],
    ["/pest-identification", "/pests/", true],
    ["/ants", "/pests/ants/", true],
    ["/cockroaches", "/pests/cockroaches/", true],
    ["/rodents", "/pests/rodents/", true],
    ["/contact-us", "/contact/", true],
    ["/login", SITE.portal, false],
    ["/portal", SITE.portal, false],
    ["/pay", SITE.portal, false],
  ].flatMap(([from, to, permanent]) => [
    { source: from, destination: to, permanent },
    { source: `${from}/`, destination: to, permanent },
  ]),
  headers: [
    { source: "/img/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
  ],
};
writeFileSync(new URL("./vercel.json", import.meta.url), JSON.stringify(vercel, null, 2) + "\n");
console.log(`Built ${pages.length} pages into ${OUT}`);
