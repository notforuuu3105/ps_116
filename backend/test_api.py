import sys
from fastapi.testclient import TestClient
from main import app, MassingRequest

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    print(" [PASS] GET / root endpoint OK")

def test_presets():
    response = client.get("/api/presets")
    assert response.status_code == 200
    presets = response.json()
    assert len(presets) >= 3
    preset_ids = [p["id"] for p in presets]
    assert "mumbai_dcr" in preset_ids
    assert "delhi_dda" in preset_ids
    assert "bengaluru_bbmp" in preset_ids
    print(f" [PASS] GET /api/presets OK ({len(presets)} presets returned)")

def test_generate_massing_compliant():
    payload = {
        "plot_width": 60.0,
        "plot_depth": 80.0,
        "setback_front": 8.0,
        "setback_rear": 6.0,
        "setback_sides": 6.0,
        "max_far": 4.5,
        "commercial_ratio": 30.0,
        "total_floors": 10,
        "tower_stepback": 2.0
    }
    response = client.post("/api/generate-massing", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()
    metrics = data["metrics"]
    compliance = data["compliance"]
    floors = data["floors"]

    assert metrics["plot_area"] == 4800.0
    assert metrics["buildable_footprint_area"] > 0
    assert metrics["achieved_far"] > 0
    assert len(floors) == 10
    
    # Check zones
    zones = [f["zone_type"] for f in floors]
    assert "COMMERCIAL" in zones
    assert "RESIDENTIAL" in zones
    assert "AMENITY" in zones

    # Check colors
    comm_floor = next(f for f in floors if f["zone_type"] == "COMMERCIAL")
    res_floor = next(f for f in floors if f["zone_type"] == "RESIDENTIAL")
    amenity_floor = next(f for f in floors if f["zone_type"] == "AMENITY")
    assert comm_floor["color_hex"] == "#1E40AF"
    assert res_floor["color_hex"] == "#EA580C"
    assert amenity_floor["color_hex"] == "#059669"

    # Parking calculation check
    assert metrics["total_required_parking"] > 0
    assert metrics["estimated_basement_levels"] >= 1

    print(f" [PASS] POST /api/generate-massing COMPLIANT case OK (Achieved FAR: {metrics['achieved_far']}, BUA: {metrics['total_built_up_area']} m²)")

def test_generate_massing_fire_safety_violation():
    # Building height > 15m (12 floors * 3.5m avg = ~40m) but side setback < 6m (e.g. 4.0m)
    payload = {
        "plot_width": 60.0,
        "plot_depth": 80.0,
        "setback_front": 8.0,
        "setback_rear": 6.0,
        "setback_sides": 4.0,  # Fails 6m rule for >15m
        "max_far": 5.0,
        "commercial_ratio": 30.0,
        "total_floors": 12,
        "tower_stepback": 2.0
    }
    response = client.post("/api/generate-massing", json=payload)
    assert response.status_code == 200
    data = response.json()
    compliance = data["compliance"]
    assert compliance["fire_safety_compliance"] is False
    assert compliance["is_compliant"] is False
    assert any("Fire Safety Rule Violated" in v for v in compliance["violations"])
    print(" [PASS] Fire safety setback rule (<6m for >15m building) correctly detected FAIL")

def test_generate_massing_far_violation():
    # Low max_far = 1.2 with 15 floors
    payload = {
        "plot_width": 50.0,
        "plot_depth": 50.0,
        "setback_front": 6.0,
        "setback_rear": 6.0,
        "setback_sides": 6.0,
        "max_far": 1.2,
        "commercial_ratio": 30.0,
        "total_floors": 15,
        "tower_stepback": 2.0
    }
    response = client.post("/api/generate-massing", json=payload)
    assert response.status_code == 200
    data = response.json()
    compliance = data["compliance"]
    assert compliance["far_compliance"] is False
    assert compliance["is_compliant"] is False
    assert any("exceeds Maximum Permissible FAR" in v for v in compliance["violations"])
    print(f" [PASS] Achieved FAR ({compliance['achieved_far']}) > Max FAR ({compliance['max_far']}) correctly detected FAIL")

def test_export_dxf():
    payload = {
        "plot_width": 60.0,
        "plot_depth": 80.0,
        "setback_front": 8.0,
        "setback_rear": 6.0,
        "setback_sides": 6.0,
        "max_far": 3.5,
        "commercial_ratio": 35.0,
        "total_floors": 12,
        "tower_stepback": 2.5
    }
    response = client.post("/api/export-dxf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/dxf"
    content = response.content.decode("utf-8")
    assert "SECTION" in content
    assert "HEADER" in content
    assert "SITE_BOUNDARY" in content
    assert "COMMERCIAL_PODIUM" in content
    assert "RESIDENTIAL_TOWER" in content
    assert "SIH 2026 - PROBLEM STATEMENT 116" in content
    print(f" [PASS] POST /api/export-dxf produced valid multi-layer CAD DXF ({len(response.content)} bytes)")

if __name__ == "__main__":
    print("\n--- RUNNING BACKEND TEST SUITE ---")
    test_root()
    test_presets()
    test_generate_massing_compliant()
    test_generate_massing_fire_safety_violation()
    test_generate_massing_far_violation()
    test_export_dxf()
    print("\n--- ALL BACKEND TESTS PASSED SUCCESSFULLY! ---\n")
