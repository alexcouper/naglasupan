import Link from "next/link";

// Design Variant 3: Compact Single-Page Layout
// Everything fits above the fold on most screens. Hero and features side by side.
// More compact and modern feel.

export default function NewDesign3() {
  return (
    <main className="min-h-screen bg-grid-paper">
      {/* Main content area */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Hero content */}
          <div>
            <h1 className="text-4xl md:text-5xl text-foreground mb-4 font-semibold leading-tight">
              Shine a light<br />on your work
            </h1>
            <p className="font-sketch text-2xl text-gray-600 mb-8">
              All great things start small
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link href="/register" className="btn-sketchy text-lg">
                Submit Your Project
              </Link>
              <Link
                href="/prizes"
                className="bg-yellow-300 text-foreground font-bold px-4 py-2 rounded-full shadow-md border-2 border-yellow-400 hover:bg-yellow-400 transition-colors text-sm"
              >
                50,000 ISK Prize
              </Link>
            </div>

            <p className="text-gray-600 mb-6">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Log in
              </Link>
            </p>

            <div className="stamp">
              <span className="stamp-text">Inaugural prize: 24 Jan 2026</span>
            </div>
          </div>

          {/* Right: Features panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h2 className="font-sketch text-2xl text-foreground mb-6 text-center">
              Supporting Iceland&apos;s builder ecosystem
            </h2>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">&#128640;</span>
                </div>
                <div>
                  <h3 className="font-sketch text-lg text-foreground mb-1">
                    Show Your Work
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Showcase your side projects and early-stage ideas to the Icelandic tech community.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">&#128172;</span>
                </div>
                <div>
                  <h3 className="font-sketch text-lg text-foreground mb-1">
                    Get Feedback
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Receive feedback from fellow builders and experienced developers. Win prizes.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">&#127793;</span>
                </div>
                <div>
                  <h3 className="font-sketch text-lg text-foreground mb-1">
                    Share & Grow
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Share your experience, learn from others, grow together as a community.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <Link href="/register" className="text-accent hover:underline font-medium">
                Join the community &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA strip */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600">
              Ready to showcase your project to Iceland&apos;s tech community?
            </p>
            <Link href="/register" className="btn-primary whitespace-nowrap">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
