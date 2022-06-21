
export interface ComposeInterface<T> {
  parent: T;
  children: T[];
  add(obj: T): void;
  update(t: Date): void
}
export interface ComposeConstructor<T> {
  new (): ComposeInterface<T>;
}
export class Compose<T> {
  private parent: ComposeInterface<T>;
  private children: ComposeInterface<T>[];
  constructor() {
    this.parent = null;
    this.children = [];
  }
  add(obj: ComposeInterface<T> | any) {
    obj.parent = this;
    this.children.push(obj);
  }
  update(t: Date) {
    this.children.forEach((ele) => {
      ele.update(t)
    })
  }
}