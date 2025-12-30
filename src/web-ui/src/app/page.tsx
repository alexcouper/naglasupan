import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-grid-paper flex flex-col items-center justify-center px-4 pt-16">
      <h1 className="font-sketch text-4xl md:text-5xl lg:text-6xl text-center text-foreground mb-16">
        All great things start small
      </h1>

      <div className="w-2 h-2 rounded-full bg-foreground mb-16" />

      <Link href="/register" className="btn-sketchy text-lg">
        Submit Your Project
      </Link>

      <p className="mt-8 text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>

      <div className="stamp mt-16">
        <span className="stamp-text">Inaugural review date: 24 Jan 2026</span>
      </div>
    </main>
  );
}
