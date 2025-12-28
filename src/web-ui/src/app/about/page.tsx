import html from 'remark-html';
import remarkGfm from 'remark-gfm'
import { remark } from 'remark';


const about = `
# About

Neglasúpan is a community project started by Alex Couper / Codalens ehf to encourage Iceland-based developers to share and ship their side projects, get feedback on them, and generally foster a community of builders.

## Tech stack
 - Frontend: Next.js, React
 - Backend: Django
 - Database: PostgreSQL
 - Hosting: Scaleway (eu) - using their serverless-compute containers offering

 ## AI Development
  - Used claude (I *think* sonnet 4.5) via both opencode and claude code interactively.
  - Text is written by me, sometimes with (annoying) intervention from github copilot (vscode + openai gpt 4.1)
`

export default async function AboutPage() {

  const file = await remark()
  .use(html)
  .use(remarkGfm)
  .process(about)

  const contentHtml = file.toString();

  return (
    <div className="min-h-screen bg-grid-paper pt-16">

      <article className="article content-wrapper">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </div>
  );
}
