import { useParams, Link } from "react-router-dom";
import { locations } from "@/data/locations";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { FloatingChat } from "@/components/FloatingChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Users, Globe, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function LocationDetail() {
  const { id } = useParams();
  const location = locations.find((l) => l.id === id);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(location?.chatMessages || []);

  if (!location) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Location not found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), user: "You", avatar: "YO", text: chatInput, time: "now" },
    ]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <img src={location.image} alt={location.city} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/" className="flex items-center gap-1 rounded-full bg-card/80 backdrop-blur-sm px-3 py-1.5 text-sm text-foreground hover:bg-card transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-card mb-1">{location.city}</h1>
          <p className="flex items-center gap-1 text-card/80">
            <MapPin className="h-4 w-4" /> {location.country}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto mb-6 bg-muted">
            <TabsTrigger value="overview">📍 Overview</TabsTrigger>
            <TabsTrigger value="food">🍴 Food</TabsTrigger>
            <TabsTrigger value="culture">🏛️ Culture</TabsTrigger>
            <TabsTrigger value="currency">💱 Currency</TabsTrigger>
            <TabsTrigger value="videos">📺 Videos</TabsTrigger>
            <TabsTrigger value="chat">💬 Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{location.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Population", value: location.population },
                { icon: Globe, label: "Language", value: location.language },
                { icon: Clock, label: "Timezone", value: location.timezone },
                { icon: MapPin, label: "Currency", value: `${location.currencySymbol} ${location.currencyCode}` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                  <stat.icon className="h-4 w-4 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="food" className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Local Cuisine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {location.dishes.map((dish) => (
                <div key={dish.name} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                  <span className="text-3xl">{dish.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{dish.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{dish.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="culture" className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">History</h2>
              <p className="text-muted-foreground leading-relaxed">{location.history}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Festivals & Celebrations</h3>
              <div className="space-y-3">
                {location.festivals.map((f) => (
                  <div key={f.name} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-foreground">{f.name}</h4>
                      <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{f.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Local Traditions</h3>
              <ul className="space-y-2">
                {location.traditions.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="currency" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Local Currency</p>
              <p className="text-2xl font-bold text-foreground">{location.currencySymbol} {location.currency} ({location.currencyCode})</p>
            </div>
            <CurrencyConverter defaultCurrency={location.currencyCode} />
          </TabsContent>

          <TabsContent value="videos">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Travel Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {location.videos.map((v) => (
                <a
                  key={v.id + v.title}
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-36 object-cover" loading="lazy" />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-card/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-foreground text-lg ml-0.5">▶</span>
                      </div>
                    </div>
                  </div>
                  <p className="p-3 text-sm font-medium text-foreground">{v.title}</p>
                </a>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Community Chat — {location.city}</h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((m) => (
                  <div key={m.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {m.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{m.user}</span>
                        <span className="text-xs text-muted-foreground">{m.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder={`Say something about ${location.city}...`}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button onClick={handleSendChat} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FloatingChat />
    </div>
  );
}
