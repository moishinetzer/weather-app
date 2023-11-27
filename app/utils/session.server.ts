import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    path: "/",
    secrets: [process.env.SESSION_SECRET!],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

const {
  getSession,
  commitSession: rootCommitSession,
  destroySession,
} = sessionStorage;
export { getSession, destroySession };

// we have to do this because every time you commit the session you overwrite it
// so we store the expiration time in the cookie and reset it every time we commit
export async function commitSession(
  ...args: Parameters<typeof rootCommitSession>
) {
  let [session, options] = args;
  if (options?.expires) {
    session.set("expires", options.expires);
  }
  let expires = session.get("expires")
    ? new Date(session.get("expires"))
    : undefined;
  return rootCommitSession(session, { expires, ...options });
}
