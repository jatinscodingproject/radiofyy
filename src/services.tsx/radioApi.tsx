export interface RadioStation {
  stationuuid: string;
  name: string;
  country: string;
  favicon: string;
  url: string;
  url_resolved: string;
  language: string;
  tags: string;
}

const API =
  "https://de1.api.radio-browser.info/json";

export async function getStationsByCountry(
  country: string
): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${API}/stations/bycountry/${encodeURIComponent(
        country
      )}?hidebroken=true&limit=20&order=votes&reverse=true`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stations");
    }

    const stations: RadioStation[] =
      await response.json();

    return stations.filter(
      (station) =>
        station.url_resolved &&
        station.url_resolved.length > 0
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function searchStations(
  keyword: string
): Promise<RadioStation[]> {
  try {
    const response = await fetch(
      `${API}/stations/search?name=${encodeURIComponent(
        keyword
      )}&hidebroken=true&limit=20`
    );

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTopStations(): Promise<
  RadioStation[]
> {
  try {
    const response = await fetch(
      `${API}/stations/topvote/20`
    );

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}