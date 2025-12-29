import { ProjectsList } from "./ProjectsList";

export default function MyProjectsPage() {
  return (
    <main className="min-h-screen bg-grid-paper pt-16">
      <div className="content-wrapper">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl mb-8">My Projects</h1>
          <ProjectsList />
        </div>
      </div>
    </main>
  );
}
