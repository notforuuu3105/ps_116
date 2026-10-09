// Centralized Project Storage & Persistence Utility for INFERNO Studio
// Supports local storage persistence, project switching, duplication, and pre-seeded sample projects.

export const DEFAULT_B_G_9_PROJECT = {
  id: "proj_inferno_01",
  name: "Metro Corridor Mixed-Use Complex (B + G + 9)",
  type: "Mixed-Use Commercial & Residential",
  intended_use: "Retail Plaza + Co-Working Podium + Residential Tower",
  city: "Mumbai",
  state: "Maharashtra",
  address: "Plot 42, Western Expressway Transit Corridor, Andheri East",
  description: "A high-density mixed-use complex featuring subterranean EV mobility, ground-level retail plaza, commercial office podium, and residential high-rise tower wrapping around an open central landscaped courtyard.",
  site: {
    plot_width: 60.0,
    plot_depth: 80.0,
    plot_area: 4800.0,
    units: "metres",
    shape: "rectangular",
    road_facing_side: "South",
    abutting_road_width: 18.0,
    num_road_sides: 1,
    orientation: "North-South",
    setback_front: 7.5,
    setback_rear: 6.0,
    setback_sides: 6.0
  },
  program: {
    configuration: "B + G + 9",
    total_floors: 10, // Above ground: G + 9
    has_basement: true,
    ground_floor_use: "Commercial Retail Plaza & Grand Lobby",
    commercial_ratio: 30.0,
    residential_ratio: 70.0,
    tower_stepback: 3.0,
    dwelling_types: ["2BHK", "3BHK"],
    approx_dwelling_units: 96,
    parking_capacity: 118,
    ev_charging_pct: 20.0,
    courtyard_width: 16.0,
    courtyard_depth: 20.0,
    has_rooftop_pool: true,
    has_solar_pergola: true
  },
  constraints: {
    max_far: 3.0,
    max_ground_coverage_pct: 40.0,
    max_height_m: 36.0,
    planning_authority: "Mumbai DCPR 2034 (Transit Incentive)",
    is_verified: true
  },
  facade: {
    shading_intensity: 75.0,
    balcony_depth: 1.8,
    green_facade_coverage: 40.0,
    window_wall_ratio: 40.0,
    has_vertical_fins: true,
    has_horizontal_louvers: true,
    glazing_type: "dgu_lowe"
  },
  last_modified: new Date().toISOString()
};

