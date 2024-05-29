export function formatFloat(num) {
  // Convertir el número a una cadena y dividirlo en partes entera y decimal
  let parts = num.toFixed(2).toString().split(".");

  // Obtener la parte entera
  let integerPart = parts[0];

  // Inicializar una cadena para almacenar el resultado formateado
  let formattedNum = "";

  // Recorrer la parte entera de atrás hacia adelante para agregar comas cada tres dígitos
  for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
    if (j % 3 === 0 && j !== 0) {
      formattedNum = "," + formattedNum;
    }
    formattedNum = integerPart[i] + formattedNum;
  }

  // Si hay una parte decimal, agregarla al resultado formateado
  if (parts.length > 1) {
    formattedNum += "." + parts[1];
  }

  return formattedNum;
}
