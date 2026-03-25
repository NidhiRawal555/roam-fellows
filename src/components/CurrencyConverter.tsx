import { useState } from "react";
import { exchangeRates } from "@/data/locations";
import { ArrowRightLeft } from "lucide-react";

interface CurrencyConverterProps {
  defaultCurrency: string;
}

const currencies = Object.keys(exchangeRates);

export function CurrencyConverter({ defaultCurrency }: CurrencyConverterProps) {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState(defaultCurrency);

  const convert = () => {
    const val = parseFloat(amount) || 0;
    const inUsd = val / exchangeRates[from];
    return (inUsd * exchangeRates[to]).toFixed(2);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Currency Converter</h3>
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="min-w-[90px]">
          <label className="text-xs text-muted-foreground mb-1 block">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button onClick={swap} className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="min-w-[90px]">
          <label className="text-xs text-muted-foreground mb-1 block">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-muted p-4 text-center">
        <span className="text-2xl font-bold text-foreground">{convert()}</span>
        <span className="ml-2 text-muted-foreground">{to}</span>
      </div>
    </div>
  );
}
