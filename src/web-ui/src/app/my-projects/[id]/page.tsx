import { ProjectDetail } from "./ProjectDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MyProjectPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl text-foreground mb-4 font-semibold">
            Edit Project
          </h1>
          <p className="font-sketch text-2xl text-gray-600">
            Update your submission
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <ProjectDetail projectId={id} />
        </div>
      </section>
    </main>
  );
}