export const SAMPLE_PROJECTS = [
  DEFAULT_B_G_9_PROJECT,
  {
    id: "proj_inferno_02",
    name: "Transit-Oriented Courtyard Enclave (B + G + 9)",
    type: "Transit-Oriented Development (TOD)",
    intended_use: "Mixed-Use High Density Residential & Civic Plaza",
    city: "New Delhi",
    state: "Delhi NCT",
    address: "Corridor Sector 18, Near Botanical Garden Interchange",
    description: "Centrally placed light atrium with passive stack cooling, integrated feeder bus drop-off, subterranean EV charging hub, and pedestrian boulevard.",
    site: {
      plot_width: 70.0,
      plot_depth: 90.0,
      plot_area: 6300.0,
      units: "metres",
      shape: "rectangular",
      road_facing_side: "South",
      abutting_road_width: 24.0,
      num_road_sides: 2,
      orientation: "North-South",
      setback_front: 9.0,
      setback_rear: 6.0,
      setback_sides: 6.0
    },
    program: {
      configuration: "B + G + 9",
      total_floors: 10,
      has_basement: true,
      ground_floor_use: "Civic Retail & Metro Connector",
      commercial_ratio: 35.0,
      residential_ratio: 65.0,
      tower_stepback: 3.5,
      dwelling_types: ["2BHK", "3BHK", "Studio"],
      approx_dwelling_units: 124,
      parking_capacity: 142,
      ev_charging_pct: 25.0,
      courtyard_width: 18.0,
      courtyard_depth: 24.0,
      has_rooftop_pool: true,
      has_solar_pergola: true
    },
    constraints: {
      max_far: 2.75,
      max_ground_coverage_pct: 38.0,
      max_height_m: 38.0,
      planning_authority: "Delhi MPD-2041 (TOD Guidelines)",
      is_verified: true
    },
    facade: {
      shading_intensity: 80.0,
      balcony_depth: 2.0,
      green_facade_coverage: 45.0,
      window_wall_ratio: 38.0,
      has_vertical_fins: true,
      has_horizontal_louvers: true,
      glazing_type: "dgu_lowe"
    },
    last_modified: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "proj_inferno_03",
    name: "Eco-Urban Tech Enclave (B + G + 8)",
    type: "Commercial Campus & Serviced Residences",
    intended_use: "Incubation Suites + Serviced Residential Apartments",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Plot 14-B, Outer Ring Road Tech Enclave, Bellandur",
    description: "Sustainable urban micro-campus with extensive vertical vegetation, bio-retention courtyard pond, 30% EV parking fleet provision, and double-glazed façade envelope.",
    site: {
      plot_width: 65.0,
      plot_depth: 85.0,
      plot_area: 5525.0,
      units: "metres",
      shape: "rectangular",
      road_facing_side: "East",
      abutting_road_width: 18.0,
      num_road_sides: 1,
      orientation: "East-West",
      setback_front: 7.5,
      setback_rear: 6.0,
      setback_sides: 6.0
    },
    program: {
      configuration: "B + G + 8",
      total_floors: 9,
      has_basement: true,
      ground_floor_use: "Tech Hub, Café & Maker Space",
      commercial_ratio: 40.0,
      residential_ratio: 60.0,
      tower_stepback: 2.5,
      dwelling_types: ["1BHK", "2BHK", "Co-Living"],
      approx_dwelling_units: 88,
      parking_capacity: 120,
      ev_charging_pct: 30.0,
      courtyard_width: 16.0,
      courtyard_depth: 20.0,
      has_rooftop_pool: false,
      has_solar_pergola: true
    },
    constraints: {
      max_far: 2.5,
      max_ground_coverage_pct: 42.0,
      max_height_m: 32.0,
      planning_authority: "Bengaluru BBMP / BDA Zonal Regulations",
      is_verified: true
    },
    facade: {
      shading_intensity: 70.0,
      balcony_depth: 1.8,
      green_facade_coverage: 50.0,
      window_wall_ratio: 35.0,
      has_vertical_fins: true,
      has_horizontal_louvers: true,
      glazing_type: "dgu_lowe"
    },
    last_modified: new Date(Date.now() - 172800000).toISOString()
  }
];

const STORAGE_KEY = 'inferno_projects_store_v2';
const ACTIVE_ID_KEY = 'inferno_active_project_id_v2';

export function getStoredProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
      return SAMPLE_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
      return SAMPLE_PROJECTS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read projects from storage:', err);
    return SAMPLE_PROJECTS;
  }
}

export function saveProject(project) {
  try {
    const projects = getStoredProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    const updatedProject = {
      ...project,
      last_modified: new Date().toISOString()
    };

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...projects];
      updatedList[existingIndex] = updatedProject;
    } else {
      updatedList = [updatedProject, ...projects];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    localStorage.setItem(ACTIVE_ID_KEY, updatedProject.id);
    return updatedProject;
  } catch (err) {
    console.error('Failed to save project:', err);
    return project;
  }
}

export function getActiveProject() {
  const projects = getStoredProjects();
  const activeId = localStorage.getItem(ACTIVE_ID_KEY);
  if (activeId) {
    const found = projects.find((p) => p.id === activeId);
    if (found) return found;
  }
  return projects[0] || DEFAULT_B_G_9_PROJECT;
}

export function setActiveProjectId(id) {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch (err) {
    console.error('Failed to set active project id:', err);
  }
}

export function deleteProject(id) {
  try {
    const projects = getStoredProjects();
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.length ? filtered : SAMPLE_PROJECTS));
    if (localStorage.getItem(ACTIVE_ID_KEY) === id) {
      localStorage.setItem(ACTIVE_ID_KEY, filtered[0]?.id || DEFAULT_B_G_9_PROJECT.id);
    }
    return filtered;
  } catch (err) {
    console.error('Failed to delete project:', err);
    return getStoredProjects();
  }
}

export function duplicateProject(id) {
  try {
    const projects = getStoredProjects();
    const source = projects.find((p) => p.id === id) || projects[0];
    const newId = `proj_inferno_${Date.now()}`;
    const cloned = {
      ...source,
      id: newId,
      name: `${source.name} (Copy)`,
      last_modified: new Date().toISOString()
    };
    const updated = [cloned, ...projects];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_ID_KEY, newId);
    return cloned;
  } catch (err) {
    console.error('Failed to duplicate project:', err);
    return null;
  }
}
