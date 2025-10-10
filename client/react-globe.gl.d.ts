declare module "react-globe.gl" {
  import { Component } from "react";

  export interface GlobeProps {
    width?: number;
    height?: number;
    globeImageUrl?: string;
    backgroundColor?: string;
    arcsData?: any[];
    arcColor?: string | ((d: any) => string);
    arcDashLength?: number;
    arcDashGap?: number | ((d: any) => number);
    arcDashAnimateTime?: number;
    arcStroke?: number;
    pointSize?: number;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    showAtmosphere?: boolean;
    globeMaterial?: any;
    arcStartLat?: string | ((d: any) => number);
    arcStartLng?: string | ((d: any) => number);
    arcEndLat?: string | ((d: any) => number);
    arcEndLng?: string | ((d: any) => number);
    arcAltitude?: string | ((d: any) => number);
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    [key: string]: any;
  }

  export default class Globe extends Component<GlobeProps> {}
}
