import { Link } from "react-router-dom";
import type { Location } from "@/data/locations";
import { MapPin, Users, Globe } from "lucide-react";

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
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display text-xl font-bold text-card">{location.city}</h3>
            <p className="flex items-center gap-1 text-sm text-card/80">
              <MapPin className="h-3 w-3" />
              {location.country}
            </p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{location.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {location.population}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {location.language.split(",")[0]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
