import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RegimeAnalysisProps {
  cryptoId: string;
  cryptoName: string;
}

type Timeframe = '15m' | '30m' | '1h';

interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface RegimeState {
  state: number;
  emoji: string;
  title: string;
  stayProbability: number;
}

interface StateMetrics {
  state: number;
  mean_return: number;
  vol: number;
  hit_rate: number;
  avg_duration: number;
  mean_forward: number;
}

// Fetch 24h OHLC data from CoinGecko
const fetchOHLC = async (cryptoId: string): Promise<OHLCData[]> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${cryptoId}/ohlc?vs_currency=usd&days=1`
  );
  
  if (!response.ok) throw new Error('Failed to fetch OHLC data');
  
  const data = await response.json();
  return data.map((candle: number[]) => ({
    timestamp: candle[0],
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4],
  }));
};

// TODO: Replace with actual API call to your Python backend
// This should POST OHLC data to your Python service running the HSMM model
const fetchRegimeAnalysis = async (
  cryptoId: string,
  ohlcData: OHLCData[],
  timeframe: Timeframe
): Promise<{ currentState: RegimeState; trainingMetrics: StateMetrics[] }> => {
  // TODO: Implement actual API call
  // Example:
  // const response = await fetch('YOUR_PYTHON_API_URL/analyze', {
  //   method: 'POST',
  //   body: JSON.stringify({ cryptoId, ohlcData, timeframe }),
  // });
  // return response.json();
  
  // Mock data with different values per timeframe
  const mockData = {
    '15m': {
      currentState: {
        state: 2,
        emoji: "🟢",
        title: "High Volatile Bull Run",
        stayProbability: 0.87,
      },
      trainingMetrics: [
        {
          state: 0,
          mean_return: 0.001890,
          vol: 0.003774,
          hit_rate: 0.712821,
          avg_duration: 4.698795,
          mean_forward: 0.000442,
        },
        {
          state: 1,
          mean_return: -0.000457,
          vol: 0.002698,
          hit_rate: 0.494533,
          avg_duration: 5.396867,
          mean_forward: 0.000041,
        },
        {
          state: 2,
          mean_return: -0.000411,
          vol: 0.001376,
          hit_rate: 0.394069,
          avg_duration: 12.081984,
          mean_forward: -0.000152,
        },
        {
          state: 3,
          mean_return: 0.000357,
          vol: 0.001992,
          hit_rate: 0.579407,
          avg_duration: 4.186301,
          mean_forward: 0.000036,
        },
      ],
    },
    '30m': {
      currentState: {
        state: 1,
        emoji: "🟡",
        title: "Sideways Consolidation",
        stayProbability: 0.72,
      },
      trainingMetrics: [
        {
          state: 0,
          mean_return: 0.002145,
          vol: 0.004221,
          hit_rate: 0.698543,
          avg_duration: 5.234567,
          mean_forward: 0.000523,
        },
        {
          state: 1,
          mean_return: -0.000321,
          vol: 0.002145,
          hit_rate: 0.512345,
          avg_duration: 6.123456,
          mean_forward: 0.000089,
        },
        {
          state: 2,
          mean_return: -0.000567,
          vol: 0.001543,
          hit_rate: 0.423456,
          avg_duration: 10.567890,
          mean_forward: -0.000234,
        },
        {
          state: 3,
          mean_return: 0.000412,
          vol: 0.002234,
          hit_rate: 0.601234,
          avg_duration: 4.789012,
          mean_forward: 0.000067,
        },
      ],
    },
    '1h': {
      currentState: {
        state: 0,
        emoji: "🔵",
        title: "Low Volatility Uptrend",
        stayProbability: 0.93,
      },
      trainingMetrics: [
        {
          state: 0,
          mean_return: 0.002567,
          vol: 0.003123,
          hit_rate: 0.734567,
          avg_duration: 6.789012,
          mean_forward: 0.000612,
        },
        {
          state: 1,
          mean_return: -0.000189,
          vol: 0.001987,
          hit_rate: 0.478901,
          avg_duration: 7.234567,
          mean_forward: 0.000023,
        },
        {
          state: 2,
          mean_return: -0.000678,
          vol: 0.001098,
          hit_rate: 0.367890,
          avg_duration: 14.567890,
          mean_forward: -0.000289,
        },
        {
          state: 3,
          mean_return: 0.000489,
          vol: 0.002456,
          hit_rate: 0.612345,
          avg_duration: 5.123456,
          mean_forward: 0.000078,
        },
      ],
    },
  };
  
  return mockData[timeframe];
};

const RegimeAnalysis = ({ cryptoId, cryptoName }: RegimeAnalysisProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('15m');

  const { data: ohlcData, isLoading: ohlcLoading } = useQuery({
    queryKey: ['ohlc', cryptoId],
    queryFn: () => fetchOHLC(cryptoId),
    refetchInterval: 60000,
  });

  const { data: regimeData, isLoading: regimeLoading } = useQuery({
    queryKey: ['regime', cryptoId, ohlcData, selectedTimeframe],
    queryFn: () => fetchRegimeAnalysis(cryptoId, ohlcData || [], selectedTimeframe),
    enabled: !!ohlcData,
  });

  if (ohlcLoading || regimeLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="glass-card p-6 rounded-lg">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-32 mb-4"></div>
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-40"></div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-lg">
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const chartData = ohlcData?.map((candle) => ({
    time: new Date(candle.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    price: candle.close,
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current Regime State Card - Standalone */}
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Current Regime</h3>
          
          {/* Timeframe Selector Pills */}
          <div className="flex gap-2">
            {(['15m', '30m', '1h'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTimeframe === tf
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{regimeData?.currentState.emoji}</span>
          <div>
            <h3 className="text-xl font-semibold">
              State {regimeData?.currentState.state}: {regimeData?.currentState.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Chance we stay in this state: {((regimeData?.currentState.stayProbability || 0) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        
        {/* Training Metrics Table */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Train Per-State Diagnostics ({selectedTimeframe})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="py-2 px-3 font-medium">State</th>
                  <th className="py-2 px-3 font-medium">Mean Return</th>
                  <th className="py-2 px-3 font-medium">Vol</th>
                  <th className="py-2 px-3 font-medium">Hit Rate</th>
                  <th className="py-2 px-3 font-medium">Avg Duration</th>
                  <th className="py-2 px-3 font-medium">Mean Forward</th>
                </tr>
              </thead>
              <tbody>
                {regimeData?.trainingMetrics.map((metric) => (
                  <tr 
                    key={metric.state} 
                    className={`border-b border-border/50 ${
                      metric.state === regimeData.currentState.state 
                        ? 'bg-primary/10 font-semibold' 
                        : ''
                    }`}
                  >
                    <td className="py-2 px-3">{metric.state.toFixed(1)}</td>
                    <td className="py-2 px-3">{metric.mean_return.toFixed(6)}</td>
                    <td className="py-2 px-3">{metric.vol.toFixed(6)}</td>
                    <td className="py-2 px-3">{metric.hit_rate.toFixed(6)}</td>
                    <td className="py-2 px-3">{metric.avg_duration.toFixed(6)}</td>
                    <td className="py-2 px-3">{metric.mean_forward.toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Note: Current state ({regimeData?.currentState.state}) is highlighted
          </p>
        </div>
      </div>

      {/* 24h Price Chart */}
      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {cryptoName} Price - Last 24 Hours
        </h3>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Integration Note */}
        <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>TODO:</strong> Connect to Python backend API running the HSMM model. 
            Update <code>fetchRegimeAnalysis</code> function to call your service with the selected timeframe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegimeAnalysis;
