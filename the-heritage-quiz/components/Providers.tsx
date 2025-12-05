"use client";

import { SessionProvider } from "next-auth/react";
import AuthButton from "./AuthButton";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <header
        style={{ padding: 12, display: "flex", justifyContent: "flex-end" }}
      >
        <AuthButton />
      </header>
      {children}
    </SessionProvider>
  );
}
