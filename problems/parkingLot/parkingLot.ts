import IdGenerator from "./idGenerator";
import { type ParkingSpot, type ParkingSpotType } from "./parkingSpot";

export abstract class ParkingLot {
  private readonly id: number;
  private readonly level: number;
  private readonly availableParkingSpotMap: Map<ParkingSpotType, ParkingSpot[]>;
  private readonly reservedParkingSpotMap: Map<ParkingSpotType, ParkingSpot[]>;

  constructor(level: number) {
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
  }

  getAvailableParkingSpots(spotType: ParkingSpotType): ParkingSpot[] {
    return this.availableParkingSpotMap.get(spotType) ?? [];
  }

  print(): void {
    console.log("Parking Lot", this.level);
    console.log("Available Spots");
    for (const [spotType, spotList] of this.availableParkingSpotMap) {
      console.log(spotType, spotList.length);
    }
    console.log("Reserved Spots");
    for (const [spotType, spotList] of this.reservedParkingSpotMap) {
      console.log(spotType, spotList.length);
    }
  }
}

export class DefaultParkingLot extends ParkingLot {}
