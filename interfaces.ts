import houses from './houses.json';

interface House {
  name: string;
  planets: string | string[];
  // ...
}

interface HouseWithID extends House {
  id: number;
  // ...
}
type HouseFilter = (house: House) => boolean;

function findHouses(houses: string | House [], filter?: HouseFilter): HouseWithID[] {
  let parsedHouses: House[] = houses as House[];
  if (typeof houses === 'string') {
    parsedHouses = JSON.parse(houses) as House[];
  }
  let id = 0;
  const housesWithId: HouseWithID[] = parsedHouses.map((h: House):HouseWithID => ({
    ...h,
    id: id++
  }) )
  return filter ? housesWithId.filter(filter) : housesWithId;
}

console.log(
  findHouses(JSON.stringify(houses), ({ name }) => name === 'Atreides')
);

console.log(findHouses(houses, ({ name }) => name === 'Harkonnen'));
