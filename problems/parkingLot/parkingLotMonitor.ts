import { type Observable, Observer } from "./observer";
import { ParkingLot } from "./parkingLot";

export class ParkingLotMonitor extends Observer {
  update(observable: Observable): void {
    if (observable instanceof ParkingLot) {
      const availableParkingSpotMap = observable.getAvailableParkingSpots();
      const reservedParkingSpotMap = observable.getReservedParkingSpots();

      console.log("---Parking Lot Status Changed---");
      console.log("Parking Lot -", observable.getLevel());
      console.log("Available Spots -");
      for (const [spotType, spotList] of availableParkingSpotMap) {
        console.log(spotType, spotList.length);
      }
      console.log("Reserved Spots -");
      for (const [spotType, spotList] of reservedParkingSpotMap) {
        console.log(spotType, spotList.length);
      }
      console.log("-------------END---------------");
    }
  }
}
