from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_auto_fit_far():
    # Test a payload with extreme 15 floors (FAR = 9+)
    payload = {
        "plot_width": 60.0,
        "plot_depth": 80.0,
        "setback_front": 5.0,  # Fails fire safety (<6m)
        "setback_rear": 5.0,   # Fails fire safety (<6m)
        "setback_sides": 5.0,  # Fails fire safety (<6m)
        "max_far": 3.0,
        "commercial_ratio": 35.0,
        "total_floors": 15,
        "tower_stepback": 2.5
    }
    response = client.post("/api/auto-fit-far", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()
    opt = data["optimized_request"]
    res = data["massing_result"]
    
    # 1. Setbacks must be upgraded to >= 6m
    assert opt["setback_front"] >= 6.0
    assert opt["setback_rear"] >= 6.0
    assert opt["setback_sides"] >= 6.0
    
    # 2. Achieved FAR must now be <= Max FAR
    assert res["metrics"]["achieved_far"] <= (opt["max_far"] + 0.05)
    assert res["compliance"]["far_compliance"] is True
    assert res["compliance"]["fire_safety_compliance"] is True
    assert res["compliance"]["is_compliant"] is True
    
    print(f" [PASS] AUTO-FIT SOLVER: Capped floors to {opt['total_floors']}, achieved FAR: {res['metrics']['achieved_far']} <= {opt['max_far']} (COMPLIANT: {res['compliance']['is_compliant']})")

def test_bye_laws_library():
    response = client.get("/api/bye-laws/library")
    assert response.status_code == 200
    data = response.json()
    assert "nbc_2016" in data
    assert "mcgm_dcr_2034" in data
    print(" [PASS] GET /api/bye-laws/library OK")

if __name__ == "__main__":
    print("\n--- RUNNING BACKEND AUTO-FIT TESTS ---")
    test_auto_fit_far()
    test_bye_laws_library()
    print("--- ALL AUTO-FIT TESTS PASSED! ---\n")
