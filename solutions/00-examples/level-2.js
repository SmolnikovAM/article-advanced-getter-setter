const obj = createSmartObject({
  name: "Vasya",
  surname: "Ivanov",
  patronymic: "Olegovich"
});

defineComputedField(obj, "fullName", function(data) {
  return data.name + " " + data.surname + " " + data.patronymic;
});
// Да, от каких полей зависит наш computed вычисляется МАГИЧЕСКИ

console.log(obj.fullName); // Vasya Ivanov Olegovich
obj.surname = "Petrov";
console.log(obj.fullName); // Vasya Petrov Olegovich
obj.fullName = "foo"; // error
