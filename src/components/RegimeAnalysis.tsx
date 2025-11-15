import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RegimeAnalysisProps {
  cryptoId: string;
  cryptoName: string;
}

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
  ohlcData: OHLCData[]
): Promise<{ currentState: RegimeState; trainingMetrics: StateMetrics[] }> => {
  // TODO: Implement actual API call
  // Example:
  // const response = await fetch('YOUR_PYTHON_API_URL/analyze', {
  //   method: 'POST',
  //   body: JSON.stringify({ cryptoId, ohlcData }),
  // });
  // return response.json();
  
  // Mock data for now
  return {
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
  };
};

const RegimeAnalysis = ({ cryptoId, cryptoName }: RegimeAnalysisProps) => {
  const { data: ohlcData, isLoading: ohlcLoading } = useQuery({
    queryKey: ['ohlc', cryptoId],
    queryFn: () => fetchOHLC(cryptoId),
    refetchInterval: 60000,
  });

  const { data: regimeData, isLoading: regimeLoading } = useQuery({
    queryKey: ['regime', cryptoId, ohlcData],
    queryFn: () => fetchRegimeAnalysis(cryptoId, ohlcData || []),
    enabled: !!ohlcData,
  });

  if (ohlcLoading || regimeLoading) {
    return (
      <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">Regime Analysis</h2>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-32 w-full" />
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
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Regime Analysis - Last 24 Hours</h2>
      
      {/* Current State Info */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{regimeData?.currentState.emoji}</span>
            <div>
              <h3 className="font-semibold text-lg">
                State {regimeData?.currentState.state}: {regimeData?.currentState.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Probability of staying in this state: {((regimeData?.currentState.stayProbability || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 24h Price Chart */}
      <div className="mb-6">
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
      </div>

      {/* Training Metrics */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Train Per-State Diagnostics
        </h3>
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

      {/* Integration Note */}
      <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>TODO:</strong> Connect to Python backend API running the HSMM model. 
          Update <code>fetchRegimeAnalysis</code> function to call your service.
        </p>
      </div>
    </div>
  );
};

export default RegimeAnalysis;
