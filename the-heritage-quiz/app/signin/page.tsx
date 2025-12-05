import Image from "next/image";
import { getProviders } from "next-auth/react";

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <main style={{ padding: 24 }}>
      <h1>Sign in</h1>
      <div style={{ marginTop: 16 }}>
        {providers &&
          Object.values(providers).map((provider: any) => (
            <div key={provider.name} style={{ marginBottom: 8 }}>
              <a href={`/api/auth/signin/${provider.id}`}>
                Sign in with {provider.name}
              </a>
            </div>
          ))}
      </div>
    </main>
  );
}
