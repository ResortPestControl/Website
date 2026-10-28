// Business facts used across every page and in the Google schema markup.
// Keep these identical to the Google Business Profile.
export const SITE = {
  name: "Resort Pest Control",
  legalName: "Resort Pest Control, Inc.",
  url: "https://www.resortpestcontrol.com",
  description:
    "Family-owned pest control in Naples and Collier County for over 30 years. Condos, HOAs, clubs, businesses and homes: pest, rodent, termite and mosquito control.",
  phone: "(239) 352-4100",
  phoneE164: "+12393524100",
  street: "2685 Horseshoe Dr S, Suite 215",
  city: "Naples",
  region: "FL",
  zip: "34104",
  // TODO(Ryan): confirm the list of areas served.
  areas: ["Naples", "North Naples", "East Naples", "Golden Gate", "Marco Island", "Bonita Springs", "Estero"],
  // TODO(Ryan): office hours, e.g. [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday",...], opens: "08:00", closes: "17:00" }]
  hours: null,
  // TODO(Ryan): Google Business Profile, Facebook, etc.
  sameAs: [],
  portal: "https://fieldbook.resortpestcontrol.com/portal",
  portalDemo: "https://fieldbook.resortpestcontrol.com/portal/demo",
  gorilladesk: "https://portal.gorilladesk.com/resortpestcontrol",
  // The contact form posts here: FieldBook emails the office and records it as a lead.
  formEndpoint: "https://fieldbook.resortpestcontrol.com/api/website/contact",
};
