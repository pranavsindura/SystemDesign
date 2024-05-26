import fs from "node:fs";

interface DatabaseItem {}

export class Database<
  ItemId extends string | number,
  Item extends DatabaseItem,
> {
  private idList: Array<ItemId>;
  private idMap: Partial<Record<ItemId, Item>>;
  private isReady: boolean;
  private filePath: string;

  constructor(filePath: string) {
    this.idMap = {};
    this.idList = [];
    this.filePath = filePath;
    this.isReady = false;
    this.loadDataFromStorage();
  }

  private loadDataFromStorage() {
    try {
      const data = fs.readFileSync(this.filePath);
      console.log("loading data from file", this.filePath);
      try {
        const dataJSON = JSON.parse(data.toString());
        this.idMap = dataJSON.idMap;
        this.idList = dataJSON.idList;
      } catch (parseError) {
        console.error("error while parsing data from file, but continuing");
        this.idMap = {};
        this.idList = [];
      }
      console.log("loaded", this.idList.length, "ids to list");
      console.log("loaded", Object.keys(this.idMap).length, "ids to map");
      this.isReady = true;
    } catch (err) {
      console.error(
        "error loading data from file, but continuing",
        this.filePath,
        err,
      );
      this.isReady = true;
    }
  }

  private setDataToStorage() {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify({ idMap: this.idMap, idList: this.idList }),
        { flag: "w" },
      );
      // console.log("wrote data to file", this.filePath);
    } catch (err) {
      if (err) {
        console.error(
          "error writing data to file, but continuing",
          this.filePath,
          err,
        );
        return;
      }
    }
  }

  private throwIfNotReady() {
    if (!this.isReady) {
      throw new Error("database not ready");
    }
  }

  add(itemId: ItemId, item: Item) {
    this.throwIfNotReady();
    if (this.idMap[itemId] != null) {
      throw new Error("id already exists");
    }
    this.idMap[itemId] = item;
    this.idList.push(itemId);
    this.setDataToStorage();
  }

  delete(itemId: ItemId) {
    this.throwIfNotReady();
    const idx = this.idList.indexOf(itemId);
    if (idx !== -1) {
      this.idList.splice(idx, 1);
    } else {
      throw new Error("id does not exist");
    }
    this.setDataToStorage();
  }

  update(itemId: ItemId, itemUpdate: Partial<Item>) {
    this.throwIfNotReady();
    if (this.idMap[itemId] == null) {
      throw new Error("id does not exist");
    }

    this.idMap[itemId] = {
      ...this.idMap[itemId],
      ...itemUpdate,
      id: itemId,
    };
    this.setDataToStorage();
  }

  get(id: ItemId): Item {
    this.throwIfNotReady();
    const item = this.idMap[id];
    if (item == null) {
      throw new Error("id does not exist");
    }
    return item;
  }

  getAll() {
    this.throwIfNotReady();
    return this.getMany(this.idList);
  }

  getMany(idList: ItemId[]): {
    idList: ItemId[];
    idMap: Partial<Record<ItemId, Item>>;
  } {
    this.throwIfNotReady();
    const localIdMap = idList.reduce((acc, id) => {
      if (this.idMap[id] == null) {
        throw new Error("id does not exist");
      }
      return {
        ...acc,
        [id]: this.idMap[id],
      };
    }, {});
    return {
      idList,
      idMap: localIdMap,
    };
  }

  getIsIdValidMany(idList: ItemId[]) {
    return idList.every((id) => this.getIsIdValid(id));
  }

  getIsIdValid(id: ItemId) {
    return this.idMap[id] != null;
  }

  getIsReady() {
    return this.isReady;
  }
}
