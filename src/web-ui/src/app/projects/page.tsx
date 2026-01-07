import { ProjectsListing } from "./ProjectsListing";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-grid-paper pt-16">
      <div className="content-wrapper">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl mb-8">Projects</h1>
          <ProjectsListing />
        </div>
      </div>
    </main>
  );
}
