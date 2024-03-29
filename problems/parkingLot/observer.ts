export abstract class Observable {
  private readonly observers: Observer[];
  private changed: boolean;

  constructor() {
    this.observers = [];
    this.changed = false;
  }

  protected setChanged(): void {
    this.changed = true;
  }

  addObserver(obs: Observer): void {
    this.observers.push(obs);
  }

  removeObserver(obs: Observer): void {
    const index = this.observers.indexOf(obs);
    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }

  protected notifyObservers(): void {
    if (this.changed) {
      for (const obs of this.observers) {
        obs.update(this);
      }
    }
  }
}

export abstract class Observer {
  abstract update(observable: Observable): void;
}
