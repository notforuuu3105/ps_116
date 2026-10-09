import React, { useMemo } from 'react';
import * as THREE from 'three';

export function BuildingMesh({ massingData, hoveredFloor, setHoveredFloor, selectedFloor, setSelectedFloor }) {
  if (!massingData || !massingData.floors || massingData.floors.length === 0) {
    return null;
  }

  const { metrics, floors, site_boundary_2d, setback_boundary_2d } = massingData;
  const plotWidth = massingData.plot_width || (site_boundary_2d ? site_boundary_2d[1][0] : 60);
  const plotDepth = massingData.plot_depth || (site_boundary_2d ? site_boundary_2d[2][1] : 80);

  // Offset so center of site is at (0, 0, 0)
  const offsetX = plotWidth / 2.0;
  const offsetZ = plotDepth / 2.0;

  // Create setback shape for green buffer display
  const setbackBuffer = useMemo(() => {
    if (!setback_boundary_2d || setback_boundary_2d.length < 4) return null;
    const x0 = setback_boundary_2d[0][0] - offsetX;
    const z0 = setback_boundary_2d[0][1] - offsetZ;
    const x1 = setback_boundary_2d[1][0] - offsetX;
    const z1 = setback_boundary_2d[2][1] - offsetZ;
    return { x0, z0, w: x1 - x0, d: z1 - z0 };
  }, [setback_boundary_2d, offsetX, offsetZ]);

  return (
    <group>
      {/* 1. Surrounding Ground & Street Context */}
      <mesh receiveShadow position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[plotWidth * 2.8, plotDepth * 2.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* 2. Site Plot Plane */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[plotWidth, plotDepth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Plot Boundary Border line */}
      <lineSegments position={[0, 0.02, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(plotWidth, plotDepth)]} />
        <lineBasicMaterial color="#38bdf8" linewidth={2} />
      </lineSegments>

      {/* 3. Permeable Green Setback Area (Surrounding Footprint) */}
      {setbackBuffer && (
        <group position={[0, 0.01, 0]}>
          {/* Dashed Setback Limit Line */}
          <lineSegments position={[setbackBuffer.x0 + setbackBuffer.w / 2, 0.05, setbackBuffer.z0 + setbackBuffer.d / 2]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(setbackBuffer.w, setbackBuffer.d)]} />
            <lineBasicMaterial color="#eab308" linewidth={2} />
          </lineSegments>
        </group>
      )}

      {/* 4. Front Access Road & Pavement */}
      <mesh receiveShadow position={[0, -0.08, -offsetZ - 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[plotWidth * 2.4, 14]} />
        <meshStandardMaterial color="#18181b" roughness={0.95} />
      </mesh>
      {/* Road Center Line */}
      <mesh position={[0, 0.01, -offsetZ - 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[plotWidth * 2.2, 0.4]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* 5. Building Floors Extrusion */}
      {floors.map((floor) => {
        const isHovered = hoveredFloor === floor.floor_index;
        const isSelected = selectedFloor === floor.floor_index;

        // Position: world x, y (vertical), z
        const posX = floor.center_x - offsetX;
        const posY = floor.elevation_y + floor.floor_height / 2.0;
        const posZ = floor.center_z - offsetZ;

        // Base zone color
        let baseColor = floor.color_hex;
        let roughness = 0.35;
        let metalness = 0.2;

        if (isHovered || isSelected) {
          baseColor = '#60a5fa'; // Bright highlight blue
          roughness = 0.2;
        }

        return (
          <group key={floor.floor_index}>
            {/* Main Floor Block */}
            <mesh
              castShadow
              receiveShadow
              position={[posX, posY, posZ]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredFloor(floor.floor_index);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredFloor(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFloor(floor.floor_index === selectedFloor ? null : floor.floor_index);
              }}
            >
              <boxGeometry args={[floor.width, floor.floor_height, floor.depth]} />
              <meshStandardMaterial
                color={baseColor}
                roughness={roughness}
                metalness={metalness}
                transparent={floor.zone_type === 'AMENITY'}
                opacity={floor.zone_type === 'AMENITY' ? 0.9 : 1.0}
              />
            </mesh>

            {/* Architectural Floor Slab Edge / Spandrel Band */}
            <mesh
              castShadow
              position={[posX, floor.elevation_y + floor.floor_height - 0.1, posZ]}
            >
              <boxGeometry args={[floor.width + 0.3, 0.2, floor.depth + 0.3]} />
              <meshStandardMaterial color="#0f172a" roughness={0.6} />
            </mesh>

            {/* Subtle Glazing Frame Outlines */}
            <lineSegments position={[posX, posY, posZ]}>
              <edgesGeometry args={[new THREE.BoxGeometry(floor.width, floor.floor_height, floor.depth)]} />
              <lineBasicMaterial
                color={isHovered ? '#93c5fd' : '#1e293b'}
                linewidth={isHovered ? 2 : 1}
              />
            </lineSegments>

            {/* Amenity Deck Terrace Garden Feature */}
            {floor.zone_type === 'AMENITY' && (
              <group position={[posX, floor.elevation_y + floor.floor_height + 0.2, posZ]}>
                {/* Pergola Roof Beam */}
                <mesh position={[0, 1.2, 0]}>
                  <boxGeometry args={[floor.width * 0.7, 0.15, floor.depth * 0.7]} />
                  <meshStandardMaterial color="#065f46" roughness={0.5} />
                </mesh>
                {/* Terrace Planters / Green Canopy Box */}
                <mesh position={[0, 0.2, 0]}>
                  <boxGeometry args={[floor.width * 0.85, 0.4, floor.depth * 0.85]} />
                  <meshStandardMaterial color="#047857" roughness={0.8} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {/* 6. Rooftop Terrace Features (Top of Residential Tower) */}
      {floors.length > 0 && (() => {
        const topFloor = floors[floors.length - 1];
        const roofY = topFloor.elevation_y + topFloor.floor_height;
        const roofX = topFloor.center_x - offsetX;
        const roofZ = topFloor.center_z - offsetZ;

        return (
          <group position={[roofX, roofY, roofZ]}>
            {/* Parapet Wall */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[topFloor.width + 0.2, 1.2, topFloor.depth + 0.2]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            {/* Rooftop Solar Pergola / Lift Machine Room (LMR) */}
            <mesh position={[0, 2.0, 0]} castShadow>
              <boxGeometry args={[topFloor.width * 0.35, 2.5, topFloor.depth * 0.35]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            {/* Solar Panels Grid */}
            <mesh position={[0, 3.3, 0]} rotation={[0.1, 0, 0]}>
              <boxGeometry args={[topFloor.width * 0.45, 0.1, topFloor.depth * 0.45]} />
              <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      })()}
    </group>
  );
}
