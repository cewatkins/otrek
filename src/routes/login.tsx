import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg p-6 text-fg">
      <div className="w-full max-w-sm border border-line bg-surface p-6">
        <p className="font-mono text-[10px] tracking-[0.35em] text-amber">OTREK</p>
        <h1 className="mt-2 font-sans text-2xl font-light tracking-[0.18em]">FLEET BOARD</h1>
        <p className="mt-2 text-sm text-muted">Sign in so the vault is yours, not just this browser.</p>
        {authEnabled ? (
          <div className="mt-5 space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full border border-line px-3 py-2 text-left font-mono text-xs hover:border-amber"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-4 font-mono text-xs text-muted">Sign-in is off.</p>
        )}
      </div>
    </main>
  );
}
