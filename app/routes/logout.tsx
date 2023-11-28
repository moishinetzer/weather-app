import { LoaderFunctionArgs } from "@remix-run/node";
import { logout } from "~/utils/auth.server";
import { route } from "~/utils/route";

// In production it would be better to have an action here instead of a loader
// https://remix.run/docs/en/main/utils/sessions#using-sessions
export async function loader({ request }: LoaderFunctionArgs) {
  return await logout({ request, redirectTo: route("/login") });
}
