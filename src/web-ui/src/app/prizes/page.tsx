import html from 'remark-html';
import remarkGfm from 'remark-gfm'
import { remark } from 'remark';
import Link from 'next/link';

const eligibility = `
Projects must be built by Iceland-based developers. Projects can be at any stage of development, from idea to launched product.

I want to encourage general software development too, so web apps, mobile apps, desktop apps, libraries, CLIs, etc are all fair game.

I'm not 100% sure what the judging criteria will be at this point, there'll be discussions on that as we go along.

Initially the focus is on side projects, but if you have a full time project that you're working on that you're willing to share and get feedback on, that's fine too.

I'd like to get to multiple prizes in different categories, but that's for later.
`

const selection = `
To begin with I'll be picking the winners of the prizes, and largely making it up as I go along.

Soon though we'll vote on them, or have a panel of judges.

Prize frequency will be variable dependent on uptake, but somewhere in the weekly-monthly range.

Prize sizes and quantity will depend on sponsorships, but we're good for a few months at least.
`

const disclaimer = `
This is a community project, and I have no idea if this will work. All feedback is welcome.
`

async function processMarkdown(content: string) {
  const file = await remark().use(html).use(remarkGfm).process(content);
  return file.toString();
}

export default async function PrizesPage() {
  const [eligibilityHtml, selectionHtml, disclaimerHtml] = await Promise.all([
    processMarkdown(eligibility),
    processMarkdown(selection),
    processMarkdown(disclaimer),
  ]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 font-semibold">
            Prizes
          </h1>
          <p className="font-sketch text-2xl md:text-3xl text-gray-600 mb-10">
            Rewarding Iceland&apos;s builders
          </p>

          <div className="stamp inline-block relative">
            <span className="stamp-text">Inaugural prize: 24 Jan 2026</span>
            <div className="absolute -top-2 -right-8 rotate-22 bg-yellow-300 text-foreground text-xs font-bold px-2 py-1 rounded shadow border border-yellow-400 whitespace-nowrap">
              50.000 ISK
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-2xl mx-auto" />

      {/* Prize Pot Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">&#127942;</span>
          </div>
          <h2 className="font-sketch text-3xl text-foreground mb-4">
            Prize pot
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            The starting prize is 50,000 ISK, to be awarded to the best project submitted each prize period.
          </p>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">&#9989;</span>
            </div>
            <h2 className="font-sketch text-3xl text-foreground">
              Eligibility
            </h2>
          </div>
          <article className="article p-0">
            <div dangerouslySetInnerHTML={{ __html: eligibilityHtml }} />
          </article>
        </div>
      </section>

      {/* Selection Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">&#128101;</span>
            </div>
            <h2 className="font-sketch text-3xl text-foreground">
              Prize giving and selection
            </h2>
          </div>
          <article className="article p-0">
            <div dangerouslySetInnerHTML={{ __html: selectionHtml }} />
          </article>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">&#128172;</span>
            </div>
            <h2 className="font-sketch text-3xl text-foreground">
              ATH: Þetta er naglasúpa
            </h2>
          </div>
          <article className="article p-0">
            <div dangerouslySetInnerHTML={{ __html: disclaimerHtml }} />
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-accent/10 border-2 border-accent/30 rounded-xl py-8 px-6 text-center">
            <p className="text-lg md:text-xl font-medium text-foreground mb-6">
              Ready to submit your project?
            </p>
            <Link href="/register" className="btn-sketchy inline-block">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
