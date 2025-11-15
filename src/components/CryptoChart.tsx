import TradingViewWidget from 'react-tradingview-widget';

interface CryptoChartProps {
  symbol: string;
  cryptoName: string;
}

const CryptoChart = ({ symbol, cryptoName }: CryptoChartProps) => {
  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{cryptoName} Price</h2>
      </div>
      <div className="h-[400px] w-full">
        <TradingViewWidget
          symbol={symbol}
          theme="light"
          locale="en"
          autosize
          hide_side_toolbar={false}
          allow_symbol_change={false}
          interval="D"
          toolbar_bg="#FAFAF8"
          enable_publishing={false}
          hide_top_toolbar={false}
          save_image={false}
          container_id="tradingview_chart"
        />
      </div>
    </div>
  );
};

export default CryptoChart;