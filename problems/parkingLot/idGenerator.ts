class IdGenerator {
  private static instance: IdGenerator;
  private count;

  private constructor() {
    this.count = 0;
  }

  static getInstance(): IdGenerator {
    if (IdGenerator.instance == null) {
      IdGenerator.instance = new IdGenerator();
    }

    return IdGenerator.instance;
  }

  getId(): number {
    return this.count++;
  }
}

export default IdGenerator;
