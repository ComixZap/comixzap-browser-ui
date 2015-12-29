
export const mixin1 = (target) => {
  console.log(1, target);
  if (!target.prototype) {
    return;
  }
  target.prototype.function1 = () => console.log(1);
}

export const mixin2 = (target, key, value) => {
  console.log(2, target);
  if (!target.prototype) {
    return;
  }
  target.prototype.function2 = () => console.log(2);
}
