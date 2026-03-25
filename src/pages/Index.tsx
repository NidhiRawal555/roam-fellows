import { useState } from "react";
import { locations } from "@/data/locations";
import { LocationCard } from "@/components/LocationCard";
import { SearchBar } from "@/components/SearchBar";
import { FloatingChat } from "@/components/FloatingChat";
import { Compass } from "lucide-react";

export default function Index() {
  const [search, setSearch] = useState("");

  const filtered = locations.filter(
    (l) =>
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">AtlasHub</span>
          </div>
          <SearchBar value={search} onChange={setSearch} />
          <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            12 destinations
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Discover the World
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Explore food, culture, and local vibes from 12 incredible cities around the globe.
        </p>
      </section>

      {/* Grid */}
      <main className="container mx-auto px-4 pb-20">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No destinations found for "{search}"</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </main>

      <FloatingChat />
    </div>
  );
}
