declare module "three/examples/jsm/controls/OrbitControls.js" {
  import { Camera, EventDispatcher } from "three";

  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    enabled: boolean;
    target: { x: number; y: number; z: number; set(x: number, y: number, z: number): void };
    minDistance: number;
    maxDistance: number;
    maxPolarAngle: number;
    enablePan: boolean;
    update(): void;
    dispose(): void;
  }
}
