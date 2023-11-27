import { Air, Water, CloseOutlined } from "@mui/icons-material";
import { Card, CardHeader, CardContent, Fab } from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";

type WeatherCardProps = {
  id: number;
  city: string;
  description: string;
  headerImageSrc: string;
  temperature: string;
  humidity: string;
  precipitation: string;
  favourite: boolean;
};

export const removeFavouriteValidator = withZod(
  z.object({
    id: z.string().min(1),
  })
);

export function WeatherCard({
  id,
  city,
  description,
  headerImageSrc,
  temperature,
  humidity,
  precipitation,
}: WeatherCardProps) {
  let fetcher = useFetcher();
  return (
    <Card variant="elevation" className="relative">
      <div className="absolute bottom-2 right-2">
        <ValidatedForm
          validator={removeFavouriteValidator}
          fetcher={fetcher}
          action="/remove-favourite"
          method="post"
        >
          <Fab type="submit" size="small" variant="circular" color="secondary">
            <CloseOutlined />
          </Fab>
          <input type="hidden" name="id" value={id} />
        </ValidatedForm>
      </div>
      <CardHeader
        style={{
          backgroundImage: headerImageSrc,
          backgroundColor: "rgb(129, 236, 145)",
        }}
        title={
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="font-medium flex justify-start items-center gap-2">
                {city}
              </p>
              <p>{temperature}˚C</p>
            </div>
            <div className="flex items-center justify-start gap-4 opacity-70">
              <p className="text-sm">
                <Air /> {humidity}%
              </p>
              <p className="text-sm">
                <Water /> {precipitation}mm
              </p>
            </div>
          </div>
        }
      />
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
