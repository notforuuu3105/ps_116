import React, { useMemo } from 'react';
import * as THREE from 'three';

export function SunLighting({ sunTime, plotWidth = 60, plotDepth = 80 }) {
  // sunTime is in decimal hours (e.g. 6.0 to 18.0)
  const { sunPosition, sunColor, sunIntensity, ambientIntensity, ambientColor } = useMemo(() => {
    const clampedTime = Math.min(18.0, Math.max(6.0, sunTime));
    const progress = (clampedTime - 6.0) / 12.0; // 0 to 1

    // Solar Elevation (0 deg at 6am/6pm, up to 72 deg at noon)
    const elevationRad = Math.sin(progress * Math.PI) * (72 * Math.PI / 180);
    // Azimuth angle (East at 6am -> South at noon -> West at 6pm)
    const azimuthRad = Math.PI * (1.0 - progress);

    const radius = Math.max(plotWidth, plotDepth) * 2.2;
    const x = radius * Math.cos(azimuthRad) * Math.cos(elevationRad);
    const y = Math.max(15, radius * Math.sin(elevationRad));
    const z = radius * Math.sin(azimuthRad) * Math.cos(elevationRad);

    // Color temperature transitions: sunrise/sunset warm amber -> noon crisp daylight
    let color = '#fffbeb'; // noon warm white
    let intensity = 2.4 * Math.sin(progress * Math.PI) + 0.4;
    let ambColor = '#334155';
    let ambIntensity = 0.8;

    if (progress < 0.25 || progress > 0.75) {
      // Golden hour dawn / dusk
      color = '#f97316'; // orange golden
      ambColor = '#1e1b4b'; // twilight blue
      ambIntensity = 0.5;
    } else if (progress < 0.4 || progress > 0.6) {
      color = '#fde047'; // warm yellow
      ambColor = '#1e293b';
      ambIntensity = 0.7;
    }

    return {
      sunPosition: [x, y, z],
      sunColor: color,
      sunIntensity: intensity,
      ambientIntensity: ambIntensity,
      ambientColor: ambColor
    };
  }, [sunTime, plotWidth, plotDepth]);

  return (
    <group>
      <ambientLight color={ambientColor} intensity={ambientIntensity} />
      <directionalLight
        castShadow
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={Math.max(plotWidth, plotDepth) * 5}
        shadow-camera-left={-plotWidth * 1.5}
        shadow-camera-right={plotWidth * 1.5}
        shadow-camera-top={plotDepth * 1.5}
        shadow-camera-bottom={-plotDepth * 1.5}
        shadow-bias={-0.0003}
      />
      {/* Secondary fill light for soft architectural GI bounces */}
      <directionalLight
        position={[-sunPosition[0] * 0.5, 20, -sunPosition[2] * 0.5]}
        intensity={0.4}
        color="#94a3b8"
      />
    </group>
  );
}
