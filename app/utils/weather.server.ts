export type ApiWeatherResponse = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
};

export async function getWeather(query: string) {
  const apiUrl = new URL("http://api.weatherapi.com/v1/current.json");

  apiUrl.searchParams.append("key", process.env.WEATHER_API_KEY!);
  apiUrl.searchParams.append("q", query);
  apiUrl.searchParams.append("aqi", "no");

  try {
    const response = await fetch(apiUrl.toString());
    const data = await response.json();
    return data as ApiWeatherResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function checkLocationExists(query: string) {
  const data = await getWeather(query);
  return !!(data && data.location.name && data.current.temp_c);
}
