import Link from "next/link";

// Design Variant 1: Card-based Hero
// The hero content is contained in a white card panel that floats on the grid background,
// creating a clear visual boundary. The "What is it" section is in a separate card below.

export default function NewDesign1() {
  return (
    <main className="min-h-screen bg-grid-paper px-4 pt-24 pb-24">
      {/* Hero Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 font-semibold">
          Shine a light on your work
        </h1>
        <p className="font-sketch text-2xl md:text-3xl text-gray-600 mb-8">
          All great things start small
        </p>

        <Link href="/register" className="btn-sketchy text-lg inline-block">
          Submit Your Project
        </Link>

        <p className="mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-4">
          <div className="stamp">
            <span className="stamp-text">Inaugural prize date: 24 Jan 2026</span>
          </div>
          <Link
            href="/prizes"
            className="bg-yellow-300 text-foreground font-bold px-4 py-2 rounded-full shadow-md border-2 border-yellow-400 hover:bg-yellow-400 transition-colors"
          >
            50,000 ISK Prize
          </Link>
        </div>
      </div>

      {/* What is it section - separate card */}
      <div className="max-w-4xl mx-auto mt-12 bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-12">
        <h2 className="font-sketch text-3xl md:text-4xl text-foreground mb-10 text-center">
          Supporting Iceland&apos;s builder ecosystem
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Panel 1 - Show */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">&#128640;</div>
            <h3 className="font-sketch text-xl text-foreground mb-3">
              Show Your Work
            </h3>
            <p className="text-gray-600">
              A space to showcase your side projects and early-stage ideas to the Icelandic tech community.
            </p>
          </div>

          {/* Panel 2 - Feedback */}
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">&#128172;</div>
            <h3 className="font-sketch text-xl text-foreground mb-3">
              Get Feedback
            </h3>
            <p className="text-gray-600">
              Receive valuable feedback&mdash;both initial and ongoing&mdash;from fellow builders and experienced developers. And win prizes.
            </p>
          </div>

          {/* Panel 3 - Grow */}
          <div className="bg-amber-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">&#127793;</div>
            <h3 className="font-sketch text-xl text-foreground mb-3">
              Share & Grow
            </h3>
            <p className="text-gray-600">
              Share your experience and skills. Learn from others. Grow together as a community.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-10 text-center">
          <Link href="/register" className="btn-sketchy inline-block">
            Join community
          </Link>
        </div>
      </div>
    </main>
  );
}
