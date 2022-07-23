interface Dog {
  name: string,
  age: number,
}
function pluck<DataType, KeyType extends keyof DataType>(arr: DataType[], key: KeyType) {
  return arr.map(a=>a[key]);
}
const dogs: Dog[] = [
  {name: 'test1', age: 3},
  {name: 'test2', age: 5},
]
console.log(pluck(dogs, 'age'));
console.log(pluck(dogs, 'name'));

interface BaseEvent {
  time: number,
  user: number,
}

interface EventMap {
  addToCart: BaseEvent & { productId: string, quantity: number },
  checkout: BaseEvent,
}

function sendEvent<EventType extends keyof EventMap>(event: EventType, data: EventMap[EventType]): void {
  console.log(event, data);
}

sendEvent("addToCart", {productId: 'test', quantity: 1, time: 1212, user: 12});
sendEvent("checkout", { time: 232, user: 343});