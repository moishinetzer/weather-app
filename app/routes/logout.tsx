import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { logout } from "~/utils/auth.server";
import { route } from "~/utils/route";

export async function loader({ request }: LoaderFunctionArgs) {
  return await logout({ request, redirectTo: route("/login") });
}
