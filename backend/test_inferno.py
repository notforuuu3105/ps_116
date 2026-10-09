from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_inferno_massing():
    payload = {
        "plot_width": 60.0,
        "plot_depth": 80.0,
        "setback_front": 7.5,
        "setback_rear": 6.0,
        "setback_sides": 6.0,
        "max_far": 3.0,
        "commercial_ratio": 30.0,
        "total_floors": 10,  # B + G + 9
        "has_basement": True,
        "tower_stepback": 3.0,
        "courtyard_width": 16.0,
        "courtyard_depth": 20.0
    }
    response = client.post("/api/generate-massing", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()
    metrics = data["metrics"]
    courtyard = data["courtyard"]
    floors = data["floors"]

    # Verify B + G + 9 floors
    assert len(floors) == 11  # 1 basement (B1) + 10 above ground (G to L9)
    assert floors[0]["floor_code"] == "B1"
    assert floors[1]["floor_code"] == "G"
    assert floors[2]["floor_code"] == "L1"
    assert floors[-1]["floor_code"] == "L9"

    # Verify Courtyard
    assert courtyard["width"] == 16.0
    assert courtyard["depth"] == 20.0
    assert courtyard["daylight_penetration_pct"] > 60
    assert courtyard["is_open_to_sky"] is True

    # Verify Derived Parking & EV
    assert metrics["total_parking_spaces"] > 0
    assert metrics["ev_charging_bays"] > 0
    assert metrics["accessible_parking_bays"] > 0

    print(f" [PASS] B+G+9 Massing: {len(floors)} levels, FAR: {metrics['achieved_far']}, Courtyard Area: {courtyard['area']} m², Parking: {metrics['total_parking_spaces']} bays ({metrics['ev_charging_bays']} EV)")

def test_design_options():
    payload = {
        "plot_width": 60.0,
        "plot_depth": 80.0,
        "setback_front": 7.5,
        "setback_rear": 6.0,
        "setback_sides": 6.0,
        "max_far": 3.0
    }
    response = client.post("/api/design-options", json=payload)
    assert response.status_code == 200, response.text
    options = response.json()
    assert len(options) == 3
    assert options[0]["id"] == "opt_a"
    assert options[1]["id"] == "opt_b"
    assert options[2]["id"] == "opt_c"
    print(f" [PASS] Design Options: {len(options)} alternatives generated (Balanced, Daylight Priority, Sustainability Priority)")

def test_reference_library():
    response = client.get("/api/reference-library")
    assert response.status_code == 200
    data = response.json()
    assert "disclaimer" in data
    assert len(data["standards"]) >= 4
    print(" [PASS] Reference Library endpoint OK")

if __name__ == "__main__":
    print("\n--- RUNNING INFERNO BACKEND TESTS ---")
    test_inferno_massing()
    test_design_options()
    test_reference_library()
    print("--- ALL INFERNO BACKEND TESTS PASSED! ---\n")
