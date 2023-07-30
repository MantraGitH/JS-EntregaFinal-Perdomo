const recomendaciones = {
  alta:
    "Hace mucho calor. Te recomendamos usar ropa ligera, como camisetas y pantalones o shorts cortos.",
  media: "El clima está joya. Puedes usar camisetas de manga corta.",
  baja: "Fresco como lechuga. Te recomendamos usar un canguro o campera ligera.",
  muyBaja:
    "Está más frío que el corazón de tu ex. Es mejor que uses ropa abrigada, como un buzo o campera.",
};

function obtenerRecomendacion(temperatura) {
  if (temperatura >= 30) {
    return recomendaciones.alta;
  } else if (temperatura >= 20 && temperatura < 30) {
    return recomendaciones.media;
  } else if (temperatura >= 10 && temperatura < 20) {
    return recomendaciones.baja;
  } else {
    return recomendaciones.muyBaja;
  }
}

async function obtenerDatosClima(ciudad) {
  const apiKey = "2b50651d61e17a7b34353f4a5a645e64"; //
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const temperatura = data.main.temp;
      return temperatura;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error("Error al obtener datos climáticos: " + error.message);
  }
}

async function simularClima() {
  let ciudadInput = document.getElementById("ciudad");
  let iteracionesInput = document.getElementById("iteraciones");
  let resultadosDiv = document.getElementById("resultados");

  let ciudad = ciudadInput.value.trim();
  let iteraciones = parseInt(iteracionesInput.value);

  // 
  if (!ciudad) {
    // Mostrar alerta con SweetAlert
    Swal.fire({
      icon: "error",
      title: "Uh...",
      text: "Por favor, ingresa el nombre de alguna ciudad.",
    });
    return;
  }

  // Verificar que la cantidad de días esté en el rango permitido
  if (iteraciones < 1 || iteraciones > 7) {
    // Mostrar alerta con SweetAlert
    Swal.fire({
      icon: "error",
      title: "Uh...",
      text: "La cantidad de días debe estar entre 1 y 7.",
    });
    return;
  }


  const registrosClima = [];

  // Obtener la temperatura real de la API para la ciudad ingresada por el usuario
  let temperatura;
  try {
    temperatura = await obtenerDatosClima(ciudad);
  } catch (error) {
    // Mostrar alerta con SweetAlert en caso de error al obtener los datos del clima
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ingresa el nombre de alguna ciudad, por favor.",
    });
    return;
  }


  for (let iteracion = 1; iteracion <= iteraciones; iteracion++) {
    const registro = {
      dia: iteracion,
      ciudad: ciudad,
      temperatura: temperatura,
      recomendacion: obtenerRecomendacion(temperatura),
    };
    registrosClima.push(registro);

    console.log(registro);

    temperatura += Math.floor(Math.random() * 5) - 2; // Simulación de cambio de temperatura
  }

  const datosNuevos = {
    temperatura: temperatura,
    ciudad: ciudad,
    iteraciones: iteraciones,
    registrosClima: registrosClima,
  };

  // Obtener los datos previos almacenados en localStorage
  let datosJSON = localStorage.getItem("datos");
  let datosPrevios = datosJSON ? JSON.parse(datosJSON) : {};

  // Combinar los datos previos con los nuevos
  let datosCombinados = {
    temperatura: temperatura,
    ciudad: ciudad,
    iteraciones: iteraciones,
    registrosClima: [...(datosPrevios.registrosClima || []), ...registrosClima],
  };

  let datosCombinadosJSON = JSON.stringify(datosCombinados);

  // Almacenar los datos combinados en localStorage
  localStorage.setItem("datos", datosCombinadosJSON);


  resultadosDiv.innerHTML = "";

  for (const registro of registrosClima) {
    const resultado = document.createElement("p");
    resultado.textContent = `Día ${registro.dia}: Ciudad ${registro.ciudad} - Temperatura: ${registro.temperatura}ºC - Recomendación: ${registro.recomendacion}`;
    resultadosDiv.appendChild(resultado);
  }
}

// Para la obtención de datos del localStorage y poder establecerlos como valores predeterminados:
let datosJSON = localStorage.getItem("datos");

if (datosJSON) {
  let datos = JSON.parse(datosJSON);

  let ciudadInput = document.getElementById("ciudad");
  let iteracionesInput = document.getElementById("iteraciones");

  ciudadInput.value = datos.ciudad || "";
  iteracionesInput.value = datos.iteraciones || "";
}
