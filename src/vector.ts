import { Level } from "./level";

export default class Vector {
  constructor(public x: number, public y: number) { }
  
  unitCoord(): Vector {
    return new Vector(Math.floor(( this.x * Level.gridWidth ) + ( Level.gridWidth / 2 )), Math.floor(( this.y * Level.gridHeight ) + ( Level.gridHeight / 2 )));
  }
  
  gridCoord(): Vector {
    return new Vector(Math.floor(this.x / Level.gridWidth), Math.floor(this.y / Level.gridHeight));
  }
  
  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}