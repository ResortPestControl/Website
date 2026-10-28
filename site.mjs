// Business facts used across every page and in the Google schema markup.
// Keep these identical to the Google Business Profile.
export const SITE = {
  name: "Resort Pest Control",
  legalName: "Resort Pest Control, Inc.",
  url: "https://www.resortpestcontrol.com",
  description:
    "Family-owned pest control in Southwest Florida (Lee and Collier counties) for over 30 years. Condos, HOAs, clubs, businesses and homes: pest, rodent, termite and mosquito control.",
  phone: "(239) 352-4100",
  phoneE164: "+12393524100",
  street: "2685 Horseshoe Dr S, Suite 215",
  city: "Naples",
  region: "FL",
  zip: "34104",
  // Southwest Florida = Lee and Collier counties (the owner, 2026-10-28).
  counties: ["Collier County", "Lee County"],
  areas: ["Naples", "Marco Island", "Golden Gate", "Ave Maria", "Immokalee", "Bonita Springs", "Estero", "Fort Myers", "Cape Coral", "Fort Myers Beach", "Sanibel", "Lehigh Acres"],
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
