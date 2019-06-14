const obj = createSmartObject({
  name: 'Vasya',
  surname: 'Ivanov',
  patronymic: 'Olegovich',
});

defineComputedField(
  obj,
  'fullName',
  ['name', 'surname', 'patronymic'],
  (name, surname, patronimic) => {
    return name + ' ' + surname + ' ' + patronymic;
  },
);

console.log(obj.fullName); // Vasya Ivanov Olegovich
obj.surname = 'Petrov';
console.log(obj.fullName); // Vasya Petrov Olegovich
obj.fullName = 'foo'; // error
