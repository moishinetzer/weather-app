import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Avatar, Card, Divider, Link, Typography } from "@mui/material";
import { WbSunny } from "@mui/icons-material";
import { requireLoggedIn } from "~/utils/auth.server";
import { useFetcher, useLoaderData, Link as RemixLink } from "@remix-run/react";
import { WeatherCard } from "~/components/weather-card";
import { Spacer } from "~/components/spacer";
import { ValidatedForm, validationError } from "remix-validated-form";
import { TextField } from "~/components/text-field";
import { SubmitButton } from "~/components/submit-button";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { db } from "~/utils/db.server";
import {
  ApiWeatherResponse,
  checkLocationExists,
  getWeather,
} from "~/utils/weather.server";
import { route } from "~/utils/route";
import { getFlagUrl } from "~/utils/flag";

// https://remix.run/docs/en/main/route/meta
export const meta: MetaFunction = () => [
  { title: "Remix Starter" },
  { name: "description", content: "Welcome to remix!" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  let username = await requireLoggedIn(request);

  let favourites = await db.weatherLocation.findMany();

  // TODO: Introduce caching
  let weatherData = await Promise.all(
    favourites.map(async (favourite) => {
      let result = await getWeather(favourite.name);
      return {
        ...result,
        id: favourite.id,
      };
    })
  );
  let filteredWeatherData = weatherData.filter(
    // TODO: Better error handling, maybe show card with error message
    (weather) => weather !== null
  );

  return json({
    username,
    weatherData: filteredWeatherData as (ApiWeatherResponse & {
      id: number;
    })[],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let result = await favouriteValidator.validate(formData);

  if (result.error) return validationError(result.error);

  let { city } = result.data;

  if (!city) return null;

  let count = await db.weatherLocation.count();

  if (count >= 5)
    return validationError({
      fieldErrors: {
        city: "You can only have 5 favourites",
      },
    });

  let exists = await checkLocationExists(city);
  if (!exists)
    return validationError({
      fieldErrors: {
        city: "Could not find city",
      },
    });

  await db.weatherLocation.create({
    data: {
      name: city,
    },
  });

  return null;
}

const favouriteValidator = withZod(
  z.object({
    city: z.string(),
  })
);

export default function Index() {
  let { username, weatherData } = useLoaderData<typeof loader>();
  let inputRef = useRef<HTMLInputElement>(null);

  let fetcher = useFetcher();

  return (
    <main className="p-10 w-full h-full">
      <div className="flex gap-4 text-center items-center justify-center">
        <Avatar variant="rounded">
          <WbSunny className="text-9xl text-yellow-200" />
        </Avatar>
        <Typography fontSize="24px">Sunny Days Inc.</Typography>
      </div>

      <Spacer />

      <Typography className="text-center">
        Welcome to the weather app, {username}
      </Typography>

      <p className="text-center w-full">
        <Link to={route("/logout")} component={RemixLink}>
          logout
        </Link>
      </p>

      <Spacer />
      <Divider />
      <Spacer />

      <ValidatedForm
        method="post"
        validator={favouriteValidator}
        fetcher={fetcher}
        onSubmit={async () => {
          inputRef.current!.value = "";
        }}
        className="flex gap-4 justify-start items-start"
      >
        <TextField name="city" label="City" inputRef={inputRef} />
        <SubmitButton color="secondary" className="h-14 w-44" fullWidth={false}>
          Add to Favourites
        </SubmitButton>
        <p className="h-14 flex items-center">(Max. 5 favourites)</p>
      </ValidatedForm>

      <Spacer />
      <Divider />
      <Spacer />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {weatherData.length > 0 ? (
          weatherData.map((weather) => (
            <WeatherCard
              id={weather.id}
              key={weather.id}
              city={weather.location.country + ", " + weather.location.name}
              description={weather.current.condition.text}
              headerImageSrc={
                getFlagUrl(weather.location.country) ??
                "https://media.wired.co.uk/photos/606dba1c9a15f73a597a2aa1/master/w_16,c_limit/weather.jpg"
              }
              // weatherIconSrc={weather.current.condition.icon}
              humidity={weather.current.humidity.toString()}
              precipitation={weather.current.precip_mm.toString()}
              temperature={weather.current.temp_c.toString()}
              favourite={true}
            />
          ))
        ) : (
          <Card
            variant="elevation"
            elevation={10}
            className="p-10 col-span-full"
          >
            <Typography className="text-center">
              Add a city to your favourites to see the weather
            </Typography>
          </Card>
        )}
      </div>
    </main>
  );
}
