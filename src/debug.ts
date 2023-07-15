import { mathMod, mathRadians } from "./raycaster";
import { Level, GridType, GridColours } from "./level";
import Camera from "./camera";
import Player from "./player";
import Vector from "./vector";

export default class Debug {
  static gridScale = 4.1;//7.22;
  
  private logElement: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private grid: number[][];
  private rayGrid: number[][];
  private rayPoints: Vector[];
  
  constructor(debugLevel: Level, private debugPlayer: Player) {
    this.logElement = document.createElement("div");
    document.body.appendChild(this.logElement);
    
    this.canvas = document.createElement("canvas");
    this.canvas.width = ( Level.gridWidth * Level.levelWidth ) / Debug.gridScale;
    this.canvas.height = ( Level.gridHeight * Level.levelHeight ) / Debug.gridScale;
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
    
    this.grid = [];
    this.rayGrid = [];
    this.rayPoints = [];
    
    for (let i = 0; i < Level.levelWidth; i++) {
      this.grid[i] = [];
      this.rayGrid[i] = [];
      
      for (let j = 0; j < Level.levelHeight; j++) {
        this.grid[i][j] = debugLevel.grid[i][j];
      }
    }
  }

  log(text: any): void {
    this.logElement.innerHTML += `${text.toString()}<br>`;
  }
  
  addRayPath(point: Vector): void {
    point = point.gridCoord();
    
    if (point.x >= 0 && point.x < Level.levelWidth && point.y >= 0 && point.y < Level.levelHeight)
      this.rayGrid[point.x][point.y] = GridType.debug_RayPath;
  }
  
  addRayHit(point: Vector): void {
    point = point.gridCoord();
    
    if (point.x >= 0 && point.x < Level.levelWidth && point.y >= 0 && point.y < Level.levelHeight)
      this.rayGrid[point.x][point.y] = GridType.debug_RayHit;
  }
  
  addRayPoint(Point: Vector): void {
    if (Point.x >= 0 && Point.x < ( Level.levelWidth * Level.gridWidth ) && Point.y >= 0 && Point.y < ( Level.levelHeight * Level.gridHeight ))
      this.rayPoints.push(new Vector(Point.x, Point.y));
  }
  
  render(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < Level.levelWidth; i++) {
      for (let j = 0; j < Level.levelHeight; j++) {
        if (this.grid[i][j] == GridType.debug_SpawnPoint)
          this.context.fillStyle = GridColours[GridType.debug_SpawnPoint];
        
        else if (this.rayGrid[i][j] == GridType.debug_RayPath)
          this.context.fillStyle = GridColours[GridType.debug_RayPath];
        
        else if (this.rayGrid[i][j] == GridType.debug_RayHit)
          this.context.fillStyle = GridColours[GridType.debug_RayHit];
        
        else if (this.grid[i][j] == GridType.wall)
          this.context.fillStyle = GridColours[GridType.wall];
        
        else if (this.grid[i][j] == GridType.wall2)
          this.context.fillStyle = GridColours[GridType.wall2];
        
        else
          this.context.fillStyle = GridColours[GridType.empty];
        
        this.context.fillRect(i * Level.gridWidth / Debug.gridScale, j * Level.gridHeight / Debug.gridScale, Level.gridWidth / Debug.gridScale - 1, Level.gridHeight / Debug.gridScale - 1);
      }
    }
    
    for (let v of this.rayPoints) {
      this.context.fillStyle = "rgba(10, 10, 10, 1.0)";
      this.context.fillRect(v.x / Debug.gridScale, v.y / Debug.gridScale, 8 / Debug.gridScale, 8 / Debug.gridScale);
    }
    
    const angle1 = mathRadians(this.debugPlayer.viewDirection);
    const angle2 = mathRadians(mathMod(this.debugPlayer.viewDirection + ( Camera.defaultFOV / 2 ), 360));
    const angle3 = mathRadians(mathMod(this.debugPlayer.viewDirection - ( Camera.defaultFOV / 2 ), 360));
    const cos1 = Math.cos(angle1);
    const sin1 = Math.sin(angle1);
    const cos2 = Math.cos(angle2);
    const sin2 = Math.sin(angle2);
    const cos3 = Math.cos(angle3);
    const sin3 = Math.sin(angle3);
    const playerPos = new Vector(this.debugPlayer.position.x / Debug.gridScale, this.debugPlayer.position.y / Debug.gridScale);
    
    this.context.beginPath();
    this.context.strokeStyle = "cyan";
    this.context.moveTo(playerPos.x, playerPos.y);
    this.context.lineTo(playerPos.x + ( ( 260 / Debug.gridScale ) * ( cos1 - sin1 ) ), playerPos.y + ( ( 260 / Debug.gridScale ) * ( sin1 + cos1 ) ));
    this.context.moveTo(playerPos.x, playerPos.y);
    this.context.lineTo(playerPos.x + ( ( 300 / Debug.gridScale ) * ( cos2 - sin2 ) ), playerPos.y + ( ( 300 / Debug.gridScale ) * ( sin2 + cos2 ) ));
    this.context.moveTo(playerPos.x, playerPos.y);
    this.context.lineTo(playerPos.x + ( ( 300 / Debug.gridScale ) * ( cos3 - sin3 ) ), playerPos.y + ( ( 300 / Debug.gridScale ) * ( sin3 + cos3 ) ));
    this.context.lineTo(playerPos.x + ( ( 300 / Debug.gridScale ) * ( cos2 - sin2 ) ), playerPos.y + ( ( 300 / Debug.gridScale ) * ( sin2 + cos2 ) ));
    this.context.closePath();
    this.context.stroke();
    
    this.rayGrid = [];
    this.rayPoints = [];
    
    for (let i = 0; i < Level.levelWidth; i++)
      this.rayGrid[i] = [];
  }
}