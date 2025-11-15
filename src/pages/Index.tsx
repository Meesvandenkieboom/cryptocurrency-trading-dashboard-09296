import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";

const CRYPTO_MAP: Record<string, { name: string; symbol: string; tradingViewSymbol: string }> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC", tradingViewSymbol: "BINANCE:BTCUSDT" },
  ethereum: { name: "Ethereum", symbol: "ETH", tradingViewSymbol: "BINANCE:ETHUSDT" },
  solana: { name: "Solana", symbol: "SOL", tradingViewSymbol: "BINANCE:SOLUSDT" },
  ripple: { name: "XRP", symbol: "XRP", tradingViewSymbol: "BINANCE:XRPUSDT" },
  cardano: { name: "Cardano", symbol: "ADA", tradingViewSymbol: "BINANCE:ADAUSDT" },
  dogecoin: { name: "Dogecoin", symbol: "DOGE", tradingViewSymbol: "BINANCE:DOGEUSDT" },
  polkadot: { name: "Polkadot", symbol: "DOT", tradingViewSymbol: "BINANCE:DOTUSDT" },
  "avalanche-2": { name: "Avalanche", symbol: "AVAX", tradingViewSymbol: "BINANCE:AVAXUSDT" },
  binancecoin: { name: "BNB", symbol: "BNB", tradingViewSymbol: "BINANCE:BNBUSDT" },
  tether: { name: "Tether", symbol: "USDT", tradingViewSymbol: "BINANCE:USDTUSDT" },
};

const Index = () => {
  const { cryptoId } = useParams<{ cryptoId: string }>();
  const navigate = useNavigate();
  
  const crypto = cryptoId ? CRYPTO_MAP[cryptoId] : CRYPTO_MAP.bitcoin;
  const displayCryptoId = cryptoId || "bitcoin";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold mb-2">{crypto.name} Dashboard</h1>
          <p className="text-muted-foreground">Real-time {crypto.name} market data and analytics</p>
        </div>
        
        <MarketStats cryptoId={displayCryptoId} cryptoName={crypto.name} />
        
        <CryptoChart 
          symbol={crypto.tradingViewSymbol}
          cryptoName={crypto.name}
        />
        
        <PortfolioCard cryptoId={displayCryptoId} cryptoName={crypto.name} />
      </div>
    </div>
  );
};

export default Index;