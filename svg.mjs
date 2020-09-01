const pointList = (points) => points.map((point) => point.join(',')).join(' ');

export const svg = ({ content, viewBox }) => `
  <svg
    viewBox="${viewBox}"
    transform="scale(1 -1)"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${content}
  </svg>
`;

export const circle = ([x, y], { r = 0.2, fill = 'black' } = {}) => `
  <circle
    cx="${x}"
    cy="${y}"
    r="${r}"
    fill="${fill}
  "/>
`;

export const text = ([x, y], value, { font = '3px serif', fill = 'black' } = {}) => `
    <text
      x="${x}"
      y="${y}"
      fill="${fill}"
      style="font: ${font};"
    >
      ${value}
    </text>
  `;

export const polyLine = (
  points,
  { stroke = 'black', strokeWidth = 0.2, strokeDasharray = 'none' } = {}
) => `
  <polyline
    points="${pointList(points)}"
    fill="none"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    stroke-dasharray="${strokeDasharray}"
  />
`;

export const polygon = (
  points,
  { stroke = 'black', strokeWidth = 0.5, fill = 'black', fillOpacity = 0.5 } = {}
) => `
  <polygon
    points="${pointList(points)}"
    fill="${fill}"
    fill-opacity="${fillOpacity}"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
  />
`;
