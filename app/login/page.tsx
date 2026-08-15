import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-8 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          🔐 Admin Login
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
          Log in to manage your portfolio&apos;s messages and content.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
