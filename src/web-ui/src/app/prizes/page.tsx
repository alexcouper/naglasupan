import html from 'remark-html';
import remarkGfm from 'remark-gfm'
import { remark } from 'remark';


const prizes = `
# Prizes

## Prize pot

The starting prize is 50,000 ISK, to be awarded to the best project submitted each prize period.

## Eligibility

Projects must be built by Iceland-based developers. Projects can be at any stage of development, from idea to launched product.

I want to encourage general software development too, so web apps, mobile apps, desktop apps, libraries, CLIs, etc are all fair game.

I'm not 100% sure what the judging criteria will be at this point, there'll be discussions on that as we go along.

Initially the focus is on side projects, but if you have a full time project that you're working on that you're willing to share and get feedback on, that's fine too.

I'd like to get to multiple prizes in different categories, but that's for later.

## Prize giving and selection

To begin with I'll be picking the winners of the prizes, and largely making it up as I go along.

Soon though we'll vote on them, or have a panel of judges.

Prize frequency will be variable dependent on uptake, but somewhere in the weekly-monthly range.

Prize sizes and quantity will depend on sponsorships, but we're good for a few months at least.

## ATH: Þetta er naglasúpa

This is a community project, and I have no idea if this will work. All feedback is welcome.

`

export default async function PrizesPage() {

  const file = await remark()
  .use(html)
  .use(remarkGfm)
  .process(prizes)

  const contentHtml = file.toString();

  return (
    <div className="min-h-screen bg-grid-paper pt-16">

      <article className="article content-wrapper">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </div>
  );
}
