import { type Elevator } from "./elevator";
import { ElevatorMovementDirection } from "./elevatorMovement";

export interface ElevatorSelectionStategy {
  selectElevator: (
    floor: number,
    direction: ElevatorMovementDirection.UP | ElevatorMovementDirection.DOWN,
    elevatorList: Elevator[],
  ) => Elevator;
}

export class ShortestSeekTimeSelectionStrategy
  implements ElevatorSelectionStategy
{
  selectElevator(
    floor: number,
    direction: ElevatorMovementDirection.UP | ElevatorMovementDirection.DOWN,
    elevatorList: Elevator[],
  ): Elevator {
    let minSeek = 1e9;
    let selectedElevator: Elevator | undefined;
    for (const elevator of elevatorList) {
      const currentMovement = elevator.getOngoingMovement();
      const currentFloor = elevator.getCurrentFloor();
      if (currentMovement == null) {
        if (Math.abs(currentFloor - floor) < minSeek) {
          minSeek = Math.abs(currentFloor - floor);
          selectedElevator = elevator;
        }
      } else if (currentMovement.getDirection() === direction) {
        if (direction === ElevatorMovementDirection.UP) {
          if (floor > currentFloor && floor - currentFloor < minSeek) {
            minSeek = floor - currentFloor;
            selectedElevator = elevator;
          }
        } else {
          if (floor < currentFloor && currentFloor - floor < minSeek) {
            minSeek = currentFloor - floor;
            selectedElevator = elevator;
          }
        }
      }
    }

    if (selectedElevator != null) {
      return selectedElevator;
    }

    const randomIndex = Math.trunc(Math.random() * elevatorList.length);
    return elevatorList[randomIndex];
  }
}
