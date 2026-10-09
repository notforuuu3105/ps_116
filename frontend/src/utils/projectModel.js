export const initialProjectState = {
  id: "proj_inferno_01",
  name: "Mixed-Use Urban Prototype (B + G + 9)",
  description: "Commercial retail podium, residential high-rise tower, and central landscaped courtyard with integrated subterranean parking and EV charging.",
  site: {
    plot_width: 60.0,
    plot_depth: 80.0,
    setback_front: 7.5,
    setback_rear: 6.0,
    setback_sides: 6.0,
    abutting_road_width: 18.0,
    orientation: "North-South"
  },
  program: {
    configuration: "B + G + 9",
    total_floors: 10, // Above ground (G + 9)
    has_basement: true,
    commercial_ratio: 30.0,
    tower_stepback: 3.0,
    courtyard_width: 16.0,
    courtyard_depth: 20.0
  },
  facade: {
    shading_intensity: 75.0,
    balcony_depth: 1.8,
    green_facade_coverage: 40.0,
    window_wall_ratio: 40.0,
    has_vertical_fins: true,
    has_horizontal_louvers: true
  },
  goals: {
    max_usable_area: true,
    better_daylight: true,
    natural_ventilation: true,
    more_green_space: true,
    ev_charging: true,
    lower_carbon: true
  }
};

export const sampleProjects = [
  {
    id: "proj_inferno_01",
    name: "Urban Mixed-Use Prototype B+G+9",
    dimensions: "60m × 80m (4,800 m²)",
    configuration: "B + G + 9",
    achieved_far: 2.82,
    target_far: 3.00,
    daylight: 84,
    ventilation: 80,
    green_area: 28,
    parking: 118,
    ev_bays: 24,
    carbon: 6840,
    capex_cr: 48.5,
    lastModified: "Today"
  },
  {
    id: "proj_inferno_02",
    name: "Transit-Oriented Courtyard Complex",
    dimensions: "70m × 90m (6,300 m²)",
    configuration: "B + G + 9",
    achieved_far: 2.65,
    target_far: 2.75,
    daylight: 88,
    ventilation: 84,
    green_area: 32,
    parking: 142,
    ev_bays: 32,
    carbon: 8120,
    capex_cr: 61.2,
    lastModified: "Yesterday"
  },
  {
    id: "proj_inferno_03",
    name: "Green Tech Urban Campus",
    dimensions: "65m × 85m (5,525 m²)",
    configuration: "B + G + 8",
    achieved_far: 2.50,
    target_far: 2.75,
    daylight: 91,
    ventilation: 86,
    green_area: 36,
    parking: 120,
    ev_bays: 30,
    carbon: 6980,
    capex_cr: 54.0,
    lastModified: "3 days ago"
  }
];
