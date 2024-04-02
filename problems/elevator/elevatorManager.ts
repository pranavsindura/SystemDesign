import { type Elevator } from "./elevator";
import { type ElevatorMovementDirection } from "./elevatorMovement";
import { type ElevatorSelectionStategy } from "./elevatorSelectionStrategy";

export class ElevatorManager {
  private readonly elevatorList: Elevator[];
  private readonly elevatorSelectionStrategy: ElevatorSelectionStategy;

  constructor(elevatorSelectionStrategy: ElevatorSelectionStategy) {
    this.elevatorList = [];
    this.elevatorSelectionStrategy = elevatorSelectionStrategy;
  }

  addElevator(elevator: Elevator): void {
    this.elevatorList.push(elevator);
  }

  removeElevator(elevator: Elevator): void {
    this.elevatorList.splice(this.elevatorList.indexOf(elevator), 1);
  }

  queueRequest(
    floor: number,
    direction: ElevatorMovementDirection.UP | ElevatorMovementDirection.DOWN,
  ): Elevator {
    const elevator = this.elevatorSelectionStrategy.selectElevator(
      floor,
      direction,
      this.elevatorList,
    );
    elevator.queueRequest(floor);
    console.log("Request", floor, direction, "assigned to", elevator.getId());
    return elevator;
  }
}
