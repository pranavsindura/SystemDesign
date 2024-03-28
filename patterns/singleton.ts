class Singleton {
  private static instance: Singleton;
  private constructor() {}

  static getInstance(): Singleton {
    if (Singleton.instance == null) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  log(): void {
    console.log("hello world!");
  }
}

function singletonPattern(): void {
  Singleton.getInstance().log();
}

export default singletonPattern;
