function CreateInMemoryDB<T>() {
  return class MemoryDB {
    constructor(private db: Record<string, T> = {}) {}
    get(key: string): T {
      return this.db[key];
    }
    set(key: string, value: T): void {
      this.db[key] = value;
    }
    getObject(): Record<string, T> {
      return this.db;
    }
  };
}

const StringDB = CreateInMemoryDB<string>();
const db = new StringDB();

type Constructor<T> = new (...args: any[]) => T;
function Dumpable<
  T extends Constructor<{
    getObject(): object;
  }>
>(Base: T) {
  return class Dumpable extends Base {
    dump(): void {
      console.log(this.getObject());
    }
  };
}

const DumpableStringDb = Dumpable(StringDB);

const ddb = new DumpableStringDb();

db.set('test', 'me');
ddb.set('test', 'dumpme');
console.log(db.get('test'));
console.log(ddb.dump());
export {};
