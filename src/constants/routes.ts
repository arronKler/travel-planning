export interface Weather {
  target_date: string
  temperature: number
  max_temp: number
  min_temp: number
  windSpeed: number
  windDirection: string
  span_weather: any
}

export interface RouteEdge {
  tolls: number
  distance: number
  time: number

  time_str: string
  distance_str: string
  tolls_str: string
}

export interface RouteNode {
  lng: number
  lat: number
  keyword: string
  city: string
  edge?: RouteEdge

  weather?: Weather

  foods?: any

  hotel?: any
}
