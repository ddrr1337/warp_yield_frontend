function addObjectToStorage(newObject) {
  const storageKey = "myArrayKey";
  // Recupera el array del localStorage
  const jsonString = localStorage.getItem(storageKey);

  // Si el array ya existe, deserialízalo; de lo contrario, inicia un array vacío
  const array = jsonString ? JSON.parse(jsonString) : [];

  // Añade el nuevo objeto al array
  array.push(newObject);

  // Serializa el array modificado a una cadena JSON
  const updatedJsonString = JSON.stringify(array);

  // Guarda el array actualizado en localStorage
  localStorage.setItem(storageKey, updatedJsonString);

  return array;
}

export default addObjectToStorage;
