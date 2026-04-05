import Link from "next/link";
import { SignupForm } from "./SignupForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="w-full max-w-sm space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Create account
        </h1>
        <p className="text-sm text-zinc-600">
          Email and password are stored securely (bcrypt). OAuth is optional later.
        </p>
      </div>

      <SignupForm />

      <p className="text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-zinc-900 underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>

      <Link
        href="/"
        className="text-sm text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
