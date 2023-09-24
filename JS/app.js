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

// JSON CARGA DE DATOS 
const cargarDatosJSON = async () => {
  try {
    const response = await fetch("../JSON/productos.json");
    const data = await response.json();
    edificioSuites = data.edificioSuites.map((depto) =>new Departamento(depto.id, depto.nombre, depto.descripcion, depto.precio, depto.capacidad));
    edificioStudios = data.edificioStudios.map((depto) =>new Departamento(depto.id, depto.nombre, depto.descripcion, depto.precio, depto.capacidad));
    console.log("Carga de datos exitosa");
  } catch (error) {
    console.error("Error al cargar los datos desde el archivo JSON:", error);
  }
};
cargarDatosJSON();

//seccion abrir formulario
const buscarDepartamentosDisponibles = () => {
  const edificioSeleccionado = document.getElementById("edificio").value;
  const fechaIngreso = new Date(document.getElementById("fecha-ingreso").value);
  const fechaSalida = new Date(document.getElementById("fecha-salida").value);
  const cantidadHuespedes = parseInt(document.getElementById("huespedes").value);

  const cantidadHuespedesError = isNaN(cantidadHuespedes) || cantidadHuespedes < 1 || cantidadHuespedes >= 6;
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

  const resultados = edificio.filter((depto) => {
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
  resultadosDiv.innerHTML +=
    resultados.length === 0
      ? "<h2>Departamentos Disponibles:</h2><p>No hay departamentos disponibles para las fechas y cantidad de huéspedes seleccionados.</p>"
      : resultados
          .map((depto, index) => `<div>
    <h2 class="estiloParrafo">${depto.nombre}</h2>
    <p class="estiloParrafo">${depto.descripcion}</p>
    <p class="estiloParrafo"> Precio por noche: $${depto.precio}</p>
    <button onclick="reservarDepartamento(${depto.id})" class="btn btn-primary btn-reservar reservar-button">Reservar Departamento</button>
  </div>`).join("");
};

//Se abren las opciones de departamentos segun cantidad de huespedes
const reservarDepartamento = (id) => {
  if (id !== undefined) {
    const departamento = edificioSuites
      .concat(edificioStudios)
      .find((depto) => depto.id === id);
    localStorage.setItem("departamentoSeleccionado", JSON.stringify(departamento));

    const mostrarMensajeReserva = (departamento) => {
      const mensaje = departamento
        ? `Departamento ${departamento.nombre} reservado con éxito.`
        : "No se ha encontrado el departamento seleccionado para reservar.";
      const icono = departamento ? "success" : "error";
      Swal.fire({
        icon: icono,
        title: departamento ? "Reservado con éxito" : "Error",
        text: mensaje,
      });
    };
    mostrarMensajeReserva(departamento);
  }
};


//vaciar carrito
const limpiarLocalStorage = () => {
  localStorage.clear();
  Swal.fire({
    icon: "success",
    title: "Carrito vacío",
  });
};


//ver carrito
const verCarrito = () => {
  const carrito = JSON.parse(localStorage.getItem("departamentoSeleccionado"));
  const verCarritoBody = document.getElementById("verCarritoBody");
  const mensaje = carrito
    ? `
      <p>Departamento Reservado:</p>
      <h3>${carrito.nombre}</h3>
      <p>Descripción: ${carrito.descripcion}</p>
      <p>Precio por noche: $${carrito.precio}</p>
    `
    : "<p>No se ha reservado ningún departamento aún.</p>";
  verCarritoBody.innerHTML = mensaje;
};
console.log(verCarrito);


//eventos
document.querySelector("#ver-carrito-button").addEventListener("click", verCarrito);
document.getElementById("buscar-button").addEventListener("click", function (event) {
    event.preventDefault(); 
    buscarDepartamentosDisponibles();
  });
document.getElementById("reservar-button").addEventListener("click", function (event) {
    event.preventDefault();
    reservarDepartamento();
  });

document.getElementById("limpiar-button").addEventListener("click", function (event) {
    event.preventDefault(); 
    limpiarLocalStorage();
  });