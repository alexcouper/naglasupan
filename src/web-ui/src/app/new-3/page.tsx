import Link from "next/link";

export default function NewDesign3() {
  return (
    <main className="min-h-screen bg-grid-paper flex flex-col items-center justify-center px-4 pt-16 pb-24">
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

      {/* What is it section - Design 3: Split Manifesto Style */}
      <section className="mt-24 w-full max-w-5xl px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - The What */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 transform -rotate-[0.5deg]">
            <div className="border-l-4 border-accent pl-6">
              <h2 className="font-sketch text-2xl md:text-3xl text-foreground mb-4">
                What is naglasupan?
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                We&apos;re supercharging the sideproject and early-stage development
                ecosystem in Iceland by providing a space where we can show our
                projects, get and receive feedback&mdash;on an initial and ongoing
                basis&mdash;and share our experience and skills.
              </p>
            </div>
          </div>

          {/* Right side - The Why/Benefits */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Show your projects</h3>
                <p className="text-gray-600">Get your work seen by the Icelandic tech community</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Get feedback</h3>
                <p className="text-gray-600">Initial reviews and ongoing guidance from peers</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Share & learn</h3>
                <p className="text-gray-600">Exchange experience and skills with fellow builders</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-white font-bold">&#9733;</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Win prizes</h3>
                <p className="text-gray-600">Enter the next round of cash prize competitions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="font-sketch text-xl md:text-2xl text-foreground mb-6">
            Ready to show Iceland what you&apos;re building?
          </p>
          <Link href="/register" className="btn-sketchy text-lg">
            Submit Your Project
          </Link>
        </div>
      </section>
    </main>
  );
}
