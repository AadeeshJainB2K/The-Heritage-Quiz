"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <button disabled>Loading...</button>;

  if (!session) {
    return <button onClick={() => signIn("google")}>Sign in</button>;
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <img
        src={session.user?.image || ""}
        alt="avatar"
        width={32}
        height={32}
      />
      <span>{session.user?.name || session.user?.email}</span>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
