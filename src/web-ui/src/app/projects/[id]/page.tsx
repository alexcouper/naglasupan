import { PublicProjectDetail } from "./PublicProjectDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-grid-paper pt-16">
      <div className="content-wrapper">
        <div className="max-w-2xl mx-auto">
          <PublicProjectDetail projectId={id} />
        </div>
      </div>
    </main>
  );
}
