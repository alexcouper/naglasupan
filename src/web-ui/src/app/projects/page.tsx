import { Suspense } from "react";
import { ProjectsListing } from "./ProjectsListing";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl text-foreground mb-4 font-semibold">
            Projects
          </h1>
          <p className="font-sketch text-2xl text-gray-600">
            Explore what the community is building
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<p className="text-gray-600">Loading...</p>}>
            <ProjectsListing />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
