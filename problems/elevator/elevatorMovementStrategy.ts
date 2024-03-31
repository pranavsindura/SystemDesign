import {
  ElevatorMovement,
  ElevatorMovementDirection,
} from "./elevatorMovement";

export abstract class ElevatorMovementStrategy {
  protected lastAcknowledgedMovement: ElevatorMovement;

  constructor(initialFloor: number) {
    this.lastAcknowledgedMovement = new ElevatorMovement(
      initialFloor,
      initialFloor,
      ElevatorMovementDirection.NONE,
    );
  }

  abstract queueRequest(floor: number): void;
  abstract getNextMovement(): ElevatorMovement;

  acknowledgeMovement(movement: ElevatorMovement): void {
    this.lastAcknowledgedMovement = movement;
  }
}

export class FCFSMovementStrategy extends ElevatorMovementStrategy {
  private readonly queue: number[];
  private readonly set: Set<number>;

  constructor(initialFloor: number) {
    super(initialFloor);
    this.queue = [];
    this.set = new Set();
  }

  queueRequest(floor: number): void {
    if (!this.set.has(floor)) {
      this.set.add(floor);
      this.queue.push(floor);
    }
  }

  getNextMovement(): ElevatorMovement {
    const floor = this.queue.shift() ?? null;
    if (floor == null || this.lastAcknowledgedMovement.getTo() === floor) {
      return new ElevatorMovement(
        this.lastAcknowledgedMovement.getTo(),
        this.lastAcknowledgedMovement.getTo(),
        ElevatorMovementDirection.NONE,
      );
    }

    this.set.delete(floor);
    const direction =
      this.lastAcknowledgedMovement.getTo() > floor
        ? ElevatorMovementDirection.DOWN
        : ElevatorMovementDirection.UP;

    return new ElevatorMovement(
      this.lastAcknowledgedMovement.getTo(),
      floor,
      direction,
    );
  }
}

export class LookMovementStrategy extends ElevatorMovementStrategy {
  private readonly queue: number[];
  private readonly set: Set<number>;

  constructor(initialFloor: number) {
    super(initialFloor);
    this.queue = [];
    this.set = new Set();
  }

  queueRequest(floor: number): void {
    if (!this.set.has(floor)) {
      this.set.add(floor);
      this.queue.push(floor);
      this.queue.sort((a, b) => a - b);
    }
  }

  private getNextMovementInDirection(
    lastFloor: number,
    direction: ElevatorMovementDirection,
  ): ElevatorMovement | null {
    if (direction === ElevatorMovementDirection.NONE) {
      return null;
    }

    if (direction === ElevatorMovementDirection.UP) {
      let index = -1;
      for (let i = 0; i < this.queue.length; i++) {
        if (this.queue[i] >= lastFloor) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        const nextFloor = this.queue[index];
        this.set.delete(nextFloor);
        this.queue.splice(index, 1);
        return new ElevatorMovement(
          lastFloor,
          nextFloor,
          ElevatorMovementDirection.UP,
        );
      } else {
        return null;
      }
    }

    let index = -1;
    for (let i = this.queue.length - 1; i >= 0; i--) {
      if (this.queue[i] <= lastFloor) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      const nextFloor = this.queue[index];
      this.set.delete(nextFloor);
      this.queue.splice(index, 1);
      return new ElevatorMovement(
        lastFloor,
        nextFloor,
        ElevatorMovementDirection.DOWN,
      );
    } else {
      return null;
    }
  }

  getNextMovement(): ElevatorMovement {
    const nextMovementInDirection = this.getNextMovementInDirection(
      this.lastAcknowledgedMovement.getTo(),
      this.lastAcknowledgedMovement.getDirection(),
    );

    if (nextMovementInDirection != null) {
      return nextMovementInDirection;
    }

    const nextMovementInUpDirection = this.getNextMovementInDirection(
      this.lastAcknowledgedMovement.getTo(),
      ElevatorMovementDirection.UP,
    );
    if (nextMovementInUpDirection != null) {
      return nextMovementInUpDirection;
    }

    const nextMovementInDownDirection = this.getNextMovementInDirection(
      this.lastAcknowledgedMovement.getTo(),
      ElevatorMovementDirection.DOWN,
    );
    if (nextMovementInDownDirection != null) {
      return nextMovementInDownDirection;
    }

    const lastFloor = this.lastAcknowledgedMovement.getTo();
    const nextFloor = this.queue.shift();
    if (nextFloor == null || nextFloor === lastFloor) {
      return new ElevatorMovement(
        lastFloor,
        lastFloor,
        ElevatorMovementDirection.NONE,
      );
    }

    const nextDirection =
      nextFloor > lastFloor
        ? ElevatorMovementDirection.UP
        : ElevatorMovementDirection.DOWN;

    return new ElevatorMovement(lastFloor, nextFloor, nextDirection);
  }
}
