import io
import math
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from shapely.geometry import Polygon
import ezdxf

app = FastAPI(
    title="INFERNO — Intelligent Mixed-Use Urban Design Studio",
    description="Computational Geometry, Environmental Analysis & B+G+9 Mixed-Use Design Engine",
    version="3.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# PYDANTIC DATA MODELS
# ==========================================

class MassingRequest(BaseModel):
    plot_width: float = Field(default=60.0, ge=10.0, le=500.0, description="Plot width in meters (X-axis)")
    plot_depth: float = Field(default=80.0, ge=10.0, le=500.0, description="Plot depth in meters (Z/Y-axis)")
    setback_front: float = Field(default=7.5, ge=0.0, le=100.0, description="Front setback in meters")
    setback_rear: float = Field(default=6.0, ge=0.0, le=100.0, description="Rear setback in meters")
    setback_sides: float = Field(default=6.0, ge=0.0, le=100.0, description="Side setbacks in meters")
    max_far: float = Field(default=3.0, ge=0.5, le=10.0, description="Target/Permissible Floor Area Ratio")
    commercial_ratio: float = Field(default=30.0, ge=5.0, le=95.0, description="Commercial floor allocation percentage")
    total_floors: int = Field(default=10, ge=1, le=40, description="Total above-ground floors (e.g. G+9 = 10)")
    has_basement: bool = Field(default=True, description="Include B1 subterranean parking and EV level")
    tower_stepback: float = Field(default=3.0, ge=0.0, le=15.0, description="Residential tower step-back in meters from podium edge")
    abutting_road_width: float = Field(default=18.0, ge=6.0, le=60.0, description="Abutting road width in meters")
    courtyard_width: float = Field(default=16.0, ge=8.0, le=40.0, description="Central courtyard width in meters")
    courtyard_depth: float = Field(default=20.0, ge=8.0, le=50.0, description="Central courtyard depth in meters")
    facade_shading_intensity: float = Field(default=70.0, ge=10.0, le=100.0, description="Façade shading fin intensity %")
    window_wall_ratio: float = Field(default=40.0, ge=20.0, le=80.0, description="Window to wall ratio %")


class FloorLevel(BaseModel):
    floor_index: int
    floor_code: str  # "B1", "G", "L1", "L2", ..., "L9"
    floor_label: str
    zone_type: str  # "BASEMENT", "COMMERCIAL", "RESIDENTIAL", "AMENITY"
    elevation_y: float
    floor_height: float
    width: float
    depth: float
    center_x: float
    center_z: float
    area: float
    has_courtyard_opening: bool
    color_hex: str
    vertices: List[List[float]]


class DesignGuidance(BaseModel):
    is_target_met: bool
    far_check: str
    height_check: str
    setback_check: str
    coverage_check: str
    achieved_far: float
    target_far: float
    building_height: float
    permissible_height: float
    ground_coverage_ratio: float
    recommendations: List[str]
    positive_features: List[str]


class CourtyardMetrics(BaseModel):
    width: float
    depth: float
    area: float
    daylight_penetration_pct: float
    green_coverage_pct: float
    is_open_to_sky: bool
    ventilation_potential_pct: float
    stack_effect_index: float


class FacadeMetrics(BaseModel):
    shading_intensity_pct: float
    window_wall_ratio_pct: float
    solar_heat_reduction_pct: float
    daylight_factor_score: float
    glare_control_rating: str
    natural_ventilation_index: float


class MassingMetrics(BaseModel):
    plot_area: float
    buildable_footprint_area: float
    ground_coverage_pct: float
    total_built_up_area: float
    commercial_bua: float
    residential_bua: float
    amenity_bua: float
    basement_area: float
    achieved_far: float
    target_far: float
    total_building_height: float
    total_parking_spaces: int
    ev_charging_bays: int
    accessible_parking_bays: int
    daylight_score: float
    ventilation_score: float
    green_area_pct: float
    estimated_cost_inr_cr: float
    estimated_cost_per_sqft: float
    embodied_carbon_tons: float


class MassingResponse(BaseModel):
    metrics: MassingMetrics
    guidance: DesignGuidance
    courtyard: CourtyardMetrics
    facade: FacadeMetrics
    site_boundary_2d: List[List[float]]
    setback_boundary_2d: List[List[float]]
    podium_footprint_2d: List[List[float]]
    tower_footprint_2d: List[List[float]]
    courtyard_footprint_2d: List[List[float]]
    floors: List[FloorLevel]


class DesignAlternative(BaseModel):
    id: str
    title: str
    description: str
    achieved_far: float
    daylight_score: float
    green_area_pct: float
    parking_bays: int
    ev_bays: int
    carbon_tco2e: float
    capex_cr: float
    configuration: str
    request_params: MassingRequest


# ==========================================
# COMPUTATIONAL ARCHITECTURAL ENGINE
# ==========================================

def calculate_inferno_massing(req: MassingRequest) -> MassingResponse:
    W, D = req.plot_width, req.plot_depth
    site_poly = Polygon([(0.0, 0.0), (W, 0.0), (W, D), (0.0, D)])
    plot_area = float(site_poly.area)

    x_min = req.setback_sides
    x_max = W - req.setback_sides
    y_min = req.setback_front
    y_max = D - req.setback_rear

    if x_max <= x_min or y_max <= y_min:
        raise HTTPException(
            status_code=400,
            detail=f"Setbacks exceed plot dimensions! Width: {W}m (Setbacks: {req.setback_sides * 2}m), Depth: {D}m (Setbacks: {req.setback_front + req.setback_rear}m)"
        )

    podium_width = x_max - x_min
    podium_depth = y_max - y_min
    podium_center_x = (x_min + x_max) / 2.0
    podium_center_z = (y_min + y_max) / 2.0

    # Courtyard dimensions (proportional, max 40% of building depth/width)
    court_w = min(req.courtyard_width, podium_width * 0.45)
    court_d = min(req.courtyard_depth, podium_depth * 0.45)
    court_area = court_w * court_d

    # Podium gross footprint minus courtyard
    podium_gross_area = podium_width * podium_depth
    podium_net_footprint = podium_gross_area - court_area
    ground_coverage_pct = round((podium_gross_area / plot_area) * 100.0, 1)

    # Residential Tower Dimensions with Step-back
    step = min(req.tower_stepback, (podium_width - court_w - 6.0) / 2.0, (podium_depth - court_d - 6.0) / 2.0)
    step = max(0.0, step)
    tower_width = podium_width - (2.0 * step)
    tower_depth = podium_depth - (2.0 * step)
    tower_center_x = podium_center_x
    tower_center_z = podium_center_z
    tower_gross_area = tower_width * tower_depth
    tower_net_area = max(200.0, tower_gross_area - court_area)

    # Building Program: B + G + 9
    # Total above ground floors N = req.total_floors (typically 10: G + 9)
    N = req.total_floors
    floors: List[FloorLevel] = []

    comm_bua = 0.0
    res_bua = 0.0
    amenity_bua = 0.0
    current_elevation = 0.0

    # 1. Basement (B1)
    if req.has_basement:
        b_height = 3.6
        b_area = podium_gross_area * 1.05  # slightly larger basement footprint
        floors.append(
            FloorLevel(
                floor_index=-1,
                floor_code="B1",
                floor_label="Basement B1 — Parking & EV Hub",
                zone_type="BASEMENT",
                elevation_y=-b_height,
                floor_height=b_height,
                width=round(podium_width * 1.05, 1),
                depth=round(podium_depth * 1.05, 1),
                center_x=round(podium_center_x, 1),
                center_z=round(podium_center_z, 1),
                area=round(b_area, 1),
                has_courtyard_opening=False,
                color_hex="#475569",
                vertices=[
                    [podium_center_x - podium_width*0.52, -b_height, podium_center_z - podium_depth*0.52],
                    [podium_center_x + podium_width*0.52, -b_height, podium_center_z - podium_depth*0.52],
                    [podium_center_x + podium_width*0.52, -b_height, podium_center_z + podium_depth*0.52],
                    [podium_center_x - podium_width*0.52, -b_height, podium_center_z + podium_depth*0.52]
                ]
            )
        )

    # 2. Above-ground floors: G + 9
    # Typically:
    # G (idx 0): Ground floor Commercial retail, atrium & courtyard
    # L1, L2 (idx 1, 2): Commercial / shared co-working podium
    # L3-L8 (idx 3-8): Residential Tower
    # L9 (idx 9): Sky Amenities Deck & Terrace
    num_comm_floors = max(1, min(3, round(N * (req.commercial_ratio / 100.0))))
    amenity_idx = N - 1 if N >= 4 else -1

    for idx in range(N):
        if idx == 0:
            # Ground Floor (G)
            f_code = "G"
            f_label = "Ground Floor (G) — Commercial Plaza & Courtyard"
            f_zone = "COMMERCIAL"
            f_height = 4.5
            f_w = podium_width
            f_d = podium_depth
            f_area = podium_net_footprint
            comm_bua += f_area
            f_color = "#1E3A8A"  # Deep architectural indigo/blue
            has_court = True
        elif idx < num_comm_floors:
            # Commercial Podium (L1, L2)
            f_code = f"L{idx}"
            f_label = f"Level {idx} — Commercial / Co-Working Podium"
            f_zone = "COMMERCIAL"
            f_height = 4.0
            f_w = podium_width
            f_d = podium_depth
            f_area = podium_net_footprint
            comm_bua += f_area
            f_color = "#2563EB"  # Bright Royal Blue
            has_court = True
        elif idx == amenity_idx:
            # Sky Amenities Deck (L9 / Rooftop)
            f_code = f"L{idx}"
            f_label = f"Level {idx} — Sky Amenities Deck & Green Roof"
            f_zone = "AMENITY"
            f_height = 3.8
            f_w = tower_width
            f_d = tower_depth
            f_area = tower_net_area * 0.85
            amenity_bua += f_area
            f_color = "#059669"  # Emerald Green
            has_court = True
        else:
            # Residential Tower (L3 to L8)
            f_code = f"L{idx}"
            f_label = f"Level {idx} — Residential 2BHK/3BHK Tower"
            f_zone = "RESIDENTIAL"
            f_height = 3.2
            f_w = tower_width
            f_d = tower_depth
            f_area = tower_net_area
            res_bua += f_area
            f_color = "#D97706"  # Warm architectural amber/terracotta
            has_court = True

        half_w = f_w / 2.0
        half_d = f_d / 2.0
        floor_vertices = [
            [round(podium_center_x - half_w, 1), round(current_elevation, 1), round(podium_center_z - half_d, 1)],
            [round(podium_center_x + half_w, 1), round(current_elevation, 1), round(podium_center_z - half_d, 1)],
            [round(podium_center_x + half_w, 1), round(current_elevation, 1), round(podium_center_z + half_d, 1)],
            [round(podium_center_x - half_w, 1), round(current_elevation, 1), round(podium_center_z + half_d, 1)]
        ]

        floors.append(
            FloorLevel(
                floor_index=idx,
                floor_code=f_code,
                floor_label=f_label,
                zone_type=f_zone,
                elevation_y=round(current_elevation, 1),
                floor_height=round(f_height, 1),
                width=round(f_w, 1),
                depth=round(f_d, 1),
                center_x=round(podium_center_x, 1),
                center_z=round(podium_center_z, 1),
                area=round(f_area, 1),
                has_courtyard_opening=has_court,
                color_hex=f_color,
                vertices=floor_vertices
            )
        )
        current_elevation += f_height

    total_building_height = round(current_elevation, 1)
    total_bua = round(comm_bua + res_bua + amenity_bua, 1)
    achieved_far = round(total_bua / plot_area, 2)

    # Derived Parking & EV Calculations
    # Standard mixed-use standard: 1 bay per 100m² Commercial + 1 bay per 85m² Residential
    comm_parking = math.ceil(comm_bua / 100.0)
    res_parking = math.ceil(res_bua / 85.0)
    total_parking_spaces = max(40, comm_parking + res_parking)
    ev_charging_bays = max(8, round(total_parking_spaces * 0.20))  # 20% dedicated EV bays
    accessible_parking_bays = max(4, round(total_parking_spaces * 0.05))  # 5% accessible bays

    # Courtyard Performance Analytics (Indicative / Conceptual)
    # Courtyard aspect ratio and depth-to-height ratio influence daylight penetration
    court_aspect = court_d / max(1.0, court_w)
    height_to_court_ratio = total_building_height / max(10.0, min(court_w, court_d))
    daylight_penetration = round(min(95.0, max(55.0, 92.0 - (height_to_court_ratio * 7.5) + (court_w * 0.4))), 1)
    green_coverage = round(min(60.0, max(20.0, (court_area / max(1.0, podium_gross_area)) * 120.0)), 1)
    ventilation_potential = round(min(96.0, max(50.0, 85.0 - (height_to_court_ratio * 4.0) + (req.setback_front * 0.8))), 1)
    stack_effect_index = round(min(1.0, max(0.4, 0.5 + (total_building_height / 100.0))), 2)

    courtyard_metrics = CourtyardMetrics(
        width=round(court_w, 1),
        depth=round(court_d, 1),
        area=round(court_area, 1),
        daylight_penetration_pct=daylight_penetration,
        green_coverage_pct=green_coverage,
        is_open_to_sky=True,
        ventilation_potential_pct=ventilation_potential,
        stack_effect_index=stack_effect_index
    )

    # Façade Performance Analytics (Indicative / Conceptual)
    shading_factor = req.facade_shading_intensity / 100.0
    wwr_factor = req.window_wall_ratio / 100.0
    solar_heat_reduction = round(min(52.0, max(15.0, (shading_factor * 35.0) + ((1.0 - wwr_factor) * 20.0))), 1)
    daylight_factor = round(min(95.0, max(60.0, (wwr_factor * 110.0) - (shading_factor * 15.0))), 1)
    glare_rating = "Low (Optimal Visual Comfort)" if shading_factor >= 0.6 else "Moderate (Diffused Glare Control Recommended)"
    nat_vent_idx = round(min(95.0, max(55.0, 72.0 + (req.facade_shading_intensity * 0.15))), 1)

    facade_metrics = FacadeMetrics(
        shading_intensity_pct=req.facade_shading_intensity,
        window_wall_ratio_pct=req.window_wall_ratio,
        solar_heat_reduction_pct=solar_heat_reduction,
        daylight_factor_score=daylight_factor,
        glare_control_rating=glare_rating,
        natural_ventilation_index=nat_vent_idx
    )

    # Environmental & Sustainability Analytics
    overall_daylight = round((daylight_penetration * 0.45) + (daylight_factor * 0.55), 1)
    overall_ventilation = round((ventilation_potential * 0.5) + (nat_vent_idx * 0.5), 1)
    green_area_pct = round(min(45.0, max(15.0, ((plot_area - podium_gross_area + court_area + amenity_bua*0.3) / plot_area) * 100.0)), 1)

    # Cost & Carbon (Indicative Conceptual Estimates)
    # ₹38,000/m² Commercial, ₹32,000/m² Residential, ₹36,000/m² Amenities, ₹22,000/m² Basement
    cost_comm = comm_bua * 38000.0
    cost_res = res_bua * 32000.0
    cost_amenity = amenity_bua * 36000.0
    cost_base = (podium_gross_area * 1.05 * 22000.0) if req.has_basement else 0.0
    total_cost_inr = cost_comm + cost_res + cost_amenity + cost_base
    cost_cr = round(total_cost_inr / 10000000.0, 2)
    sqft_bua = (total_bua + (podium_gross_area * 1.05 if req.has_basement else 0.0)) * 10.7639
    cost_per_sqft = round(total_cost_inr / max(1.0, sqft_bua), 0)
    carbon_tons = round((total_bua * 490.0) / 1000.0, 1)

    # Design Guidance & Constructive Feedback (Instead of harsh FAIL)
    permissible_height = round(1.5 * (req.abutting_road_width + req.setback_front), 1)
    recommendations = []
    positive_features = [
        f"Central courtyard ({court_w:.0f}m × {court_d:.0f}m) delivers ~{daylight_penetration:.0f}% natural daylight into internal floor plates.",
        f"Design integrates {ev_charging_bays} dedicated EV charging bays ({round((ev_charging_bays/total_parking_spaces)*100)}% of total parking capacity).",
        f"Climate-responsive façade strategy reduces estimated solar heat gain by {solar_heat_reduction:.0f}%."
    ]

    is_far_ok = achieved_far <= (req.max_far + 0.05)
    far_check = f"Achieved FAR {achieved_far:.2f} is within target cap ({req.max_far:.2f})" if is_far_ok else f"Achieved FAR ({achieved_far:.2f}) exceeds target cap ({req.max_far:.2f})"
    if not is_far_ok:
        overrun = round(achieved_far - req.max_far, 2)
        recommendations.append(f"FAR exceeds target by {overrun}: Consider increasing the courtyard cutout or reducing upper residential floor plates by ~{int((overrun/achieved_far)*100)}%.")

    is_height_ok = total_building_height <= (permissible_height + 1.0)
    height_check = f"Building height {total_building_height:.1f}m complies with road clearance ({permissible_height:.1f}m)" if is_height_ok else f"Building height ({total_building_height:.1f}m) exceeds recommended road clearance ({permissible_height:.1f}m)"
    if not is_height_ok:
        recommendations.append(f"Height clearance: Set back the upper residential tower further from the street front to enhance solar angle clearance.")

    is_fire_ok = True
    if total_building_height > 15.0:
        if req.setback_front < 6.0 or req.setback_rear < 6.0 or req.setback_sides < 6.0:
            is_fire_ok = False
            recommendations.append("Fire tender access: Maintain minimum 6.0m clear buffer on all sides for structures above 15m.")

    setback_check = "Setbacks provide generous emergency and light access" if is_fire_ok else "Setbacks are tight for fire tender access (recommend ≥ 6.0m)"

    is_coverage_ok = ground_coverage_pct <= 60.0
    coverage_check = f"Ground coverage {ground_coverage_pct:.1f}% is well-balanced" if is_coverage_ok else f"Ground coverage {ground_coverage_pct:.1f}% exceeds 60% recommended cap"
    if not is_coverage_ok:
        recommendations.append("Increase side or rear setbacks to expand permeable landscaped open space around the building plinth.")

    is_target_met = is_far_ok and is_height_ok and is_fire_ok and is_coverage_ok

    guidance = DesignGuidance(
        is_target_met=is_target_met,
        far_check=far_check,
        height_check=height_check,
        setback_check=setback_check,
        coverage_check=coverage_check,
        achieved_far=achieved_far,
        target_far=req.max_far,
        building_height=total_building_height,
        permissible_height=permissible_height,
        ground_coverage_ratio=ground_coverage_pct,
        recommendations=recommendations,
        positive_features=positive_features
    )

    metrics = MassingMetrics(
        plot_area=round(plot_area, 1),
        buildable_footprint_area=round(podium_net_footprint, 1),
        ground_coverage_pct=ground_coverage_pct,
        total_built_up_area=total_bua,
        commercial_bua=round(comm_bua, 1),
        residential_bua=round(res_bua, 1),
        amenity_bua=round(amenity_bua, 1),
        basement_area=round(podium_gross_area * 1.05, 1) if req.has_basement else 0.0,
        achieved_far=achieved_far,
        target_far=req.max_far,
        total_building_height=total_building_height,
        total_parking_spaces=total_parking_spaces,
        ev_charging_bays=ev_charging_bays,
        accessible_parking_bays=accessible_parking_bays,
        daylight_score=overall_daylight,
        ventilation_score=overall_ventilation,
        green_area_pct=green_area_pct,
        estimated_cost_inr_cr=cost_cr,
        estimated_cost_per_sqft=cost_per_sqft,
        embodied_carbon_tons=carbon_tons
    )

    # 2D Geometry Coordinates
    site_2d = [[0.0, 0.0], [W, 0.0], [W, D], [0.0, D]]
    setback_2d = [[x_min, y_min], [x_max, y_min], [x_max, y_max], [x_min, y_max]]
    podium_2d = [[x_min, y_min], [x_max, y_min], [x_max, y_max], [x_min, y_max]]

    half_tw = tower_width / 2.0
    half_td = tower_depth / 2.0
    tower_2d = [
        [round(tower_center_x - half_tw, 1), round(tower_center_z - half_td, 1)],
        [round(tower_center_x + half_tw, 1), round(tower_center_z - half_td, 1)],
        [round(tower_center_x + half_tw, 1), round(tower_center_z + half_td, 1)],
        [round(tower_center_x - half_tw, 1), round(tower_center_z + half_td, 1)]
    ]

    half_cw = court_w / 2.0
    half_cd = court_d / 2.0
    courtyard_2d = [
        [round(podium_center_x - half_cw, 1), round(podium_center_z - half_cd, 1)],
        [round(podium_center_x + half_cw, 1), round(podium_center_z - half_cd, 1)],
        [round(podium_center_x + half_cw, 1), round(podium_center_z + half_cd, 1)],
        [round(podium_center_x - half_cw, 1), round(podium_center_z + half_cd, 1)]
    ]

    return MassingResponse(
        metrics=metrics,
        guidance=guidance,
        courtyard=courtyard_metrics,
        facade=facade_metrics,
        site_boundary_2d=site_2d,
        setback_boundary_2d=setback_2d,
        podium_footprint_2d=podium_2d,
        tower_footprint_2d=tower_2d,
        courtyard_footprint_2d=courtyard_2d,
        floors=floors
    )


# ==========================================
# DESIGN OPTIMIZER (Multi-Criteria Alternatives)
# ==========================================

def generate_design_alternatives(req: MassingRequest) -> List[DesignAlternative]:
    # Option A: Balanced Design (Equitable mix of usable area, courtyard daylight and parking)
    optA_req = req.model_copy(deep=True)
    optA_req.total_floors = 10  # B + G + 9
    optA_req.courtyard_width = 16.0
    optA_req.courtyard_depth = 20.0
    optA_req.tower_stepback = 3.0
    resA = calculate_inferno_massing(optA_req)

    # Option B: Daylight & Courtyard Priority (Larger central courtyard cutout, deeper stepbacks)
    optB_req = req.model_copy(deep=True)
    optB_req.total_floors = 10
    optB_req.courtyard_width = 22.0
    optB_req.courtyard_depth = 24.0
    optB_req.tower_stepback = 4.5
    optB_req.facade_shading_intensity = 85.0
    resB = calculate_inferno_massing(optB_req)

    # Option C: Sustainability & Carbon Priority (Optimized thermal mass, max green coverage)
    optC_req = req.model_copy(deep=True)
    optC_req.total_floors = 9
    optC_req.courtyard_width = 20.0
    optC_req.courtyard_depth = 22.0
    optC_req.tower_stepback = 3.5
    optC_req.facade_shading_intensity = 80.0
    optC_req.window_wall_ratio = 35.0
    resC = calculate_inferno_massing(optC_req)

    return [
        DesignAlternative(
            id="opt_a",
            title="Option A — Balanced Mixed-Use Design",
            description="Optimal balance between floor plate efficiency, commercial viability, and residential comfort.",
            achieved_far=resA.metrics.achieved_far,
            daylight_score=resA.metrics.daylight_score,
            green_area_pct=resA.metrics.green_area_pct,
            parking_bays=resA.metrics.total_parking_spaces,
            ev_bays=resA.metrics.ev_charging_bays,
            carbon_tco2e=resA.metrics.embodied_carbon_tons,
            capex_cr=resA.metrics.estimated_cost_inr_cr,
            configuration="B + G + 9 (Courtyard 16m × 20m)",
            request_params=optA_req
        ),
        DesignAlternative(
            id="opt_b",
            title="Option B — Daylight & Courtyard Priority",
            description="Expanded central courtyard bringing ~89% natural light deep into residential corridors and podium atrium.",
            achieved_far=resB.metrics.achieved_far,
            daylight_score=resB.metrics.daylight_score,
            green_area_pct=resB.metrics.green_area_pct,
            parking_bays=resB.metrics.total_parking_spaces,
            ev_bays=resB.metrics.ev_charging_bays,
            carbon_tco2e=resB.metrics.embodied_carbon_tons,
            capex_cr=resB.metrics.estimated_cost_inr_cr,
            configuration="B + G + 9 (Courtyard 22m × 24m)",
            request_params=optB_req
        ),
        DesignAlternative(
            id="opt_c",
            title="Option C — Sustainability & Low-Carbon Priority",
            description="High thermal efficiency with 35% WWR, 80% solar shading, and reduced embodied carbon footprint.",
            achieved_far=resC.metrics.achieved_far,
            daylight_score=resC.metrics.daylight_score,
            green_area_pct=resC.metrics.green_area_pct,
            parking_bays=resC.metrics.total_parking_spaces,
            ev_bays=resC.metrics.ev_charging_bays,
            carbon_tco2e=resC.metrics.embodied_carbon_tons,
            capex_cr=resC.metrics.estimated_cost_inr_cr,
            configuration="B + G + 8 (Low-Carbon Courtyard)",
            request_params=optC_req
        )
    ]


# ==========================================
# API ENDPOINTS
# ==========================================

@app.get("/")
def read_root():
    return {
        "status": "online",
        "studio": "INFERNO — Intelligent Mixed-Use Urban Design Studio",
        "tagline": "Design smarter. Analyze faster. Build better.",
        "configuration": "B + G + 9 Mixed-Use Prototype",
        "endpoints": ["/api/generate-massing", "/api/design-options", "/api/export-dxf", "/api/reference-library"]
    }


@app.post("/api/generate-massing", response_model=MassingResponse)
def generate_massing(request: MassingRequest):
    return calculate_inferno_massing(request)


@app.post("/api/design-options", response_model=List[DesignAlternative])
def get_design_options(request: MassingRequest):
    return generate_design_alternatives(request)


@app.get("/api/design-options")
def get_default_design_options():
    default_req = MassingRequest()
    return generate_design_alternatives(default_req)


@app.get("/api/reference-library")
def get_reference_library():
    return {
        "disclaimer": "Reference information is intended for conceptual design support and does not constitute statutory approval or legal advice. Final compliance must be verified against applicable regulations by qualified professionals.",
        "standards": [
            {
                "id": "nbc_2016",
                "title": "National Building Code (NBC 2016) — Reference",
                "scope": "All-India Baseline Standard for Architectural Design & Life Safety",
                "guidelines": [
                    {"topic": "Fire Access", "detail": "Minimum 6.0m clear motorable accessway recommended around structures exceeding 15m height."},
                    {"topic": "Height to Road Ratio", "detail": "Max permissible building height typically calculated as 1.5 × (Abutting Road Width + Front Setback)."},
                    {"topic": "Courtyard Light & Air", "detail": "Interior light courts should have a minimum width not less than 1/5th of the building height."}
                ]
            },
            {
                "id": "mumbai_dcr",
                "title": "Mumbai DCR (MCGM 2034) — Reference",
                "scope": "High-Density Transit Oriented Urban Context",
                "guidelines": [
                    {"topic": "Base & Incentive FSI", "detail": "Base FSI with permissible TDR and incentive FSI up to 3.00 for mixed transit corridors."},
                    {"topic": "Permeable Layout", "detail": "Minimum 20-25% open ground layout recommended for stormwater permeability."},
                    {"topic": "Parking Norms", "detail": "1 car parking bay per 100 sq.m commercial BUA and 1 bay per 75-85 sq.m residential."}
                ]
            },
            {
                "id": "delhi_planning",
                "title": "Delhi Planning Standards (MPD-2041) — Reference",
                "scope": "National Capital Mixed-Use Guidelines",
                "guidelines": [
                    {"topic": "Corridor FAR", "detail": "Mixed-use FAR generally planned between 2.0 to 2.50 to manage infrastructural capacity."},
                    {"topic": "Front Buffer", "detail": "Mandatory 9.0m front setback on arterial roads with right-of-way >= 24m."}
                ]
            },
            {
                "id": "bengaluru_standards",
                "title": "Bengaluru Building Standards (BBMP) — Reference",
                "scope": "IT Corridor & Urban Mixed-Use Standards",
                "guidelines": [
                    {"topic": "Ground Coverage", "detail": "Maximum ground coverage capped at 50-55% for plots above 4,000 sq.m."},
                    {"topic": "Rainwater Harvesting", "detail": "Mandatory rainwater storage and decentralized recharge pits for high-density complexes."}
                ]
            }
        ]
    }


@app.post("/api/export-dxf")
def export_dxf(request: MassingRequest):
    try:
        data = calculate_inferno_massing(request)
        doc = ezdxf.new("R2010")
        msp = doc.modelspace()

        layers = [
            ("SITE_BOUNDARY", 4),
            ("SETBACK_LIMITS", 2),
            ("PODIUM_FOOTPRINT", 5),
            ("TOWER_FOOTPRINT", 30),
            ("CENTRAL_COURTYARD", 3),
            ("ANNOTATIONS", 7),
            ("DIMENSIONS", 8),
        ]
        for name, color in layers:
            layer = doc.layers.new(name)
            layer.color = color

        sb = data.site_boundary_2d
        msp.add_lwpolyline(sb + [sb[0]], dxfattribs={"layer": "SITE_BOUNDARY", "lineweight": 50})

        stb = data.setback_boundary_2d
        msp.add_lwpolyline(stb + [stb[0]], dxfattribs={"layer": "SETBACK_LIMITS", "lineweight": 25})

        pf = data.podium_footprint_2d
        msp.add_lwpolyline(pf + [pf[0]], dxfattribs={"layer": "PODIUM_FOOTPRINT", "lineweight": 70})

        tf = data.tower_footprint_2d
        msp.add_lwpolyline(tf + [tf[0]], dxfattribs={"layer": "TOWER_FOOTPRINT", "lineweight": 70})

        cf = data.courtyard_footprint_2d
        msp.add_lwpolyline(cf + [cf[0]], dxfattribs={"layer": "CENTRAL_COURTYARD", "lineweight": 40})

        text_x = request.plot_width + 10.0
        text_y = request.plot_depth
        line_spacing = 3.2

        info_lines = [
            "INFERNO — INTELLIGENT MIXED-USE URBAN DESIGN STUDIO",
            "TEAM INFERNO | SIH 2026 PROBLEM STATEMENT 116",
            "--------------------------------------------------",
            f"Plot Size: {request.plot_width:.1f}m x {request.plot_depth:.1f}m ({data.metrics.plot_area:.1f} sq.m)",
            f"Configuration: B + G + 9 ({len(data.floors)} Total Levels)",
            f"Central Courtyard: {data.courtyard.width:.1f}m x {data.courtyard.depth:.1f}m ({data.courtyard.area:.1f} sq.m)",
            f"Achieved FAR: {data.metrics.achieved_far:.2f} (Target: {request.max_far:.2f})",
            f"Total Built-Up Area: {data.metrics.total_built_up_area:.1f} sq.m",
            f" - Commercial Podium: {data.metrics.commercial_bua:.1f} sq.m",
            f" - Residential Tower: {data.metrics.residential_bua:.1f} sq.m",
            f" - Sky Amenities: {data.metrics.amenity_bua:.1f} sq.m",
            f"Ground Coverage: {data.metrics.ground_coverage_pct:.1f}%",
            f"Parking Provisions: {data.metrics.total_parking_spaces} Bays (Incl. {data.metrics.ev_charging_bays} EV Spaces)",
            f"Daylight Performance Score: {data.metrics.daylight_score:.1f}/100",
            f"Estimated Carbon: {data.metrics.embodied_carbon_tons:.1f} tCO2e",
            f"Estimated CAPEX: Rs. {data.metrics.estimated_cost_inr_cr:.2f} Crores",
            "--------------------------------------------------",
            "Contact: arpitmishra1966@gmail.com",
            "Independent student innovation prototype for SIH 2026."
        ]

        for i, line in enumerate(info_lines):
            msp.add_text(
                line,
                dxfattribs={
                    "layer": "ANNOTATIONS",
                    "height": 2.0 if i < 2 else 1.4,
                    "insert": (text_x, text_y - (i * line_spacing))
                }
            )

        # North Arrow
        north_x = -15.0
        north_y = request.plot_depth - 10.0
        msp.add_lwpolyline(
            [(north_x, north_y), (north_x - 3.0, north_y - 8.0), (north_x, north_y - 6.0), (north_x + 3.0, north_y - 8.0), (north_x, north_y)],
            dxfattribs={"layer": "ANNOTATIONS", "lineweight": 40}
        )
        msp.add_text("N", dxfattribs={"layer": "ANNOTATIONS", "height": 3.0, "insert": (north_x - 1.0, north_y + 1.5)})

        stream = io.StringIO()
        doc.write(stream)
        dxf_content = stream.getvalue().encode("utf-8")

        return Response(
            content=dxf_content,
            media_type="application/dxf",
            headers={
                "Content-Disposition": "attachment; filename=INFERNO_Mixed_Use_Design.dxf"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
