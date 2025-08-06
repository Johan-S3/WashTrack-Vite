import { errorAlert, successAlert } from "../../../helpers/alertas";
import { validarFormulario } from "../../../helpers/module";
import { crearDato, editarDato, obtenerDatos } from "../../../helpers/peticiones";

export const actualizarLavadoController = async (parametros = null) => {
  const { id } = parametros;

  // Obtengo la referencia del formulario por el ID
  const formRegistro = document.getElementById("form-Registro");

  // Obtengo los elementos del vehiculo en el formulario. 
  const placa = document.querySelector('input[name="placa"]');
  const tipoLavado = document.querySelector('select[name="type"]');
  const lavador = document.querySelector('select[name="lavador"]')

  // Cargo los tipos de lavados y lavadores en sus select correspondientes.
  cargarTipoLavados(tipoLavado);
  cargarLavadores(lavador);
  
  // Obtengo la informacion del lavado.
  const lavado = await obtenerDatos(`lavados/id/${id}`);
  // console.log(lavado);
  // Destructuro la informacion del lavado para obtener el data de la peticion
  const { data } = lavado;

  // Consulto el ingreso por el ID obtenido previamente.
  const ingreso = await obtenerDatos(`detallesingreso/id/${data.id_registro}`)
  // console.log(ingreso);

  // Consulto el vehiculo por el ID obtenido previamente.
  const vehiculo = await obtenerDatos(`vehiculos/id/${ingreso.data.id_vehiculo}`)
  // console.log(vehiculo);

  // Le asgino a la entrada de texto de la placa, la placa obtenida de la consulta.
  placa.value = vehiculo.data.placa

  // Le asigno a los select su valor de acuerdo a los datos obtenidos en la consulta del lavado
  tipoLavado.value = data.codigo_tipo_lavado;
  lavador.value = data.codigo_lavador;

  // Pbtengo la información del usuario registrado en el localStorage
  const informacionUser = JSON.parse(localStorage.getItem("usuario"));

  // Consulto un usuario por su cedula, esta obtenida del localStorage.
  const usuario = await obtenerDatos(`usuarios/${informacionUser.cedula}`)


  // Al formualrio le agrego el evento submit
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault(); //Se previene el envio del formulario.

    // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
    if (!validarFormulario(e)) return;

    // Creo un objeto lavado con los valores agregados en el formulario.
    let lavado = {
      id_registro: data.id_registro,
      id_usuario: usuario.data.id,
      codigo_tipo_lavado: tipoLavado.value,
      codigo_lavador: lavador.value,
    }

    // Try..catch para poder ver el error.
    try {
      // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el lavado.
      const lavadoActualizado = await editarDato(`lavados`,id, lavado);
      // console.log(lavadoActualizado);

      // Si el codigo de la peticion no es 201. Es decir no se creó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
      // Y retorno para no seguir ejecutando el codigo.
      if (lavadoActualizado.code != 200) {
        mostrarErrores(lavadoActualizado);
        return;
      }

      // Si todas las peticiones se realizaron con exito muestro una alerta informando y la alamaceno en una variable.
      const alerta = await successAlert(lavadoActualizado.message);
      // Si la alerta es confirmado. Es decir, se di "Ok" en ella
      if (alerta.isConfirmed) {
        // Reseteo los campos del formulario y se dirige a la vista de inicio
        formRegistro.reset();
        window.location.href = '#/inicio';
      }
    } catch (error) {
      // Imprimo en la consola el error obtenido
      console.error(error);
    }
  })
}

/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los tipos de lavados en el elemento correspondiente
async function cargarTipoLavados(contendor) {
  try {
    // Asigno en una variable la respuesta de la peticion de los tipos de lavados
    const tiposLavados = await obtenerDatos("tipolavados");
    console.log(tiposLavados);

    // Recorro los tipos de lavados obtenidos
    tiposLavados.data.forEach(tipoLavado => {
      // Creo un nuevo elemento option y le agrego el atributo value con el id del tipo de lavado y contenido que es el nombre del tipo de lavado
      const option = document.createElement('option');
      option.setAttribute("value", tipoLavado.codigo_tipo_lavado)
      option.textContent = tipoLavado.nombre;

      // Por ultimo agrego el option al contendor de los tipos de lavados. 
      contendor.append(option);
    })
  } catch (error) {
    console.log(error);
  }
}

// Funcion para cargar los lavadores en el elemento correspondiente
async function cargarLavadores(contendor) {
  try {
    // Asigno en una variable la respuesta de la peticion de los lavadores
    const lavadores = await obtenerDatos("lavadores");
    console.log(lavadores);

    // Recorro los lavadores obtenidos
    lavadores.data.forEach(lavador => {
      // Creo un nuevo elemento option y le agrego el atributo value con el id del lavador y contenido que es el nombre del lavador
      const option = document.createElement('option');
      option.setAttribute("value", lavador.codigo_lavador)
      option.textContent = lavador.nombre;

      // Por ultimo agrego el option al contendor de los lavadores. 
      contendor.append(option);
    })
  } catch (error) {
    console.log(error);
  }
}

// Funcion que me muestras los errores de una peticion recibiendo la peticion como parametro.
async function mostrarErrores(peticion) {
  let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
  if (Array.isArray(peticion.errors)) error = peticion.errors[0]; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
  else error = peticion.errors //Si no es un arreglo solo alamceno el error obtenido en la varaible.
  // Por ultimo muestro el error en una alerta y retorno para no seguir.
  await errorAlert(peticion.message, error);
}