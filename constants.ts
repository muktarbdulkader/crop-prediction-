// Mock data for visualizations
export const CORRELATION_DATA = [
  { feature: 'Rainfall', N: 0.1, P: 0.2, K: 0.3, Temp: 0.4, Humid: 0.5, pH: -0.1, Yield: 0.7 },
  { feature: 'Temp', N: 0.2, P: 0.1, K: 0.1, Temp: 1.0, Humid: -0.3, pH: 0.2, Yield: 0.6 },
  { feature: 'Humid', N: 0.3, P: 0.1, K: 0.2, Temp: -0.3, Humid: 1.0, pH: 0.1, Yield: 0.4 },
  { feature: 'N', N: 1.0, P: 0.5, K: 0.6, Temp: 0.2, Humid: 0.3, pH: 0.1, Yield: 0.8 },
  { feature: 'P', N: 0.5, P: 1.0, K: 0.7, Temp: 0.1, Humid: 0.1, pH: -0.2, Yield: 0.75 },
  { feature: 'K', N: 0.6, P: 0.7, K: 1.0, Temp: 0.1, Humid: 0.2, pH: -0.1, Yield: 0.82 },
  { feature: 'pH', N: 0.1, P: -0.2, K: -0.1, Temp: 0.2, Humid: 0.1, pH: 1.0, Yield: 0.1 },
  { feature: 'Yield', N: 0.8, P: 0.75, K: 0.82, Temp: 0.6, Humid: 0.4, pH: 0.1, Yield: 1.0 },
];

export const FEATURE_IMPORTANCE_DATA = [
  { name: 'Potassium (K)', importance: 90 },
  { name: 'Nitrogen (N)', importance: 85 },
  { name: 'Phosphorus (P)', importance: 82 },
  { name: 'Rainfall', importance: 75 },
  { name: 'Temperature', importance: 60 },
  { name: 'Humidity', importance: 50 },
  { name: 'pH', importance: 30 },
];

export const SCATTER_PLOT_DATA = Array.from({ length: 50 }, () => ({
  rainfall: Math.random() * 250 + 50,
  temperature: Math.random() * 30 + 10,
  yield: Math.random() * 3000 + 1000,
}));
