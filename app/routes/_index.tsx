import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
} from "@mui/material";
import { WbSunny } from "@mui/icons-material";
import { requireLoggedIn } from "~/utils/auth.server";
import { useLoaderData } from "@remix-run/react";

// https://remix.run/docs/en/main/route/meta
export const meta: MetaFunction = () => [
  { title: "Remix Starter" },
  { name: "description", content: "Welcome to remix!" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  let username = await requireLoggedIn(request);

  return json({ username });
}

// https://remix.run/docs/en/main/file-conventions/routes#basic-routes
export default function Index() {
  let { username } = useLoaderData<typeof loader>();

  return <main className="p-10 w-full h-full">Hey {username}</main>;
}
