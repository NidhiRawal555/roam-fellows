import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { locations } from "@/data/locations";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = value.length > 0
    ? locations.filter(
        (l) =>
          l.city.toLowerCase().includes(value.toLowerCase()) ||
          l.country.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search cities or countries..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          className="w-full rounded-full border border-border bg-card pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
        {value && (
          <button onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {focused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
          {suggestions.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                navigate(`/location/${l.id}`);
                setFocused(false);
                onChange("");
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
            >
              <img src={l.image} alt="" className="h-8 w-8 rounded-md object-cover" />
              <div>
                <span className="font-medium text-foreground">{l.city}</span>
                <span className="text-muted-foreground">, {l.country}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
