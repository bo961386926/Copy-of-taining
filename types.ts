
export interface MetricItem {
  value: string | number;
  unit: string;
  label: string;
}

export interface ChartData {
  name: string;
  value: number;
  altValue?: number;
}

export interface WeatherData {
  time: string;
  temp: number;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location?: string;
}
