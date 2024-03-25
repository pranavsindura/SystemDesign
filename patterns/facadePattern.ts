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

enum FanSpeed {
  OFF = "OFF",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

class Fan {
  private speed: FanSpeed;
  constructor() {
    this.speed = FanSpeed.OFF;
  }

  low(): void {
    this.speed = FanSpeed.LOW;
  }

  medium(): void {
    this.speed = FanSpeed.MEDIUM;
  }

  high(): void {
    this.speed = FanSpeed.HIGH;
  }

  off(): void {
    this.speed = FanSpeed.OFF;
  }

  status(): void {
    console.log("Fan is on speed", this.speed);
  }
}

class HomeFacade {
  private readonly light: Light;
  private readonly fan: Fan;

  constructor(light: Light, fan: Fan) {
    this.light = light;
    this.fan = fan;
  }

  imHome(): void {
    this.light.on();
    this.fan.high();
  }

  imOut(): void {
    this.light.off();
    this.fan.off();
  }

  status(): void {
    this.light.status();
    this.fan.status();
  }
}

function facadePattern(): void {
  const homeFacade = new HomeFacade(new Light("Bedroom"), new Fan());
  homeFacade.status();

  homeFacade.imHome();
  homeFacade.status();

  homeFacade.imOut();
  homeFacade.status();
}

facadePattern();
