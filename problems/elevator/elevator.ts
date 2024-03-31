import {
  type ElevatorMovement,
  ElevatorMovementDirection,
} from "./elevatorMovement";
import { type ElevatorMovementStrategy } from "./elevatorMovementStrategy";

export class Elevator {
  private static readonly MOVEMENT_SPEED: number = 2000;
  private readonly id: number;
  private currentFloor: number;
  private ongoingMovement: ElevatorMovement | null;
  private movementStrategy: ElevatorMovementStrategy;

  constructor(id: number, movementStrategy: ElevatorMovementStrategy) {
    this.id = id;
    this.movementStrategy = movementStrategy;
    this.ongoingMovement = null;
    this.currentFloor = 0;
  }

  queueRequest(floor: number): void {
    this.movementStrategy.queueRequest(floor);
    this.startMovement();
  }

  setMovementStrategy(movementStrategy: ElevatorMovementStrategy): void {
    this.movementStrategy = movementStrategy;
  }

  isMoving(): boolean {
    return this.ongoingMovement != null;
  }

  private startMovement(): void {
    if (this.isMoving()) {
      return;
    }

    this.report();

    const nextMovement = this.movementStrategy.getNextMovement();

    if (nextMovement.getDirection() === ElevatorMovementDirection.NONE) {
      return;
    }

    this.ongoingMovement = nextMovement;
    this.report();

    // Simulate movement
    setTimeout(() => {
      this.currentFloor = nextMovement.getTo();
      this.movementStrategy.acknowledgeMovement(nextMovement);
      this.ongoingMovement = null;
      this.startMovement();
    }, Elevator.MOVEMENT_SPEED);
  }

  report(): void {
    if (this.isMoving()) {
      console.log(
        `Elevator ${this.id} going ${this.ongoingMovement?.getDirection()} Floor ${this.ongoingMovement?.getFrom()} -> Floor ${this.ongoingMovement?.getTo()}`,
      );
    } else {
      console.log(`Elevator ${this.id} is at ${this.currentFloor}`);
    }
  }
}
