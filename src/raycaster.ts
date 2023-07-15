import { Level, GridType, GridColours } from "./level";
import Camera from "./camera";
import Debug from "./debug";
import Player from "./player";
import Vector from "./vector";

export function mathMod(input: number, mod: number): number {
  return ( ( input % mod ) + mod ) % mod;
}

export function mathRadians(input: number): number {
  return input * ( Math.PI / 180 );
}

export const enum moveDirection {
  forward = 1,
  backward = -1
}

export const enum rotateDirection {
  left = 1,
  right = -1
}

interface Ray {
  point: Vector;
  length: number;
  intersectType: GridType;
}

export class RayCaster {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private debug: Debug;

  constructor(private player: Player, private camera: Camera, private level: Level) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.camera.width;
    this.canvas.height = this.camera.height;
    
    document.body.appendChild(this.canvas);
    
    this.context = this.canvas.getContext("2d");
    this.player.position = this.level.spawnPoint;
    
    this.debug = new Debug(level, player);
  }
  
  private distance(point: Vector, angle: number, relAngle: number) {
    return ( Math.abs(this.player.position.x - point.x) / Math.cos(angle) ) * Math.cos(relAngle);
  }
  
  private cast(angle: number, relAngle: number): Ray {
    let point = new Vector(this.player.position.x, this.player.position.y);
    let verticalQuadrant = 1;
    let horizontalQuadrant = -1;
    
    const cos = Math.cos(mathRadians(angle));
    const sin = Math.sin(mathRadians(angle));
    const step = new Vector(0, 0);
    step.x = Math.round(Math.round(Level.gridWidth / 2) * ( cos - sin )) + verticalQuadrant;
    step.y = Math.round(Math.round(Level.gridWidth / 2) * ( sin + cos )) + horizontalQuadrant;
    
    while (point.x >= 0 && point.x < ( Level.levelWidth * Level.gridWidth ) && point.y >= 0 && point.y < ( Level.levelHeight * Level.gridHeight )) {
      let gridPoint = point.gridCoord();
      
      if (this.level.grid[gridPoint.x][gridPoint.y] == GridType.wall || this.level.grid[gridPoint.x][gridPoint.y] == GridType.wall2) {
        
        this.debug.addRayHit(point);
        const Length = Math.floor(Math.sqrt((( Math.abs(point.x - this.player.position.x) ^ 2 ) + ( Math.abs(point.y - this.player.position.y) ^ 2 ))));// * Math.cos(MathRadians(RelAngle));
        //const Length = ( Math.abs(this.Player.Position.x - Point.x) / Math.cos(MathRadians(Angle)) ) * Math.cos(MathRadians(RelAngle));
        
        return { point: point, length: Length, intersectType: this.level.grid[gridPoint.x][gridPoint.y] };
      } else {
        point.x += step.x;
        point.y += step.y;
        
        this.debug.addRayPath(point);
      }
    }
  }
  
  render(): void {
    this.context.clearRect(0, 0, this.camera.width, this.camera.height);
    let angle = mathMod(this.player.viewDirection + ( this.camera.angleStep * 0 ) + ( this.camera.fov / 2 ), 360);
    let relAngle = 0 - ( this.camera.fov / 2 );
    
    for (let i = 0; i < 700; i += Level.gridStep) {
      const ray = this.cast(angle, relAngle);
      
      if (ray == null) {
        this.context.fillStyle = GridColours[GridType.empty];
        this.context.fillRect(i, 0, Level.gridStep, this.camera.height);
      }
      
      if (ray.length == 0) {
        
        this.context.fillStyle = GridColours[GridType.empty];
        this.context.fillRect(i, 0, Level.gridStep, this.camera.height);
        
        continue;
      }
      
      const fillHeight = ( ( Level.wallHeight / Level.gridHeight ) / ray.length ) * this.camera.projectionScale;
      const bgHeight = ( this.camera.height / 2 ) - ( fillHeight / 2 );
      
      if (fillHeight < this.camera.height) {
        this.context.fillStyle = GridColours[GridType.empty];
        this.context.fillRect(i, 0, Level.gridStep, bgHeight);
      }
      
      if (fillHeight > 0) {
        switch (ray.intersectType) {
          case GridType.wall:
            this.context.fillStyle = GridColours[GridType.wall];
            break;
          
          case GridType.wall2:
            this.context.fillStyle = GridColours[GridType.wall2];
            break;
          
          default:
            this.context.fillStyle = GridColours[GridType.empty];
        }
        
        this.context.fillRect(i, bgHeight, Level.gridStep, fillHeight);
      }
      
      if (fillHeight < this.camera.height) {
        this.context.fillStyle = GridColours[GridType.empty];
        this.context.fillRect(i, ( this.camera.height / 2 ) + ( fillHeight / 2 ), Level.gridStep, bgHeight);
      }
      
      angle = mathMod(angle - this.camera.angleStep, 360);
      relAngle += this.camera.angleStep;
    }
    
    this.debug.render();
  }
}