import html from 'remark-html';
import { remark } from 'remark';


const why = `
# Why?

We should be more ambitious in terms of what we can achieve here in Iceland.

I wanted to build a space that encouraged Iceland-based developers to ship the things they're working on, to show it to others and to get feedback on it.

I know there are lots of people here with side projects that they’re working on, or with ideas that seem too fragile to see the light of day. But we need them.

We need them for the **solutions** they bring, for the **learning** and **collaboration** opportunities they offer, for the **jobs** they may create, and for the downstream **infrastructure** they may facilitate the creation of.

## PoC cost is almost zero

We live at a time where POC creation has never been cheaper.

What we need is
 - to encourage more building
 - to provide accelerated feedback
 - to promote adoption of built products: wins in the community are wins for all of us.

## Senior developer gap

Developing with AI has made cloning/improving senior developers more attractive than hiring and training juniors.

This inevitable short-termism needs addressing or Iceland faces a software development extinction event.

We need a way to encourage newer developers to build and ship things, to get feedback on them, and to grow

If companies aren't willing to invest in the next generation, the community needs to.

## Geopolitics & Digital Sovereignty

Iceland would be better off if more of our key services were built and hosted here.

We face increasing geopolitical risk, and we need to take steps to mitigate that.

I want to begin by encouraging a community of builders to use each other's side projects but later to identify opportunities for and enable swarming on building bigger shared infrastructure.

It's ambitious, but you've got to start somewhere.

So get submitting!
`

export default async function WhyPage() {

  const file = await remark()
  .use(html)
  .process(why)

  const contentHtml = file.toString();

  return (
    <div className="min-h-screen bg-grid-paper pt-16">

      <article className="article content-wrapper">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </div>
  );
}
