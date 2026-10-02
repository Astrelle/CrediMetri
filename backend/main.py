from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

app = FastAPI(title="CrediMetri Risk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

FastAPIInstrumentor.instrument_app(app)

class PortfolioItem(BaseModel):
    loan_id: str
    principal: float = Field(..., gt=0, description="Loan Principal Amount")
    interest_rate: float = Field(..., ge=0, description="Annual Interest Rate Percentage")
    credit_score: int = Field(..., ge=300, le=850, description="Borrower Credit Score")

class StressTestRequest(BaseModel):
    portfolio: List[PortfolioItem]
    unemployment_shock_percentage: float = Field(..., description="Macroeconomic Stress Shock")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "CrediMetri Risk Engine"}

@app.post("/api/v1/risk/stress-test")
def run_stress_test(payload: StressTestRequest):
    total_exposure = sum(item.principal for item in payload.portfolio)
    estimated_loss_rate = 0.05 + (payload.unemployment_shock_percentage * 0.01)
    projected_loss = total_exposure * estimated_loss_rate

    return {
        "total_portfolio_exposure": total_exposure,
        "stress_shock_applied": payload.unemployment_shock_percentage,
        "projected_portfolio_loss": round(projected_loss, 2),
        "risk_status": "Elevated" if projected_loss > 50000 else "Stable"
    }