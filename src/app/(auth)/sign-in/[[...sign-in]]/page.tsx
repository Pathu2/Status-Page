import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-6 space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to continue to your account
          </p>
        </div>
        <SignIn
          path="/sign-in"
          routing="path"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-xl border border-gray-100",
            },
          }}
        />
      </div>
    </div>
  );
}
