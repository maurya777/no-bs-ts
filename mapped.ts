type FlexibleDogInfo = {
  name: string;
  [key: string]: string;
};

type ParalledDogNumberType<T> = {
  [Property in keyof T]: number;
};
type ParalledDogListenersType<T> = {
  [Property in keyof T as `on${Capitalize<string & Property>}Change`]?: (
    v: T[Property]
  ) => void;
} & {
  [Property in keyof T as `on${Capitalize<string & Property>}Delete`]?: (
    v: T[Property]
  ) => void;
};

const dog: FlexibleDogInfo = {
  name: 'test-dog',
  aRandomAttribute: 'something',
};

const dogNumbers: ParalledDogNumberType<FlexibleDogInfo> = {
  name: 232,
  aRandomAttribute: 344,
  nonExisting: 34423,
};

const dogListeners: ParalledDogListenersType<FlexibleDogInfo> = {
  onNameChange: (v: string) => {
    console.log('Name changed');
  },
};
