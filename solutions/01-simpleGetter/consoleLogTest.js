const oldObj = { a: "a", b: "b" };
const newObj = createSmartObject(oldObj);

defineComputedField(newObj, "ab", ["a", "b"], (a, b) => {
  return a + b;
});

defineComputedField(newObj, "ba", ["a", "b"], (a, b) => {
  return b + a;
});

newObj.a = "c";
console.log(newObj.ab); // cb
console.log(newObj.ba); // bc
