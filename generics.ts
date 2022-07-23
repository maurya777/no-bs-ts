function myForEach<T>(items: T[], f: (v: T)=>void): void {
  items.reduce((a,n) =>{
    f(n);
    return undefined
  }, undefined);
}

myForEach([1,2,3], (x)=>console.log(x));

function myFilter<T>(items: T[], f: (v: T) => boolean): T[] {
  return items.reduce((a: T[],c:T)=>{
    return f(c) ? [...a, c] : a;
  },[] as T[]);
}

console.log(myFilter([1,2,3,4,5], (x)=>x%2==0));

function myMap<T>(items: T[], f: (v:T)=>unknown): unknown[] {
  return items.reduce((a: unknown[], c: T)=>{
    return [...a, f(c)]
  },[]);
}

console.log(myMap([1,2,3,4,5], (x)=> x*10));