import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSession {
  isLoggedIn: boolean;
  username: string;
}

const SESSION_OPTIONS = {
  cookieName: "asnl_admin_session",
  password: process.env.ADMIN_SECRET ?? "asnl-admin-super-secret-key-change-in-prod-32chars",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 heures
  },
};

export async function getSession(): Promise<IronSession<AdminSession>> {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, SESSION_OPTIONS);
}

export async function requireAdmin(): Promise<AdminSession | null> {
  const session = await getSession();
  if (!session.isLoggedIn) return null;
  return session;
}
