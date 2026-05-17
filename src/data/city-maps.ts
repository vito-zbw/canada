// Per-leg static backgrounds for the CityMap component. Each `coastPath`
// is a hand-traced SVG path string in the CityMap's local viewBox coords
// (0..400 on both axes). Other legs are filled in by the coastline epic
// (#99) — a missing entry simply renders the map with a blank background.

export interface CityBackground {
  coastPath?: string;
  landmarkPath?: string;
}

export const cityMaps: Record<string, CityBackground> = {
  // Vancouver: Burrard Inlet across the north + English Bay opening
  // south-west. Land sits south-east of this polygon (downtown, Stanley
  // Park, UBC). 13 vertices, stylized — not cartographic.
  vancouver: {
    coastPath:
      'M-5,70 L405,70 L405,170 L287,181 L229,192 L204,186 L184,179 L175,186 L171,197 L175,208 L171,212 L128,236 L-5,236 Z',
  },
};
