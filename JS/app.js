class Departamento {
  constructor(id, nombre, descripcion, precio, capacidad) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.capacidad = capacidad;
  }
}

let edificioSuites = [];
let edificioStudios = [];

// Función para cargar los datos desde el archivo JSON
const cargarDatosJSON = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("../JSON/productos.json");
      const data = await response.json();
      edificioSuites = data.edificioSuites.map(
        (depto) =>
          new Departamento(
            depto.id,
            depto.nombre,
            depto.descripcion,
            depto.precio,
            depto.capacidad
          )
      );
      edificioStudios = data.edificioStudios.map(
        (depto) =>
          new Departamento(
            depto.id,
            depto.nombre,
            depto.descripcion,
            depto.precio,
            depto.capacidad
          )
      );
      resolve(); // Resolvemos la promesa si la carga de datos es exitosa
      console.log("resuelto correctamente");
    } catch (error) {
      console.error("Error al cargar los datos desde el archivo JSON:", error);
      reject(error); // Rechazamos la promesa si hay un error
    }
  });
};
// Llama a la función para cargar los datos al cargar la página
cargarDatosJSON();

function buscarDepartamentosDisponibles() {
  const edificioSeleccionado = document.getElementById("edificio").value;
  const fechaIngreso = new Date(document.getElementById("fecha-ingreso").value);
  const fechaSalida = new Date(document.getElementById("fecha-salida").value);
  const cantidadHuespedes = parseInt(document.getElementById("huespedes").value);

  const cantidadHuespedesError = isNaN(cantidadHuespedes) || cantidadHuespedes < 1 || cantidadHuespedes >= 6; 

// Mensaje de error para fechas
const fechasError = fechaIngreso >= fechaSalida || isNaN(fechaIngreso) || isNaN(fechaSalida);

if (cantidadHuespedesError || fechasError) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: cantidadHuespedesError
      ? "Por favor, ingresa una cantidad válida de huéspedes."
      : "Las fechas de ingreso y salida deben ser válidas y la fecha de ingreso debe ser anterior a la fecha de salida.",
  });
  return;
}

  const edificio = edificioSeleccionado === "suites" ? edificioSuites : edificioStudios;

  const resultados = edificio.filter(depto => {
    if (cantidadHuespedes >= 1 && cantidadHuespedes <= 2) {
      return depto.capacidad >= 1 && depto.capacidad <= 2;
    } else if (cantidadHuespedes >= 3 && cantidadHuespedes <= 5) {
      return depto.capacidad >= 3 && depto.capacidad <= 5;
    } else {
      return false;
    }
  });

  const resultadosDiv = document.getElementById("resultados");

  resultadosDiv.innerHTML = "";

  resultadosDiv.innerHTML += resultados.length === 0
  ? "<h2>Departamentos Disponibles:</h2><p>No hay departamentos disponibles para las fechas y cantidad de huéspedes seleccionados.</p>"
  : resultados.map((depto, index) => `<div>
    <h2 class="estiloParrafo">${depto.nombre}</h2>
    <p class="estiloParrafo">${depto.descripcion}</p>
    <p class="estiloParrafo"> Precio por noche: $${depto.precio}</p>
    <button onclick="reservarDepartamento(${depto.id})" class="btn btn-primary btn-reservar reservar-button">Reservar Departamento</button>
  </div>`).join('');
}

function reservarDepartamento(id) {
  if (id !== undefined) {
    const departamento = edificioSuites.concat(edificioStudios).find((depto) => depto.id === id);
    localStorage.setItem("departamentoSeleccionado", JSON.stringify(departamento));


    if (departamento) {
      Swal.fire({
        icon: "success",
        title: "Reservado con éxito",
        text: `Departamento ${departamento.nombre} reservado con éxito.`,
      })
      //.then(() => {
        // Puedes realizar alguna acción después de que el usuario cierre el SweetAlert, si es necesario.
        // Por ejemplo, redirigir a otra página o actualizar la interfaz de usuario.
      //});
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se ha encontrado el departamento seleccionado para reservar.",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se ha seleccionado ningún departamento para reservar.",
    });
  }
}

function limpiarLocalStorage() {
  localStorage.clear();
  Swal.fire({
    icon: "success",
    title: "Carrito vacio",
  })
}

document.getElementById("buscar-button").addEventListener("click", function (event) {
  event.preventDefault(); // Evitar la recarga de la página
  buscarDepartamentosDisponibles();
});

document.getElementById("reservar-button").addEventListener("click", function (event) {
  event.preventDefault(); // Evitar la recarga de la página
  reservarDepartamento();
});

document.getElementById("limpiar-button").addEventListener("click", function (event) {
  event.preventDefault(); // Evitar la recarga de la página
  limpiarLocalStorage();
});


function verCarrito() {
  const carrito = JSON.parse(localStorage.getItem("departamentoSeleccionado"));

  const verCarritoBody = document.getElementById("verCarritoBody");

  if (carrito) {
    // Si hay un departamento reservado, muestra la información en el modal
    verCarritoBody.innerHTML = `
      <p>Departamento Reservado:</p>
      <h3>${carrito.nombre}</h3>
      <p>Descripción: ${carrito.descripcion}</p>
      <p>Precio por noche: $${carrito.precio}</p>
    `;
  } else {
    // Si no hay un departamento reservado, muestra un mensaje
    verCarritoBody.innerHTML = "<p>No se ha reservado ningún departamento aún.</p>";
  }
}

// Agrega un evento al botón "Ver Carrito" para abrir el modal
document.querySelector("ver-carrito-button").addEventListener("click", function () {
  verCarrito();
});
