import { ActionFunctionArgs } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { removeFavouriteValidator } from "~/components/weather-card";
import { db } from "~/utils/db.server";

// It makes sense to have this in a resource route.
export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let result = await removeFavouriteValidator.validate(formData);

  if (result.error) return validationError(result.error);

  let { id } = result.data;

  await db.weatherLocation.delete({
    where: {
      id: parseInt(id),
    },
  });

  return null;
}
