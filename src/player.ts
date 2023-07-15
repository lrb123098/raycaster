import { moveDirection, rotateDirection } from "./raycaster";
import { Level } from "./level";
import Vector from "./vector";

export default class Player {
  static moveSpeed = 1;
  static rotateSpeed = 3;
  static size = ( Level.gridWidth + Level.gridHeight ) / 4;
  static defaultDirection = 0;
  
  position: Vector;
  
  constructor(public viewDirection: number = Player.defaultDirection) {
    this.position = new Vector(0, 0);
  }
  
  // WIP
  move(direction: moveDirection): void {
    switch (direction) {
      case moveDirection.forward:
      case moveDirection.backward:
      default:
        break;
    }
  }
  
  rotate(direction: rotateDirection): void {
    this.viewDirection += direction * Player.rotateSpeed;
  }
}