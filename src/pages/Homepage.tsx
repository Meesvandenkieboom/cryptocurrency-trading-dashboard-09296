import CryptoList from "@/components/CryptoList";
import CryptoSearch from "@/components/CryptoSearch";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Dashboard</h1>
          <p className="text-muted-foreground">Track and analyze cryptocurrency markets</p>
        </header>
        
        <CryptoSearch />
        <CryptoList />
      </div>
    </div>
  );
};

export default Homepage;
