interface Duck {
  fly: () => void;
  quack: () => void;
}

interface Turkey {
  fly: () => void;
  gobble: () => void;
}

class WildTurkey implements Turkey {
  gobble: () => void = () => {
    console.log("Gobble Gobble");
  };

  fly: () => void = () => {
    console.log("i am flying a short distance");
  };
}

class MallardDuck implements Duck {
  fly: () => void = () => {
    console.log("i am flying");
  };

  quack: () => void = () => {
    console.log("Quack Quack");
  };
}

class TurkeyAdapter implements Duck {
  turkey: Turkey;

  constructor(turkey: Turkey) {
    this.turkey = turkey;
  }

  fly: () => void = () => {
    for (let i = 0; i < 5; i++) {
      this.turkey.fly();
    }
  };

  quack: () => void = () => {
    this.turkey.gobble();
  };
}

function adapterPattern(): void {
  const duck = new MallardDuck();
  duck.quack();
  duck.fly();

  const turkey = new WildTurkey();
  turkey.fly();
  turkey.gobble();

  const turkeyAdapter = new TurkeyAdapter(turkey);
  turkeyAdapter.fly();
  turkeyAdapter.quack();
}

adapterPattern();
