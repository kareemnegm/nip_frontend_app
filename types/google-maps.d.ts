declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
    setCenter(latlng: LatLngLiteral): void;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
  }

  class Point {
    constructor(x: number, y: number);
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapOptions {
    center?: LatLngLiteral;
    zoom?: number;
    styles?: MapTypeStyle[];
    disableDefaultUI?: boolean;
    zoomControl?: boolean;
    zoomControlOptions?: { position?: ControlPosition };
    mapTypeControl?: boolean;
    mapTypeControlOptions?: {
      style?: MapTypeControlStyle;
      position?: ControlPosition;
      mapTypeIds?: string[];
    };
    fullscreenControl?: boolean;
    fullscreenControlOptions?: { position?: ControlPosition };
    streetViewControl?: boolean;
    clickableIcons?: boolean;
  }

  interface MarkerOptions {
    map?: Map;
    position?: LatLngLiteral;
    icon?: unknown;
    title?: string;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: Array<Record<string, string | number>>;
  }

  enum ControlPosition {
    LEFT_BOTTOM = 6,
    RIGHT_BOTTOM = 9,
  }

  enum MapTypeControlStyle {
    DEFAULT = 0,
  }

  namespace event {
    function trigger(instance: object, eventName: string): void;
  }
}

declare const google: {
  maps: typeof google.maps;
};
