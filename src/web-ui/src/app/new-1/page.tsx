import Link from "next/link";

export default function NewDesign1() {
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

      {/* What is it section - Design 1: Single Card Panel */}
      <section className="mt-24 w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 md:p-10 transform rotate-[0.3deg]">
          <h2 className="font-sketch text-2xl md:text-3xl text-foreground mb-6 text-center">
            What is naglasupan?
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            We&apos;re supercharging the sideproject and early-stage development
            ecosystem in Iceland. A space where you can show your projects, get
            and give feedback&mdash;both initial and ongoing&mdash;and share your
            experience and skills with the community.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <p className="text-center text-lg font-medium text-foreground mb-4">
              Submit your project today and enter the next round of cash prize competitions!
            </p>
            <div className="flex justify-center">
              <Link href="/register" className="btn-sketchy">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
