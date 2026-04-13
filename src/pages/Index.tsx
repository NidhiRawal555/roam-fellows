import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { locations } from "@/data/locations";
import { LocationCard } from "@/components/LocationCard";
import { SearchBar } from "@/components/SearchBar";
import { FloatingChat } from "@/components/FloatingChat";
import { Compass, User, LogOut, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("atlashub_user");
    if (stored) {
      const user = JSON.parse(stored);
      setIsLoggedIn(true);
      setUsername(user.username || user.email?.split("@")[0] || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("atlashub_user");
    setIsLoggedIn(false);
    setUsername("");
    toast({ title: "Logged out successfully" });
  };

  const filtered = locations.filter(
    (l) =>
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">AtlasHub</span>
          </div>
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex items-center gap-3">
            <Link
              to="/connect"
              className="flex items-center gap-1.5 h-9 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors px-3 text-sm font-medium"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Connect</span>
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">{username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <User className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Discover the World
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Explore food, culture, and local vibes from 12 incredible cities around the globe.
        </p>
      </section>

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
