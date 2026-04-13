import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Heart, Plane, MapPin, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { locations } from "@/data/locations";
import { getAllUsers } from "@/hooks/use-user-data";

export default function Connect() {
  const users = getAllUsers();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">AtlasHub</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> {users.length} travelers
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-10 pb-6 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Connect with Travelers</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Discover fellow explorers, their favorite destinations, and hidden gems from around the world.</p>
      </section>

      <main className="container mx-auto px-4 pb-20 max-w-3xl space-y-4">
        {users.map((u) => {
          const favLocs = locations.filter((l) => u.favoriteLocations.includes(l.id));
          const visitedLocs = locations.filter((l) => u.visitedLocations.includes(l.id));
          const initials = u.username.slice(0, 2).toUpperCase();

          return (
            <Link
              key={u.id}
              to={`/user/${u.id}`}
              className="block rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-foreground">{u.username}</h2>
                  <p className="text-sm text-muted-foreground">{u.bio}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-destructive" /> {favLocs.length} favorites
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane className="h-3 w-3 text-primary" /> {visitedLocs.length} visited
                    </span>
                  </div>

                  {favLocs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {favLocs.map((l) => (
                        <span key={l.id} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                          {l.flag} {l.city}
                        </span>
                      ))}
                    </div>
                  )}

                  {visitedLocs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {visitedLocs.map((l) => (
                        <span key={l.id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" /> {l.city}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
