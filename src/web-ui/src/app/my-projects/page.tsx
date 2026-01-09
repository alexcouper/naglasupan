import Link from "next/link";
import { ProjectsList } from "./ProjectsList";

export default function MyProjectsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl text-foreground mb-4 font-semibold">
            My Projects
          </h1>
          <p className="font-sketch text-2xl text-gray-600">
            Manage your submissions
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <ProjectsList />

          <div className="mt-8 text-center">
            <Link href="/submit" className="btn-sketchy inline-block">
              Submit a new project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
