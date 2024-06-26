import IdGenerator from "./idGenerator";
import { Observable } from "./observer";
import { type ParkingSpot, type ParkingSpotType } from "./parkingSpot";

export class ParkingLot extends Observable {
  private readonly id: number;
  private readonly level: number;
  private readonly availableParkingSpotMap: Map<ParkingSpotType, ParkingSpot[]>;
  private readonly reservedParkingSpotMap: Map<ParkingSpotType, ParkingSpot[]>;

  constructor(level: number) {
    super();
    this.id = IdGenerator.getInstance().getId();
    this.level = level;
    this.availableParkingSpotMap = new Map();
    this.reservedParkingSpotMap = new Map();
  }

  getId(): number {
    return this.id;
  }

  getLevel(): number {
    return this.level;
  }

  addParkingSpot(parkingSpot: ParkingSpot): void {
    const list = this.availableParkingSpotMap.get(parkingSpot.getType()) ?? [];
    list.push(parkingSpot);
    this.availableParkingSpotMap.set(parkingSpot.getType(), list);
    this.setChanged();
    this.notifyObservers();
  }

  reserveParkingSpot(parkingSpot: ParkingSpot): Error | undefined {
    const availableList =
      this.availableParkingSpotMap.get(parkingSpot.getType()) ?? [];
    const index = availableList.indexOf(parkingSpot);

    if (index < 0) {
      return new Error("no such available parking spot found");
    }

    availableList.splice(index, 1);
    this.availableParkingSpotMap.set(parkingSpot.getType(), availableList);

    parkingSpot.reserve();

    const reservedList =
      this.reservedParkingSpotMap.get(parkingSpot.getType()) ?? [];
    reservedList.push(parkingSpot);
    this.reservedParkingSpotMap.set(parkingSpot.getType(), reservedList);
    this.setChanged();
    this.notifyObservers();
  }

  releaseParkingSpot(parkingSpot: ParkingSpot): Error | undefined {
    const reservedList =
      this.reservedParkingSpotMap.get(parkingSpot.getType()) ?? [];

    const index = reservedList.indexOf(parkingSpot);

    if (index < 0) {
      return new Error("spot is not reserved or not present");
    }

    reservedList.splice(index, 1);
    this.reservedParkingSpotMap.set(parkingSpot.getType(), reservedList);

    parkingSpot.release();

    const availableList =
      this.availableParkingSpotMap.get(parkingSpot.getType()) ?? [];
    availableList.push(parkingSpot);
    this.availableParkingSpotMap.set(parkingSpot.getType(), availableList);
    this.setChanged();
    this.notifyObservers();
  }

  getAvailableParkingSpotsByType(spotType: ParkingSpotType): ParkingSpot[] {
    return this.availableParkingSpotMap.get(spotType) ?? [];
  }

  getAvailableParkingSpots(): Map<ParkingSpotType, ParkingSpot[]> {
    return this.availableParkingSpotMap;
  }

  getReservedParkingSpots(): Map<ParkingSpotType, ParkingSpot[]> {
    return this.reservedParkingSpotMap;
  }
}
