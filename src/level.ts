import Vector from "./vector";

export const enum GridType {
  empty,
  wall,
  wall2,
  debug_SpawnPoint,
  debug_RayPath,
  debug_RayHit
}

export const GridColours: string[] = [];
GridColours[GridType.empty] = "rgba(100, 100, 100, 1.0)";
GridColours[GridType.wall] = "rgba(200, 200, 200, 1.0)";
GridColours[GridType.wall2] = "rgba(250, 200, 200, 1.0)";
GridColours[GridType.debug_SpawnPoint] = "rgba(300, 50, 50, 1.0)";
GridColours[GridType.debug_RayPath] = "rgba(100, 100, 200, 1.0)";
GridColours[GridType.debug_RayHit] = "rgba(50, 300, 50, 1.0)";

export class Level {
  static gridWidth = 64;
  static gridHeight = 64;
  static gridStep = 1;
  static levelWidth = 79;
  static levelHeight = 30;
  static wallHeight = Level.gridHeight * 4;
  
  spawnPoint: Vector;
  grid: number[][];
  
  constructor(levelString: string) {
    this.spawnPoint = new Vector(0, 0);
    this.grid = [];
    
    for (let i = 0; i < Level.levelWidth; i++)
      this.grid[i] = [];
      
    this.loadLevel(levelString);
  }

  private loadLevel(levelString: string): void {
    levelString = levelString.substr(1, levelString.length - 1);
    
    for (let i = 0, charCount = 0, lineIndex = 0; i < Level.levelHeight; i++) {
      let newLine = false;
      
      for (let j = 0; j < Level.levelWidth; j++) {
        this.grid[j][i] = GridType.empty;
        
        if (newLine != false)
          continue;
        
        let charIndex = lineIndex + j;
        
        switch (levelString.charAt(charIndex))
        {
          case "\n":
            newLine = true;
            break;
            
          case "-":
          case "|":
            this.grid[j][i] = GridType.wall;
            break;
          
          case "#":
            this.grid[j][i] = GridType.wall2;
            break;
          
          case "p":
            this.spawnPoint = new Vector(j, i).unitCoord();
            this.grid[j][i] = GridType.debug_SpawnPoint;
            break;
        }

        charCount++;

      }
      
      lineIndex = charCount;
    }
  }
}