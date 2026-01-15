import { MyReviewsContent } from "./MyReviewsContent";

export default function MyReviewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-24 pb-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl text-foreground mb-4 font-semibold">
            My Reviews
          </h1>
          <p className="font-sketch text-2xl text-gray-600">
            Rank projects for competitions
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <MyReviewsContent />
        </div>
      </section>
    </main>
  );
}
