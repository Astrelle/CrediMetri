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
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>CredMetrics Risk Dashboard</h1>
      <p>Full Stack Portfolio Practice Project</p>

      <div style={{ background: '#f4f4f4', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h2>Macroeconomic Stress Parameters</h2>
        <label>
          Unemployment Shock Percentage: <strong>{unemploymentShock}%</strong>
        </label>
        <input 
          type="range" 
          min="1" 
          max="15" 
          step="0.5" 
          value={unemploymentShock} 
          onChange={(e) => setUnemploymentShock(parseFloat(e.target.value))}
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
        <button 
          onClick={runStressTest} 
          disabled={loading}
          style={{ background: '#0056b3', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}
        >
          {loading ? "Running Simulation..." : "Run Portfolio Stress Test"}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}

      {result && (
        <div style={{ background: '#e9f7ef', border: '1px solid #27ae60', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Simulation Results</h3>
          <p><strong>Total Portfolio Exposure:</strong> ${result.total_portfolio_exposure.toLocaleString()}</p>
          <p><strong>Applied Shock:</strong> {result.stress_shock_applied}%</p>
          <p><strong>Projected Portfolio Loss:</strong> ${result.projected_portfolio_loss.toLocaleString()}</p>
          <p><strong>Risk Status:</strong> <span style={{ color: result.risk_status === 'Elevated' ? 'red' : 'green', fontWeight: 'bold' }}>{result.risk_status}</span></p>
        </div>
      )}
    </div>
  );
}

export default App;