import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MarketStatsProps {
  cryptoId: string;
  cryptoName: string;
}

const fetchCryptoStats = async (cryptoId: string) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoId}`
  );
  return response.json();
};

const MarketStats = ({ cryptoId, cryptoName }: MarketStatsProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['cryptoStats', cryptoId],
    queryFn: () => fetchCryptoStats(cryptoId),
    refetchInterval: 30000,
  });

  const stats = data?.[0];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 rounded-lg">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-3"></div>
              <div className="h-8 bg-muted rounded w-32 mb-2"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
          <TrendingUpIcon className={`w-4 h-4 ${stats?.market_cap_change_percentage_24h >= 0 ? 'text-success' : 'text-warning'}`} />
        </div>
        <p className="text-2xl font-semibold mt-2">
          ${(stats?.market_cap / 1e9).toFixed(2)}B
        </p>
        <span className={`text-sm flex items-center gap-1 ${stats?.market_cap_change_percentage_24h >= 0 ? 'text-success' : 'text-warning'}`}>
          {stats?.market_cap_change_percentage_24h >= 0 ? (
            <ArrowUpIcon className="w-3 h-3" />
          ) : (
            <ArrowDownIcon className="w-3 h-3" />
          )}
          {Math.abs(stats?.market_cap_change_percentage_24h || 0).toFixed(2)}%
        </span>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">
          ${(stats?.total_volume / 1e9).toFixed(2)}B
        </p>
        <span className={`text-sm flex items-center gap-1 ${stats?.price_change_percentage_24h >= 0 ? 'text-success' : 'text-warning'}`}>
          {stats?.price_change_percentage_24h >= 0 ? (
            <ArrowUpIcon className="w-3 h-3" />
          ) : (
            <ArrowDownIcon className="w-3 h-3" />
          )}
          {Math.abs(stats?.price_change_percentage_24h || 0).toFixed(2)}%
        </span>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Current Price</h3>
          <TrendingUpIcon className={`w-4 h-4 ${stats?.price_change_percentage_24h >= 0 ? 'text-success' : 'text-warning'}`} />
        </div>
        <p className="text-2xl font-semibold mt-2">
          ${stats?.current_price?.toLocaleString()}
        </p>
        <span className={`text-sm flex items-center gap-1 ${stats?.price_change_percentage_24h >= 0 ? 'text-success' : 'text-warning'}`}>
          {stats?.price_change_percentage_24h >= 0 ? (
            <ArrowUpIcon className="w-3 h-3" />
          ) : (
            <ArrowDownIcon className="w-3 h-3" />
          )}
          {Math.abs(stats?.price_change_percentage_24h || 0).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default MarketStats;