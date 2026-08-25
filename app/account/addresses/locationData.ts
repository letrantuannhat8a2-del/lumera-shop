export type CountryConfig = {
  code: string;
  name: string;

  regionLabel: string;
  cityLabel: string;
  districtLabel?: string;

  postalLabel: string;

  hasRegion: boolean;
  hasCity: boolean;
  hasDistrict: boolean;

  regionRequired: boolean;
  cityRequired: boolean;
  districtRequired: boolean;
};

export const countries: CountryConfig[] = [
  {
    code: "JP",
    name: "Japan",
    regionLabel: "PREFECTURE",
    cityLabel: "CITY",
    districtLabel: "WARD / DISTRICT",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "US",
    name: "United States",
    regionLabel: "STATE",
    cityLabel: "CITY",
    postalLabel: "ZIP CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "CA",
    name: "Canada",
    regionLabel: "PROVINCE / TERRITORY",
    cityLabel: "CITY",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "GB",
    name: "United Kingdom",
    regionLabel: "COUNTY / REGION",
    cityLabel: "CITY / TOWN",
    postalLabel: "POSTCODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "AU",
    name: "Australia",
    regionLabel: "STATE / TERRITORY",
    cityLabel: "CITY / SUBURB",
    postalLabel: "POSTCODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "KR",
    name: "South Korea",
    regionLabel: "PROVINCE / CITY",
    cityLabel: "CITY / DISTRICT",
    districtLabel: "DISTRICT",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: true,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "SG",
    name: "Singapore",
    regionLabel: "",
    cityLabel: "",
    postalLabel: "POSTAL CODE",

    hasRegion: false,
    hasCity: false,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: false,
    districtRequired: false,
  },

  {
    code: "TH",
    name: "Thailand",
    regionLabel: "PROVINCE",
    cityLabel: "DISTRICT",
    districtLabel: "SUBDISTRICT",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: true,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "FR",
    name: "France",
    regionLabel: "REGION",
    cityLabel: "CITY / COMMUNE",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "DE",
    name: "Germany",
    regionLabel: "STATE",
    cityLabel: "CITY",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "IT",
    name: "Italy",
    regionLabel: "REGION",
    cityLabel: "CITY / COMUNE",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "ES",
    name: "Spain",
    regionLabel: "AUTONOMOUS COMMUNITY",
    cityLabel: "CITY / MUNICIPALITY",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "NL",
    name: "Netherlands",
    regionLabel: "PROVINCE",
    cityLabel: "CITY / TOWN",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "CH",
    name: "Switzerland",
    regionLabel: "CANTON",
    cityLabel: "CITY / MUNICIPALITY",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "AE",
    name: "United Arab Emirates",
    regionLabel: "EMIRATE",
    cityLabel: "CITY",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: true,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "NZ",
    name: "New Zealand",
    regionLabel: "REGION",
    cityLabel: "CITY / TOWN",
    postalLabel: "POSTCODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "SE",
    name: "Sweden",
    regionLabel: "COUNTY",
    cityLabel: "CITY / TOWN",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "NO",
    name: "Norway",
    regionLabel: "COUNTY",
    cityLabel: "CITY / TOWN",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "DK",
    name: "Denmark",
    regionLabel: "REGION",
    cityLabel: "CITY",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "FI",
    name: "Finland",
    regionLabel: "REGION",
    cityLabel: "CITY",
    postalLabel: "POSTAL CODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: true,
    districtRequired: false,
  },

  {
    code: "IE",
    name: "Ireland",
    regionLabel: "COUNTY",
    cityLabel: "CITY / TOWN",
    postalLabel: "EIRCODE",

    hasRegion: true,
    hasCity: true,
    hasDistrict: false,

    regionRequired: false,
    cityRequired: true,
    districtRequired: false,
  },
];