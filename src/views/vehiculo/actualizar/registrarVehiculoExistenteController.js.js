import { errorAlert, successAlert } from "../../../helpers/alertas";
import { limitar, outFocus, validarFormulario, validarLetras, validarNumeros } from "../../../helpers/module";
import { crearDato, editarDato, obtenerDatos } from "../../../helpers/peticiones";

// Variables globales en el que se almacenará un valor booleano para indicar si la cedula del piloto ingresado existe en la base de datos y su id.
let existePiloto = false;
let idPiloto = 0;

export const registrarVehiculoExistenteController = async (parametros = null) => {
  // Obtengo la placa del parametro recibido.
  const { placa } = parametros;

  // Obtengo la referencia del formulario por el ID
  const formRegistro = document.getElementById("form-Registro");

  // Obtengo los elementos del vehiculo en el registro. 
  const placaVeh = document.querySelector('input[name="placa"]');
  const marca = document.querySelector('input[name="marca"]');
  const modelo = document.querySelector('input[name="modelo"]');
  const tipoVeh = document.querySelector('select[name="typeVeh"]');
  const servicioVeh = document.querySelector('select[name="typeSer"]')
  const clave = document.querySelector('input[name="clave"]');
  // Obtengo los elementos del piloto del vehiculo.
  const cedula = document.querySelector('input[name="cedula"]');
  const nombre = document.querySelector('input[name="nombre"]');
  const telefono = document.querySelector('input[name="telefono"]');

  // Llamo a las funciones donde cargo los tipos de vehiculos y los servicios registrados en la base de datos en los elementos correspondientes.
  await cargarTipoVehiculos(tipoVeh);
  await cargarServicios(servicioVeh);

  // Asigno a una varaible la respuesta de la peticion pra obtener un vehiculo por su placa.
  const vehiculo = await obtenerDatos(`vehiculos/placa/${placa}`);
  console.log(vehiculo);

  const { data } = vehiculo;

  // Le asigno el valor a los campos del vehiculo obtenidos de la petición. 
  placaVeh.value = data.placa;
  marca.value = data.marca_vehiculo;
  modelo.value = data.modelo_vehiculo;
  clave.value = data.clave;
  tipoVeh.value = data.codigo_tipo_veh;


  // Deshabilito la entrada de texto de la placa.
  placaVeh.disabled = true;

  // Le pongo el foco a la cedula para cuando se dejen los datos intactos al dar al boton se ejecute el vento de salir del foco de la cedula para consultar el pioloto con esa cedula.
  cedula.focus();

  
  /* ------------------ EVENTOS ------------------  */

  // Agrego evento para que al perder el enfoque el camnpo de la cedula realice una consulta.
  cedula.addEventListener("blur", async () => {
    // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta si el piloto ingresado ya existe con ese número de cedula...
    const pilotoRes = await obtenerDatos(`propietariosvehiculos/cedula/${cedula.value}`);

    // Si el codigo de la peticion es 200. Es decir, existo... Piloto encontrado, entonces...
    if (pilotoRes.code == 200) {
      // La data de la peticion la destructuro.
      const { data } = pilotoRes;

      // Le asigno a los campos nombre y telefono los datos obtenidos de la peticion.
      nombre.value = data.nombre;
      telefono.value = data.telefono;

      // Le asigno a la variable existePiloto el valor de true, que indica que el piloto si existe en la base de datos con ese numero de cedula. Y a la variable idPiloto el id del propietario existente obtenido.
      existePiloto = true;
      idPiloto = data.id
    } else {
      // Si el codigo de la peticion no es 200. Es decir que no exite. Entonces, le asigno a las entradas de texto nombre y telefono un valor vacio.
      nombre.value = "";
      telefono.value = "";
    }
    // console.log(pilotoRes); 
  })

  // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
  marca.addEventListener('keydown', validarLetras);
  modelo.addEventListener('keydown', validarNumeros);
  clave.addEventListener('keydown', validarNumeros);
  cedula.addEventListener('keydown', validarNumeros);
  nombre.addEventListener('keydown', validarLetras);
  telefono.addEventListener('keydown', validarNumeros);

  // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
  placaVeh.addEventListener("keypress", (e) => limitar(e, 6));
  marca.addEventListener("keypress", (e) => limitar(e, 30));
  modelo.addEventListener("keypress", (e) => limitar(e, 4));
  clave.addEventListener("keypress", (e) => limitar(e, 10));
  cedula.addEventListener("keypress", (e) => limitar(e, 10));
  nombre.addEventListener("keypress", (e) => limitar(e, 30));
  telefono.addEventListener("keypress", (e) => limitar(e, 10));

  // Declaro y defino un arreglo con los campos del formulario.
  const campos = [placaVeh, marca, modelo, tipoVeh, servicioVeh, clave, cedula, nombre, telefono];

  // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
  campos.forEach(campo => {
    campo.addEventListener("blur", outFocus);
  });

  // Al formualrio le agrego el evento submit
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault(); //Se previene el envio del formulario.

    // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
    if (!validarFormulario(e)) return;

    // Creo un objeto vehiculo con los valores agregados en el formualrio.
    let vehiculo = {
      placa: placaVeh.value,
      codigo_tipo_veh: tipoVeh.value,
      marca_vehiculo: marca.value,
      modelo_vehiculo: modelo.value,
      clave: clave.value
    }

    // Creo un objeto piloto con los valores agregados en el formualrio.
    let piloto = {
      cedula: cedula.value,
      nombre: nombre.value,
      telefono: telefono.value
    }

    // Creo un objeto ingreso con su atributo de codigo de servicio. Los demas atributos se agregarán de acuerdo al resultado de las peticiones siguientes.
    let ingreso = {
      codigo_servicio: servicioVeh.value,
      estado: "registrado"
    };

    // Try..catch para poder ver el error.
    try {
      // En una variable almaceno la respuesta de hacer fetch a la ruta que actualiza el vehiculo.
      const vehiculoActualizado = await editarDato(`vehiculos`, data.id, vehiculo);
      console.log(vehiculoActualizado);

      // Si el codigo de la peticion no es 200. Es decir no se actualizó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
      // Y retorno para no seguir ejecutando el codigo.
      if (vehiculoActualizado.code != 200) {
        mostrarErrores(vehiculoActualizado);
        return;
      }
      // Agrego al objeto ingreso un nuevo atributo co9n su valor.
      ingreso.id_vehiculo = data.id;

      // Si existePiloto es true. Es decir, la cedula que se ingreso en el campo cedula ya existe entonces...
      if (existePiloto) {
        // En una variable almaceno la respuesta de hacer fetch a la ruta que actualiza el propietario o piloto del vehiculo.
        const pilotoActualizado = await editarDato(`propietariosvehiculos`, idPiloto, piloto);
        console.log(pilotoActualizado);

        // Si el codigo de la peticion no es 200. Es decir no se actualizó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
        // Y retorno para no seguir ejecutando el codigo.
        if (pilotoActualizado.code != 200) {
          mostrarErrores(pilotoActualizado);
          return;
        }

        // Creo la propiedad id_duenio_vehiculo en el objeto ingreso y le asigno el id del piloto obtenido anteriormente.
        ingreso.id_duenio_vehiculo = idPiloto;
      } else {
        // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el propietario, piloto o dueño del vehiculo.
        const pilotoCreado = await crearDato(`propietariosvehiculos`, piloto);
        // console.log(pilotoCreado);

        // Si el codigo de la peticion no es 201. Es decir no se creó el dato entonces llamo la funcion que muestra los errores enviando la respuesta de la peticion.
        // Y retorno para no seguir ejecutando el codigo.
        if (pilotoCreado.code != 201) {
          mostrarErrores(pilotoCreado);
          return;
        }

        // Creo la propiedad id_duenio_vehiculo en el objeto ingreso y le asigno el id de la data al crear el piloto o propietario.
        ingreso.id_duenio_vehiculo = pilotoCreado.data.id;
      }

      // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el ingreso con sus detalles.
      const registroIngreso = await crearDato(`detallesingreso`, ingreso)
      console.log(registroIngreso);

      // Si la petición NO se realizó con exito...
      if (registroIngreso.code != 201) {
        mostrarErrores(registroIngreso);
        return;
      }

      // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
      const alerta = await successAlert(registroIngreso.message);
      // Si la alerta es confirmado. Es decir, se di "Ok" en ella
      if (alerta.isConfirmed) {
        // Reseteo los campos del formulario y se dirige a la vista de inicio
        formRegistro.reset();
        window.location.href = '#/inicio';
      }
    } catch (error) {
      console.log(error);
    }
  })
}

