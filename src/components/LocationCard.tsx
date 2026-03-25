import { Link } from "react-router-dom";
import type { Location } from "@/data/locations";
import { Users, Globe, ChevronRight } from "lucide-react";

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Link to={`/location/${location.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-52 overflow-hidden">
          <img
            src={location.image}
            alt={location.city}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute top-3 right-3 text-2xl">{location.flag}</div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display text-xl font-bold text-card">{location.city}</h3>
            <p className="text-sm text-card/80">{location.country}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {location.population}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {location.language.split(",")[0]}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-lg border border-border py-2 text-sm text-muted-foreground group-hover:text-foreground group-hover:border-primary/30 transition-colors">
            Explore <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
