import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, MapPin, LogOut, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { locations } from "@/data/locations";
import { useToast } from "@/hooks/use-toast";

interface MockUser {
  email: string;
  username: string;
  avatar: string;
  bio?: string;
  favoriteLocations?: string[];
}

const DEFAULT_USER: MockUser = {
  email: "traveler@atlashub.com",
  username: "WorldExplorer",
  bio: "Passionate about discovering new cultures and cuisines around the world.",
  favoriteLocations: ["tokyo", "paris", "istanbul"],
};

export default function Profile() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", bio: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("atlashub_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser({ ...DEFAULT_USER, ...parsed });
    } else {
      setUser(DEFAULT_USER);
      localStorage.setItem("atlashub_user", JSON.stringify(DEFAULT_USER));
    }
  }, []);

  if (!user) return null;

  const initials = user.username.slice(0, 2).toUpperCase();
  const favoriteLocations = locations.filter((l) => user.favoriteLocations?.includes(l.id));

  const handleEdit = () => {
    setEditForm({ username: user.username, bio: user.bio || "" });
    setEditing(true);
  };

  const handleSave = () => {
    const updated = { ...user, username: editForm.username, bio: editForm.bio };
    setUser(updated);
    localStorage.setItem("atlashub_user", JSON.stringify(updated));
    setEditing(false);
    toast({ title: "Profile updated!" });
  };

  const handleLogout = () => {
    localStorage.removeItem("atlashub_user");
    toast({ title: "Logged out" });
    navigate("/auth");
  };

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
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground gap-1.5">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-10 space-y-8">
        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-5">
            <Avatar className="h-16 w-16 text-lg">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-username" className="text-xs">Username</Label>
                    <Input id="edit-username" value={editForm.username} onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-bio" className="text-xs">Bio</Label>
                    <Input id="edit-bio" value={editForm.bio} onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" /> Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-foreground">{user.username}</h1>
                    <button onClick={handleEdit} className="text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.bio && <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Favorites", value: favoriteLocations.length },
            { label: "Countries Visited", value: 8 },
            { label: "Chat Messages", value: 42 },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Favorite Destinations */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Favorite Destinations</h2>
          <div className="space-y-2">
            {favoriteLocations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No favorites yet. Explore destinations and add some!</p>
            ) : (
              favoriteLocations.map((loc) => (
                <Link
                  key={loc.id}
                  to={`/location/${loc.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow"
                >
                  <span className="text-2xl">{loc.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{loc.city}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {loc.country}
                    </p>
                  </div>
                  <img src={loc.image} alt={loc.city} className="h-10 w-10 rounded-lg object-cover" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