/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los tipos de vehiculos en el elemento correspondiente
async function cargarTipoVehiculos(contendor) {
  try {
    // Asigno en una variable la respuesta de la peticion de los tipos de vehiculos
    const tiposVehiculos = await obtenerDatos("tiposvehiculos");
    // console.log(tiposVehiculos);

    // Recorro los tipos de vehiculos obtenidos
    tiposVehiculos.data.forEach(tipoVehiculo => {
      // Creo un nuevo elemento option y le agrego el atributo value con el id del tipo de vehiculo y contenido que es el nombre del tipo de vehiculo
      const option = document.createElement('option');
      option.setAttribute("value", tipoVehiculo.codigo_tipo)
      option.textContent = tipoVehiculo.nombre_tipo;

      // Por ultimo agrego el option al contendor de los tipos de vehiculos. 
      contendor.append(option);
    })
  } catch (error) {
    console.log(error);
  }
}

// Funcion para cargar los servicios en el elemento correspondiente
async function cargarServicios(contendor) {
  try {
    // Asigno en una variable la respuesta de la peticion de los servicios
    const servicios = await obtenerDatos("serviciosvehiculos");
    // console.log(servicios);

    // Recorro los servicios obtenidos
    servicios.data.forEach(servicio => {
      // Creo un nuevo elemento option y le agrego el atributo value con el id del servicio y contenido que es el nombre del servicio
      const option = document.createElement('option');
      option.setAttribute("value", servicio.codigo_servicio)
      option.textContent = servicio.nombre_servicio;

      // Por ultimo agrego el option al contendor de los tipos de vehiculos. 
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