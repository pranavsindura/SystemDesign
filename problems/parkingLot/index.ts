/*
 * Questions?
 *   - How many parking spots? - 30k
 *   - How many entrances / exits? - 4 entry 4 exit
 *   - Multiple floors? - 1
 *   - different slot types? - S/M/L - Handicapped / Compact / Large / Motorcycle
 *   - what is the behaviour?
 *    - car comes in from entrance? we assign it a slot? give it a ticket? then car parks?
 *    - car comes to exit? we take its ticket? we charge the car? then car leaves?
 *    - should parking spot be near the entrance?
 *    - hourly parking rate?
 *    - pay by cash / credit card?
 *    - monitoring system?
 *
 * Object?
 *  - Parking lot
 *  - Entry / Exit Terminal
 *  - Payment Processor
 *  - Printers
 *  - Tickets
 *  - Parking Spot
 *  - DB
 *  - Monitoring System
 */

import { HourlyParkingFeeFactory } from "./parkingFee";
import { DefaultParkingFeeCalculator } from "./parkingFeeCalculator";
import { DefaultParkingLot } from "./parkingLot";
import { DefaultParkingSpot, ParkingSpotType } from "./parkingSpot";
import { DefaultParkingSpotFindingStrategy } from "./parkingSpotFindingStrategy";
import { EntryTerminal, ExitTerminal, TerminalType } from "./terminal";
import { wait } from "./utils";

/**
 * Parking Lot
 * Parking Spot
 * Ticket
 * Entry Terminal
 * Exit Terminal
 * Printer
 * Payment Processor
 * Parking Manager
 */

async function parkingLotTestDrive(): Promise<void> {
  const parkingLot = new DefaultParkingLot(1);
  const entryTerminalA = new EntryTerminal(
    TerminalType.ENTRY,
    parkingLot,
    new DefaultParkingSpotFindingStrategy(parkingLot),
  );

  const exitTerminalA = new ExitTerminal(
    TerminalType.EXIT,
    parkingLot,
    new DefaultParkingFeeCalculator(new HourlyParkingFeeFactory()),
  );

  parkingLot.addParkingSpot(
    new DefaultParkingSpot(ParkingSpotType.HANDICAPPED),
  );
  parkingLot.addParkingSpot(new DefaultParkingSpot(ParkingSpotType.COMPACT));
  parkingLot.addParkingSpot(new DefaultParkingSpot(ParkingSpotType.LARGE));
  parkingLot.addParkingSpot(new DefaultParkingSpot(ParkingSpotType.MOTORCYCLE));

  parkingLot.print();

  console.log("reserving a compact spot");
  const [compactReserveError, compactTicket] =
    entryTerminalA.reserveParkingSpot(ParkingSpotType.COMPACT);

  await wait(2000);

  if (compactReserveError != null) {
    console.error(compactReserveError);
  } else {
    parkingLot.print();
    compactTicket.print();

    console.log("release the spot");
    const [releaseError, parkingFee] =
      exitTerminalA.releaseParkingSpot(compactTicket);
    if (releaseError != null) {
      console.error(releaseError);
      return;
    }

    console.log("Parking Fee", parkingFee);

    parkingLot.print();
    compactTicket.print();
  }

  console.log("reserving a Handicapped spot");
  const [handicappedReserveError, handicappedTicket] =
    entryTerminalA.reserveParkingSpot(ParkingSpotType.HANDICAPPED);

  if (handicappedReserveError != null) {
    console.error(handicappedReserveError);
  } else {
    parkingLot.print();
    handicappedTicket.print();

    await wait(2000);

    console.log("release the spot");
    const [releaseError, parkingFee] =
      exitTerminalA.releaseParkingSpot(handicappedTicket);
    if (releaseError != null) {
      console.error(releaseError);
      return;
    }

    console.log("Parking Fee", parkingFee);

    parkingLot.print();
    handicappedTicket.print();
  }
}

export default parkingLotTestDrive;
