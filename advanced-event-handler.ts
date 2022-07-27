type Map<T> = (data: T) => T;
type Filter<T> = (data: T) => boolean;
type EventHandler<T> = {
  [Prop in keyof T as `map${Capitalize<string & Prop>}`]?: Map<T[Prop]>;
} & {
  [Prop in keyof T as `filter${Capitalize<string & Prop>}`]?: Filter<T[Prop]>;
} & {
  random?: boolean;
};

type ProcessedEvent<T> = {
  eventName: keyof T;
  data: T[keyof T];
};

function ucFirst(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}
class EventProcessor<T> {
  private handlers: EventHandler<T>[] = [];
  private processedEvents: ProcessedEvent<T>[] = [];

  handleEvent<K extends keyof T>(eventName: K, data: T[K]): void {
    let taken = true;
    for (const handler of this.handlers) {
      const filterFunc = handler[
        `filter${ucFirst(<string>eventName)}` as keyof EventHandler<T>
      ] as unknown as ((value: T[K]) => boolean) | undefined;
      if (filterFunc && !filterFunc?.(data)) {
        taken = false;
        break;
      }
    }
    if (taken) {
      let mapped = { ...data };
      for (const handler of this.handlers) {
        const mapFunc = handler[
          `map${ucFirst(<string>eventName)}` as keyof EventHandler<T>
        ] as unknown as ((value: T[K]) => T[K]) | undefined;
        if (mapFunc) {
          mapped = mapFunc(mapped);
        }
      }
      this.processedEvents.push({
        eventName,
        data: mapped,
      });
    }
  }

  addHandler(handler: EventHandler<T>) {
    this.handlers.push(handler);
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

const uep: UserEventProcessor = new UserEventProcessor();
uep.addHandler({
  filterLogin: ({ user }) => Boolean(user),
  mapLogin: (data) => ({
    ...data,
    hasSession: Boolean(data.user),
  }),
});

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
