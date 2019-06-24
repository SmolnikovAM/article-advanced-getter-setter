const oldObj = { a: "a", b: "b" };
const newObj = createSmartObject(oldObj);

defineComputedField(newObj, "ab", ["a", "b"], (a, b) => {
  console.log("called ab");
  return a + b;
});

defineComputedField(newObj, "ba", ["a", "b"], (a, b) => {
  console.log("called ba");
  return b + a;
});

newObj.a = "c";
oldObj.a = "modif";

console.log(newObj.ab); // expected: cb
// called ab
// modifb

console.log(newObj.ba); // expected: bc
// called ba
// bmodif
