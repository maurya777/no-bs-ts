type FilterFunction<T> = (data: T[keyof T]) => boolean;
type MapFunction<T> = (data: T[keyof T]) => T[keyof T];
type Filters<T> = Record<keyof T, FilterFunction<T>[]>;
type Maps<T> = Record<keyof T, MapFunction<T>[]>;
type ProcessedEvent<T> = {
  eventName: keyof T;
  data: T[keyof T];
};

class EventProcessor<T extends {}> {
  private filters: Filters<T> = {} as Filters<T>;
  private maps: Maps<T> = {} as Maps<T>;
  private processedEvents: ProcessedEvent<T>[] = [];

  handleEvent<K extends keyof T>(eventName: K, data: T[K]): void {
    let taken = true;
    for (const filter of this.filters[eventName] ?? []) {
      if (!filter(data)) {
        taken = false;
        break;
      }
    }
    if (taken) {
      let mapped = { ...data };
      for (const map of this.maps[eventName] ?? []) {
        mapped = <T[K]>map(mapped);
      }
      this.processedEvents.push({
        eventName,
        data: mapped,
      });
    }
  }

  addFilter<K extends keyof T>(eventName: K, filter: FilterFunction<T>): void {
    this.filters[eventName] ||= [];
    this.filters[eventName].push(filter);
  }

  addMap<K extends keyof T>(eventName: K, map: MapFunction<T>): void {
    this.maps[eventName] ||= [];
    this.maps[eventName].push(map);
  }

  getProcessedEvents(): ProcessedEvent<T>[] {
    return this.processedEvents;
  }
}

interface EventMap {
  login: { user?: string | null; name?: string; hasSession?: boolean };
  logout: { user?: string };
}

class UserEventProcessor extends EventProcessor<EventMap> {}

const uep = new UserEventProcessor();

uep.addFilter('login', ({ user }) => Boolean(user));

uep.addMap('login', (data) => ({
  ...data,
  hasSession: Boolean(data.user),
}));

uep.handleEvent('login', {
  user: null,
  name: 'jack',
});
uep.handleEvent('login', {
  user: 'tom',
  name: 'tomas',
});
uep.handleEvent('logout', {
  user: 'tom',
});

console.log(uep.getProcessedEvents());

/*
Result:

[
  {
    eventName: 'login',
    data: { user: 'tom', name: 'tomas', hasSession: true }
  },
  { eventName: 'logout', data: { user: 'tom' } }
]
*/

export {};
