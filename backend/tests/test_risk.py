from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "CrediMetri Risk Engine"}

def test_stress_test_calculation():
    payload = {
        "portfolio": [
            {
                "loan_id": "LN-TEST-1",
                "principal": 100000.0,
                "interest_rate": 5.0,
                "credit_score": 700
            }
        ],
        "unemployment_shock_percentage": 5.0
    }
    response = client.post("/api/v1/risk/stress-test", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_portfolio_exposure"] == 100000.0
    assert data["stress_shock_applied"] == 5.0
    assert data["projected_portfolio_loss"] == 100000.0 * (0.05 + (5.0 * 0.01))
    assert data["risk_status"] in ["Stable", "Elevated"]