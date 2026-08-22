export interface Country {
  geometry: any;
  properties: {
    name: string;
  };
}

export async function getCountries(): Promise<
  Country[]
> {
  const response = await fetch("/countries.geo.json");

  const data = await response.json();

  return data.features;
}