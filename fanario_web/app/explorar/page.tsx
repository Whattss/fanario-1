import ExplorarClient from "@/components/explorar/ExplorarClient";
import { creators } from "@/lib/sampleData";

export default function ExplorarPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-28 sm:px-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Explorar creadores</h1>
        <p className="mt-2 text-lg text-gray-600">
          Descubre talento único y apoya su trabajo directamente.
        </p>
      </div>
      
      <ExplorarClient initialCreators={creators} />
    </main>
  );
}
