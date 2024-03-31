/*
 * Design an Elevator
 * Questions?
 *  - How many elevators? (> 1 can be generalised)
 *  - How many floors? (> 1 can be generalised)
 *  - What functionality in elevator
 *    - User can press button floor to go to that floor
 *  - What functionality outside elevator
 *    - User can press UP / DOWN button to request for an elevator
 *  - Can elevators be added or removed (for maintenance) - yes
 *  - Elevator selection algorithm must be dynamic
 *  - Elevator movement algorithm must be dynamic
 *  - Selecting which elevator will service the request?
 *    - Odd floor by odd elevator, even by even
 *    - Zone based - assign elevators to zone and choose one based on the zone of request
 *    - fallback -> random selection?
 *  - Movement of elevator based on the requests? (this is similar to disk read / write strategy)
 *    - first come first serve - can cause long waiting times, frequent change of direction
 *    - shortest seek time - far away floors can be starved from service
 *    - scan - elevators moves in one direction from first to last - unnecessary movement till last floor if not needed
 *    - look - elevator move to largest floor request and then to lowest and repeats - no priority or urgency factored in
 *
 * Objects?
 *  - Elevator
 *  - Elevator Manager
 *  - Elevator selection strategy
 *  - Elevator movement strategy
 * */

import { Elevator } from "./elevator";
import { LookMovementStrategy } from "./elevatorMovementStrategy";

function elevatorTestDrive(): void {
  const e = new Elevator(1, new LookMovementStrategy(0));
  e.queueRequest(1);
  e.queueRequest(10);
  e.queueRequest(3);
  setTimeout(() => {
    e.queueRequest(0);
    e.queueRequest(30);
    e.queueRequest(32);
    e.queueRequest(32);
    e.queueRequest(5);
  }, 6000);
}

export default elevatorTestDrive;
