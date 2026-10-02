import { useState } from 'react';
import './App.css';

interface PortfolioItem {
  loan_id: string;
  principal: number;
  interest_rate: number;
  credit_score: number;
}

interface StressTestResult {
  total_portfolio_exposure: number;
  stress_shock_applied: number;
  projected_portfolio_loss: number;
  risk_status: string;
}

function App() {
  const [unemploymentShock, setUnemploymentShock] = useState<number>(5.0);
  const [portfolio] = useState<PortfolioItem[]>([
    { loan_id: "LN-1001", principal: 250000, interest_rate: 6.5, credit_score: 740 },
    { loan_id: "LN-1002", principal: 150000, interest_rate: 7.2, credit_score: 650 }
  ]);
  const [result, setResult] = useState<StressTestResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runStressTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/risk/stress-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolio,
          unemployment_shock_percentage: unemploymentShock
        })
      });
      if (!response.ok) throw new Error("Failed to compute risk metrics");
      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">CrediMetri Risk Dashboard</h1>
          <p className="text-slate-400 mt-1">"Fullstack" Portfolio Risk Management System</p>
        </header>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl mb-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Macroeconomic Stress Simulator</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Unemployment Shock Rate</label>
              <span className="text-lg font-bold text-blue-400">{unemploymentShock}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="0.5" 
              value={unemploymentShock} 
              onChange={(e) => setUnemploymentShock(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
          </div>

          <button 
            onClick={runStressTest} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? "Running Monte Carlo Simulation..." : "Execute Stress Test"}
          </button>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-200 p-4 rounded-xl mb-6">
            <p className="font-semibold">System Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-slate-200 border-b border-slate-700 pb-2">Simulation Output</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-xs uppercase tracking-wider text-slate-400">Total Portfolio Exposure</p>
                <p className="text-2xl font-bold text-white mt-1">${result.total_portfolio_exposure.toLocaleString()}</p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-xs uppercase tracking-wider text-slate-400">Projected Portfolio Loss</p>
                <p className="text-2xl font-bold text-red-400 mt-1">${result.projected_portfolio_loss.toLocaleString()}</p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-xs uppercase tracking-wider text-slate-400">Applied Shock</p>
                <p className="text-xl font-semibold text-slate-200 mt-1">{result.stress_shock_applied}%</p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-xs uppercase tracking-wider text-slate-400">Risk Assessment Status</p>
                <p className={`text-xl font-bold mt-1 ${result.risk_status === 'Elevated' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {result.risk_status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;