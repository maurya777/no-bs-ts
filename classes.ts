interface DB<T, K> {
    get(key:K): T;
    set(key:K, value: T): void;
}

interface PDB {
    serialise(): string;
    restore(str: string): void;
}

type DBKeyType = string | number | symbol;
class InMemoryDB<T,K extends DBKeyType> implements DB<T,K> {
  protected db: Record<K, T> = {} as Record<K, T>;
  get(key: K): T {
    return this.db[key];
  }
  set(key: K, value: T): void{
    this.db[key] = value;
  }
}

class PersistentInMemoryDB<T, K extends DBKeyType> extends InMemoryDB<T, K> implements PDB {
    serialise(): string {
        return JSON.stringify(this.db);
    }
    restore(str: string): void {
        this.db = JSON.parse(str);
    }
}

const db = new InMemoryDB<number, string>;
db.set('test', 2323);


console.log(db.get('test'));