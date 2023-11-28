import { z } from "zod";

const ApiWeatherResponseSchema = z.object({
  location: z.object({
    name: z.string(),
    country: z.string(),
    region: z.string().optional(),
    lat: z.number().optional(),
    lon: z.number().optional(),
    tz_id: z.string().optional(),
    localtime_epoch: z.number().optional(),
    localtime: z.string().optional(),
  }),
  current: z.object({
    condition: z.object({
      text: z.string(),
      icon: z.string(),
      code: z.number().optional(),
    }),
    humidity: z.number(),
    precip_mm: z.number(),
    temp_c: z.number(),
    last_updated_epoch: z.number().optional(),
    last_updated: z.string().optional(),
    temp_f: z.number().optional(),
    is_day: z.number().optional(),
    wind_mph: z.number().optional(),
    wind_kph: z.number().optional(),
    wind_degree: z.number().optional(),
    wind_dir: z.string().optional(),
    pressure_mb: z.number().optional(),
    pressure_in: z.number().optional(),
    precip_in: z.number().optional(),
    cloud: z.number().optional(),
    feelslike_c: z.number().optional(),
    feelslike_f: z.number().optional(),
    vis_km: z.number().optional(),
    vis_miles: z.number().optional(),
    uv: z.number().optional(),
    gust_mph: z.number().optional(),
    gust_kph: z.number().optional(),
  }),
});

export type ApiWeatherResponse = z.infer<typeof ApiWeatherResponseSchema>;

export async function getWeather(query: string) {
  const apiUrl = new URL("http://api.weatherapi.com/v1/current.json");

  apiUrl.searchParams.append("key", process.env.WEATHER_API_KEY!);
  apiUrl.searchParams.append("q", query);
  apiUrl.searchParams.append("aqi", "no");

  try {
    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    // Use the zod schema to parse this so that we can get type safety.
    // You may notice above I only restrict the types I actually use to be required.
    // That way if for some reason the API changes, I don't have to update my schema.
    // However I would want the parsing to fail if the API changes in a way that I don't expect.
    let result = ApiWeatherResponseSchema.parse(data);

    return result;
  } catch (error) {
    return null;
  }
}

export async function checkLocationExists(query: string) {
  const data = await getWeather(query);
  return !!data;
}
