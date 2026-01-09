import html from 'remark-html';
import { remark } from 'remark';


const why = `
We should be more ambitious in terms of what we can achieve here in Iceland.

I know there are lots of people here with side projects that they're working on, or with ideas that seem too fragile to see the light of day. But we need them.

We need them for the **solutions** they bring, for the **learning** and **collaboration** opportunities they offer, for the **jobs** they may create, and for the shared **infrastructure** they may facilitate the creation of.

I wanted to build a space that encouraged Iceland-based developers to ship the things they're working on, to show it to others and to get feedback on it.
`

const pocSection = `
We live at a time where POC creation has never been cheaper.

What we need is
 - to encourage more building
 - to provide accelerated feedback
 - to promote adoption of built products: wins in the community are wins for all of us.
`

const seniorSection = `
Developing with AI has made cloning/improving senior developers more attractive than hiring and training juniors.

This inevitable short-termism needs addressing or Iceland faces a software development extinction event.

We need a way to encourage newer developers to build and ship things, to get feedback on them, and to grow.

If companies aren't willing to invest in the next generation, the community needs to.
`

const geopoliticsSection = `
Iceland would be better off if more of our key services were built and hosted here.

We face increasing geopolitical risk, and we need to take steps to mitigate that.

I want to begin by encouraging a community of builders to use each other's side projects but later to identify opportunities for (and enable swarming on) building bigger shared infrastructure.

It's ambitious, but you've got to start somewhere.
`

async function processMarkdown(content: string) {
  const file = await remark().use(html).process(content);
  return file.toString();
}

export default async function WhyPage() {
  const [whyHtml, pocHtml, seniorHtml, geopoliticsHtml] = await Promise.all([
    processMarkdown(why),
    processMarkdown(pocSection),
    processMarkdown(seniorSection),
    processMarkdown(geopoliticsSection),
  ]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 font-semibold">
            Why?
          </h1>
          <p className="font-sketch text-2xl md:text-3xl text-gray-600">
            Building Iceland&apos;s future, together
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-2xl mx-auto" />

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <article className="max-w-3xl mx-auto article">
          <div dangerouslySetInnerHTML={{ __html: whyHtml }} />
        </article>
      </section>

      {/* PoC Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">&#128640;</span>
            </div>
            <h2 className="font-sketch text-3xl text-foreground">
              PoC cost is almost zero
            </h2>
          </div>
          <article className="article p-0">
            <div dangerouslySetInnerHTML={{ __html: pocHtml }} />
          </article>
        </div>
      </section>

      {/* Senior Developer Gap */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">&#127793;</span>
            </div>
            <h2 className="font-sketch text-3xl text-foreground">
              Senior developer gap
            </h2>
          </div>
          <article className="article p-0">
            <div dangerouslySetInnerHTML={{ __html: seniorHtml }} />
          </article>
        </div>
      </section>

      {/* Geopolitics & Digital Sovereignty */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">&#127758;</span>
            </div>
            <h2 className="font-sketch text-3xl text-foreground">
              Geopolitics &amp; Digital Sovereignty
            </h2>
          </div>
          <article className="article p-0">
            <div dangerouslySetInnerHTML={{ __html: geopoliticsHtml }} />
          </article>
        </div>
      </section>
    </main>
  );
}
