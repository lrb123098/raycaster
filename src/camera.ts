import { mathMod, mathRadians } from "./raycaster";

export default class Camera {
  static defaultFOV: number = 60;
  
  readonly width: number;
  readonly height: number;
  readonly fov: number;
  readonly projectionScale: number;
  readonly angleStep: number;
  
  constructor(resolution: number[], fov: number = Camera.defaultFOV) {
    this.width = resolution[0];
    this.height = resolution[1];
    this.fov = fov;
    this.projectionScale = ( this.width / 2 ) / Math.tan(mathRadians(mathMod(this.fov / 2, 360)));
    this.angleStep = this.fov / this.width;
  }
}