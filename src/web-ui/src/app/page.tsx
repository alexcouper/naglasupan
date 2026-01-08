import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-grid-paper flex flex-col items-center justify-center px-4 pt-32 pb-24">
      <h1 className="text-5xl md:text-6xl lg:text-7xl text-center text-foreground mb-4 font-semibold">
        Shine a light on your work
      </h1>
      <p className="font-sketch text-2xl md:text-3xl text-center text-gray-600 mb-12">
        All great things start small
      </p>

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
        <span className="stamp-text">Inaugural prize date: 24 Jan 2026</span>
      </div>

      <Link
        href="/prizes"
        className="mt-6 bg-yellow-300 text-foreground font-bold px-4 py-2 rounded-full shadow-md border-2 border-yellow-400 hover:bg-yellow-400 transition-colors"
      >
        50,000 ISK Prize
      </Link>

      {/* What is it section */}
      <section className="mt-24 w-full max-w-4xl px-4">
        <h2 className="font-sketch text-3xl md:text-4xl text-foreground mb-12 text-center">
          Supporting Iceland&apos;s builder ecosystem
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Panel 1 - Show */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform -rotate-[0.5deg]">
            <div className="text-4xl mb-4 text-center">&#128640;</div>
            <h3 className="font-sketch text-xl text-foreground mb-3 text-center">
              Show Your Work
            </h3>
            <p className="text-gray-600 text-center">
              A space to showcase your side projects and early-stage ideas to the Icelandic tech community.
            </p>
          </div>

          {/* Panel 2 - Feedback */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform rotate-[0.3deg]">
            <div className="text-4xl mb-4 text-center">&#128172;</div>
            <h3 className="font-sketch text-xl text-foreground mb-3 text-center">
              Get Feedback
            </h3>
            <p className="text-gray-600 text-center">
              Receive valuable feedback&mdash;both initial and ongoing&mdash;from fellow builders and experienced developers. And win prizes.
            </p>
          </div>

          {/* Panel 3 - Grow */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transform -rotate-[0.3deg]">
            <div className="text-4xl mb-4 text-center">&#127793;</div>
            <h3 className="font-sketch text-xl text-foreground mb-3 text-center">
              Share & Grow
            </h3>
            <p className="text-gray-600 text-center">
              Share your experience and skills. Learn from others. Grow together as a community.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-accent/5 border-2 border-dashed border-accent/30 rounded-lg p-6 md:p-8 text-center">
          <p className="text-lg md:text-xl font-medium text-foreground mb-4">
            Submit your project today
          </p>
          <Link href="/register" className="btn-sketchy inline-block">
            Join community
          </Link>
        </div>
      </section>
    </main>
  );
}
