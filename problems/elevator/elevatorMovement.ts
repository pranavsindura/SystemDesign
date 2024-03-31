export enum ElevatorMovementDirection {
  UP = "UP",
  DOWN = "DOWN",
  NONE = "NONE",
}

export class ElevatorMovement {
  private readonly from: number;
  private readonly to: number;
  private readonly direction: ElevatorMovementDirection;

  constructor(from: number, to: number, direction: ElevatorMovementDirection) {
    this.from = from;
    this.to = to;
    this.direction = direction;
  }

  getFrom(): number {
    return this.from;
  }

  getTo(): number {
    return this.to;
  }

  getDirection(): ElevatorMovementDirection {
    return this.direction;
  }
}
