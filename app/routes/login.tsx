import {
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Avatar,
  Checkbox,
  Typography,
  FormControlLabel,
  Paper,
} from "@mui/material";

import { WbSunny } from "@mui/icons-material";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { SubmitButton } from "~/components/submit-button";
import { TextField } from "~/components/text-field";
import { route } from "~/utils/route";
import { handleNewSession, requireAnonymous } from "~/utils/auth.server";
import { Spacer } from "~/components/spacer";

export const meta: MetaFunction = () => [
  { title: "Login" },
  { name: "description", content: "Welcome to the next-gen weather app" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let formData = await request.formData();
  let result = await logInValidator.validate(formData);

  if (result.error) return validationError(result.error);

  let { username, password, remember } = result.data;

  // Manually check username and password
  if (username !== "ipgautomotive" || password !== "carmaker")
    return validationError({
      fieldErrors: {
        username: "Wrong username or password",
        password: "Wrong username or password",
      },
    });

  return await handleNewSession({
    request,
    username,
    redirectTo: route("/"),
    remember,
  });
}

const logInValidator = withZod(
  z.object({
    username: z.string(),
    password: z.string().min(8),
    // parse, then transform to boolean
    remember: z
      .union([z.literal("on"), z.undefined()])
      .transform((value) => value === "on"),
  })
);

export default function Login() {
  return (
    <main className="grid grid-cols-2 h-screen">
      <div>
        <img
          src="https://cdn.neowin.com/news/images/uploaded/2023/05/1685529688_windows-xp-wallpaper-generative-ai.jpg"
          alt="side image"
          className="w-full h-full object-cover bg-blue-100"
        />
      </div>
      <Paper
        component={ValidatedForm}
        validator={logInValidator}
        method="post"
        elevation={10}
      >
        <div className="max-w-xl mx-auto w-full h-full flex flex-col p-10 gap-4">
          <div className="flex gap-4 text-center items-center justify-center">
            <Avatar variant="rounded">
              <WbSunny className="text-9xl text-yellow-200" />
            </Avatar>
            <Typography>Sunny Days Inc.</Typography>
          </div>

          <Spacer />

          <TextField
            name="username"
            type="text"
            label="Username"
            variant="outlined"
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            variant="outlined"
          />

          <FormControlLabel
            name="remember"
            control={<Checkbox />}
            label="Remember me"
          />

          <SubmitButton>Sign In</SubmitButton>
        </div>
      </Paper>
    </main>
  );
}
