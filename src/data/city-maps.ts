// Per-leg static backgrounds for the CityMap component.
//
// Paths are authored in lat/lng pairs (much easier to verify by
// eye than viewBox coordinates) and projected to the CityMap's local
// 0..400 viewBox at module-load time using the same equirectangular
// projection the component uses for pin placement. Hand-traced,
// 6-15 vertices per shape, deliberately stylized — see #99.

const VIEW = 400;
const HALF = VIEW / 2;

interface ProjectionConfig {
  center: [number, number]; // [lat, lng]
  radius: number; // km
  coast?: Array<[number, number]>; // lat/lng polygon (water)
  landmark?: Array<[number, number]>; // lat/lng polygon (land feature)
}

function project(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  radiusKm: number,
): { x: number; y: number } {
  const cosLat = Math.cos((centerLat * Math.PI) / 180);
  const dx_km = (lng - centerLng) * 111 * cosLat;
  const dy_km = (lat - centerLat) * 111;
  return {
    x: HALF + dx_km * (HALF / radiusKm),
    y: HALF - dy_km * (HALF / radiusKm),
  };
}

function pathFromLatLng(
  pts: Array<[number, number]>,
  center: [number, number],
  radiusKm: number,
): string {
  return (
    pts
      .map(([lat, lng], i) => {
        const { x, y } = project(lat, lng, center[0], center[1], radiusKm);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z'
  );
}

// Each city's water polygon + optional land/landmark polygon, hand-
// traced. The Bow river through Calgary is shown as a "valley ribbon"
// because the literal river is too thin to render at the projection's
// scale; same trick for Banff's Bow Valley and Jasper's Athabasca.
const PROJ_CONFIG: Record<string, ProjectionConfig> = {
  vancouver: {
    center: [49.2827, -123.1207],
    radius: 20,
    coast: [
      [49.4, -123.4],
      [49.4, -122.85],
      [49.31, -122.85],
      [49.3, -123.0],
      [49.29, -123.08],
      [49.295, -123.115],
      [49.302, -123.143],
      [49.295, -123.155],
      [49.285, -123.16],
      [49.275, -123.155],
      [49.272, -123.16],
      [49.25, -123.22],
      [49.25, -123.4],
    ],
  },
  calgary: {
    center: [51.0447, -114.0719],
    radius: 15,
    // Bow river valley ribbon, W → E along the north bank, then back along
    // the south bank. River is ~80 m wide; the ribbon is widened for
    // visibility at this projection scale.
    coast: [
      [51.075, -114.2],
      [51.075, -114.15],
      [51.06, -114.078],
      [51.045, -113.995],
      [51.035, -113.96],
      [51.03, -113.96],
      [51.04, -113.995],
      [51.055, -114.078],
      [51.07, -114.15],
      [51.07, -114.2],
    ],
  },
  banff: {
    center: [51.1784, -115.5708],
    radius: 75,
    // Bow Valley ribbon W → E through townsite. At 75 km radius the actual
    // river is invisible; this represents the valley feature visible on
    // any topo map of the area.
    coast: [
      [51.2, -116.0],
      [51.19, -115.57],
      [51.17, -115.0],
      [51.14, -115.0],
      [51.15, -115.57],
      [51.17, -116.0],
    ],
  },
  jasper: {
    center: [52.8737, -118.0814],
    radius: 30,
    // Athabasca river ribbon flowing N → SE through Jasper townsite.
    coast: [
      [52.95, -118.12],
      [52.87, -118.1],
      [52.72, -117.67],
      [52.72, -117.63],
      [52.87, -118.06],
      [52.95, -118.08],
    ],
  },
  winnipeg: {
    center: [49.8951, -97.1384],
    radius: 12,
    // Red + Assiniboine confluence at the Forks (49.887, -97.130). Y-shape:
    // Red runs N-S through center; Assiniboine joins from the west.
    coast: [
      [49.95, -97.135],
      [49.95, -97.125],
      [49.89, -97.125],
      [49.83, -97.125],
      [49.83, -97.135],
      [49.89, -97.135],
      [49.89, -97.16],
      [49.89, -97.22],
      [49.885, -97.22],
      [49.885, -97.16],
      [49.885, -97.14],
      [49.95, -97.14],
    ],
  },
  ottawa: {
    center: [45.4215, -75.6972],
    radius: 8,
    // Ottawa river ribbon along the northern edge — separates ON from QC.
    coast: [
      [45.46, -75.78],
      [45.45, -75.7],
      [45.46, -75.62],
      [45.43, -75.62],
      [45.42, -75.7],
      [45.43, -75.78],
    ],
  },
  montreal: {
    center: [45.5017, -73.5673],
    radius: 10,
    // St. Lawrence river ribbon, southeast of downtown.
    coast: [
      [45.55, -73.6],
      [45.5, -73.54],
      [45.45, -73.5],
      [45.43, -73.5],
      [45.48, -73.54],
      [45.53, -73.6],
    ],
    // Mount Royal — small oval landmark.
    landmark: [
      [45.512, -73.595],
      [45.508, -73.583],
      [45.5, -73.582],
      [45.498, -73.59],
      [45.503, -73.598],
    ],
  },
  'quebec-city': {
    center: [46.8139, -71.208],
    radius: 25,
    // St. Lawrence river ribbon, south of the walled city.
    coast: [
      [46.85, -71.3],
      [46.81, -71.2],
      [46.85, -71.12],
      [46.71, -71.12],
      [46.77, -71.2],
      [46.79, -71.3],
    ],
    // Walled-city perimeter (Old Québec).
    landmark: [
      [46.815, -71.213],
      [46.815, -71.205],
      [46.806, -71.205],
      [46.806, -71.213],
    ],
  },
  toronto: {
    center: [43.6532, -79.3832],
    radius: 15,
    // Lake Ontario polygon south of downtown.
    coast: [
      [43.65, -79.45],
      [43.638, -79.38],
      [43.64, -79.3],
      [43.45, -79.3],
      [43.45, -79.45],
    ],
    // Toronto Islands cluster.
    landmark: [
      [43.625, -79.41],
      [43.63, -79.4],
      [43.625, -79.36],
      [43.61, -79.35],
      [43.61, -79.4],
    ],
  },
};

export interface CityBackground {
  coastPath?: string;
  landmarkPath?: string;
}

export const cityMaps: Record<string, CityBackground> = Object.fromEntries(
  Object.entries(PROJ_CONFIG).map(([slug, cfg]) => [
    slug,
    {
      coastPath: cfg.coast
        ? pathFromLatLng(cfg.coast, cfg.center, cfg.radius)
        : undefined,
      landmarkPath: cfg.landmark
        ? pathFromLatLng(cfg.landmark, cfg.center, cfg.radius)
        : undefined,
    },
  ]),
);
