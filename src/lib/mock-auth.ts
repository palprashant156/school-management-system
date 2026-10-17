import type { AppUser } from "@/types";
import { users as seedUsers } from "@/data/seed";

export interface DemoAccount {
  email: string;
  name: string;
  role: AppUser["role"];
}

export const DEMO_PASSWORD = "demo1234";

export const demoAccounts: DemoAccount[] = seedUsers
  .filter((u) => u.status === "active")
  .map(({ email, name, role }) => ({ email, name, role }));

export const primaryDemoAccount: DemoAccount =
  demoAccounts.find((a) => a.role === "Administrator") ?? demoAccounts[0];

export type SignInResult = { ok: true; account: DemoAccount } | { ok: false; error: string };

const MOCK_LATENCY_MS = 700;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function signInWithDemoCredentials(email: string, password: string): Promise<SignInResult> {
  await wait(MOCK_LATENCY_MS);

  const account = demoAccounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!account || password !== DEMO_PASSWORD) {
    return {
      ok: false,
      error: `Incorrect email or password. Use the demo credentials below to sign in.`,
    };
  }
  return { ok: true, account };
}

export async function requestPasswordReset(email: string): Promise<{ ok: true; email: string }> {
  await wait(600);
  return { ok: true, email };
}
