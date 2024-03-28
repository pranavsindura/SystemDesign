class Light {
  private isOn: boolean;
  private readonly location: string;

  constructor(location: string) {
    this.isOn = false;
    this.location = location;
  }

  on(): void {
    this.isOn = true;
  }

  off(): void {
    this.isOn = false;
  }

  status(): void {
    console.log(this.location, "light is", this.isOn ? "On" : "Off");
  }
}

interface Command {
  execute: () => void;
  undo: () => void;
}

class LightOnCommand implements Command {
  light: Light;
  constructor(light: Light) {
    this.light = light;
  }

  execute(): void {
    this.light.on();
  }

  undo(): void {
    this.light.off();
  }
}

class NoCommand implements Command {
  execute(): void {}
  undo(): void {}
}

class MacroCommand implements Command {
  commands: Command[];
  constructor(commands: Command[]) {
    this.commands = commands;
  }

  execute(): void {
    this.commands.forEach((command) => {
      command.execute();
    });
  }

  undo(): void {
    this.commands.forEach((command) => {
      command.undo();
    });
  }
}

class SimpleRemoteControl {
  private slot: Command;
  private lastCommand: Command;

  constructor() {
    this.slot = new NoCommand();
    this.lastCommand = new NoCommand();
  }

  setCommand(command: Command): void {
    this.slot = command;
  }

  onPressSlot(): void {
    this.lastCommand = this.slot;
    this.slot.execute();
  }

  onPressUndo(): void {
    this.lastCommand.undo();
  }
}

function commandPattern(): void {
  const remote = new SimpleRemoteControl();
  const livingRoomLight = new Light("Living Room");
  const kitchenLight = new Light("Kitchen");

  remote.setCommand(
    new MacroCommand([
      new LightOnCommand(livingRoomLight),
      new LightOnCommand(kitchenLight),
    ]),
  );

  livingRoomLight.status();
  kitchenLight.status();
  remote.onPressSlot();
  livingRoomLight.status();
  kitchenLight.status();
  remote.onPressUndo();
  livingRoomLight.status();
  kitchenLight.status();
}

export default commandPattern;
