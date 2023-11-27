import { redirect } from "@remix-run/server-runtime";
import { route } from "~/utils/route";
import { sessionStorage } from "~/utils/session.server";

export let SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days
export let getSessionExpirationDate = () =>
  new Date(Date.now() + SESSION_EXPIRATION_TIME);

export async function getUser(request: Request) {
  let cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  let username = cookieSession.get("username");
  return username as string | undefined;
}

export async function requireAnonymous(request: Request) {
  let username = await getUser(request);
  if (username) {
    throw redirect(route("/"));
  }
}

export async function requireLoggedIn(request: Request) {
  let username = await getUser(request);
  if (!username) {
    throw redirect(route("/login"));
  }
  return username;
}

export async function handleNewSession({
  request,
  username,
  redirectTo,
  remember,
}: {
  request: Request;
  username: string;
  redirectTo: string;
  remember: boolean;
}) {
  let headers = new Headers();

  let cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  // Here set the userId when that is implemented in the backend
  // That way you can confirm that the user is logged in.
  cookieSession.set("username", username);

  headers.append(
    "set-cookie",
    await sessionStorage.commitSession(cookieSession, {
      // When expires is not set, the cookie is deleted when the browser is closed
      expires: remember ? getSessionExpirationDate() : undefined,
    })
  );

  return redirect(redirectTo, { headers });
}

export async function logout({
  request,
  redirectTo = "/",
}: {
  request: Request;
  redirectTo?: string;
}) {
  let cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  cookieSession.unset("username");

  throw redirect(redirectTo, {
    headers: {
      "set-cookie": await sessionStorage.commitSession(cookieSession),
    },
  });
}
