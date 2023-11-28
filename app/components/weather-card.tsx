import { Air, Water, CloseOutlined } from "@mui/icons-material";
import { Card, CardHeader, CardContent, Fab, CardMedia } from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { SubmitButton } from "~/components/submit-button";

export const removeFavouriteValidator = withZod(
  z.object({
    id: z.string().min(1),
  })
);

type WeatherCardProps = {
  id: number;
  city: string;
  description: string;
  headerImageSrc: string;
  weatherIconSrc: string;
  temperature: string;
  humidity: string;
  precipitation: string;
  favourite: boolean;
};
export function WeatherCard({
  id,
  city,
  description,
  headerImageSrc,
  weatherIconSrc,
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
          // This uses a fetcher to make sure a navigation is not triggered.
          // In the new Remix API, I would use `navigate={false}` instead.
          fetcher={fetcher}
          action="/remove-favourite"
          method="post"
        >
          <SubmitButton
            className="!rounded-full !w-5"
            fullWidth={false}
            type="submit"
            size="small"
            color="secondary"
          >
            <CloseOutlined />
          </SubmitButton>
          <input type="hidden" name="id" value={id} />
        </ValidatedForm>
      </div>
      <CardHeader
        title={
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="font-medium flex justify-start items-center gap-2">
                <img
                  src={headerImageSrc}
                  className="h-6 w-6 object-cover rounded-full"
                />
                {city}
              </p>
              <p className="flex flex-col justify-center items-center">
                <span>{temperature}˚C </span>
                <img src={weatherIconSrc} className="h-10 w-10 object-cover" />
              </p>
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
