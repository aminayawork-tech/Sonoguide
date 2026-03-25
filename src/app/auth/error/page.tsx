export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Confirmation link expired
        </h1>
        <p className="text-gray-400 mb-6">
          This link is no longer valid. Please sign up again to receive a new
          confirmation email.
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
