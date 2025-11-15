import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const POPULAR_CRYPTOS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
];

const CryptoSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (cryptoId: string) => {
    setOpen(false);
    navigate(`/crypto/${cryptoId}`);
  };

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Search Cryptocurrency</h2>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start text-left font-normal"
          >
            <Search className="mr-2 h-4 w-4 shrink-0" />
            Search for a cryptocurrency...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white" align="start">
          <Command>
            <CommandInput placeholder="Search cryptocurrency..." />
            <CommandList>
              <CommandEmpty>No cryptocurrency found.</CommandEmpty>
              <CommandGroup>
                {POPULAR_CRYPTOS.map((crypto) => (
                  <CommandItem
                    key={crypto.id}
                    value={crypto.name}
                    onSelect={() => handleSelect(crypto.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{crypto.name}</span>
                      <span className="text-muted-foreground text-sm">{crypto.symbol}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CryptoSearch;
