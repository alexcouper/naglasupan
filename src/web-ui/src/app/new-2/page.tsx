import Link from "next/link";

// Design Variant 2: Full-width Section Blocks
// Uses full-width color blocks to create clear visual sections.
// Hero has a subtle gradient, "What is it" is on a clean white background.

export default function NewDesign2() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - gradient from blue to white */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 font-semibold">
            Shine a light on your work
          </h1>
          <p className="font-sketch text-2xl md:text-3xl text-gray-600 mb-10">
            All great things start small
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/register" className="btn-sketchy text-lg">
              Submit Your Project
            </Link>
            <Link
              href="/prizes"
              className="bg-yellow-300 text-foreground font-bold px-6 py-3 rounded-full shadow-md border-2 border-yellow-400 hover:bg-yellow-400 transition-colors"
            >
              50,000 ISK Prize
            </Link>
          </div>

          <div className="stamp inline-block">
            <span className="stamp-text">Inaugural prize date: 24 Jan 2026</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-2xl mx-auto" />

      {/* What is it section - darker blue background */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sketch text-3xl md:text-4xl text-foreground mb-12 text-center">
            Supporting Iceland&apos;s builder ecosystem
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Panel 1 - Show */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">&#128640;</span>
              </div>
              <h3 className="font-sketch text-xl text-foreground mb-3">
                Show Your Work
              </h3>
              <p className="text-gray-600">
                A space to showcase your side projects and early-stage ideas to the Icelandic tech community.
              </p>
            </div>

            {/* Panel 2 - Feedback */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">&#128172;</span>
              </div>
              <h3 className="font-sketch text-xl text-foreground mb-3">
                Get Feedback
              </h3>
              <p className="text-gray-600">
                Receive valuable feedback&mdash;both initial and ongoing&mdash;from fellow builders and experienced developers. And win prizes.
              </p>
            </div>

            {/* Panel 3 - Grow */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">&#127793;</span>
              </div>
              <h3 className="font-sketch text-xl text-foreground mb-3">
                Share & Grow
              </h3>
              <p className="text-gray-600">
                Share your experience and skills. Learn from others. Grow together as a community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - white background */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-accent/10 border-2 border-accent/30 rounded-xl py-8 px-6 text-center">
            <p className="text-lg md:text-xl font-medium text-foreground mb-6">
              Submit your project today
            </p>
            <Link href="/register" className="btn-sketchy inline-block">
              Join community
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
