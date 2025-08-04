import { limitar, outFocus, validarFormulario, validarLetras, validarNumeros } from "../../../helpers/module";
import { crearDato, editarDato, obtenerDatos } from "../../../helpers/peticiones";

// Variables globales en el que se almacenará un valor booleano para indicar si la cedula del piloto ingresado existe en la base de datos y su id.
let existePiloto = false;
let idPiloto = 0;

export const crearVehiculoControllador = async (parametros = null) => {

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

  placaVeh.value = placa.toUpperCase();
  placaVeh.disabled = true;
  
  // Llamo a las funciones donde cargo los tipos de vehiculos y los servicios registrados en la base de datos en los elementos correspondientes.
  cargarTipoVehiculos(tipoVeh);
  cargarServicios(servicioVeh);

  /* ------------------ EVENTOS ------------------  */

  // Agrego evento para que al perder el enfoque el camnpo de la cedula realice una consulta.
  cedula.addEventListener("blur", async  () => {
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
    }
    console.log(pilotoRes); 
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

    let ingreso = {
      codigo_servicio: servicioVeh.value
    };

    // Try..catch para poder ver el error.
    try {
      // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el vehiculo.
      const vehiculoCreado = await crearDato(`vehiculos`, vehiculo); 
      console.log(vehiculoCreado);

      if (existePiloto) {
        // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el vehiculo.
        const pilotoActualizado = await editarDato(`propietariosvehiculos`, idPiloto , piloto); 
        console.log(pilotoActualizado);
      } else {
        // En una variable almaceno la respuesta de hacer fetch a la ruta que crea el propietario, piloto o dueño del vehiculo.
        const pilotoCreado = await crearDato(`propietariosvehiculos`, piloto); 
        console.log(pilotoCreado);
        
      }
      
      // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
      const alerta = await successAlert(respuesta.message);
      // Si la alerta es confirmado. Es decir, se di "Ok" en ellas
      if(alerta.isConfirmed){
        // Reseteo los campos del formulario y se dirige a la vista de lavadores
        formRegistro.reset();
        window.location.href = '#/lavadores';
      }
    } catch (error) {
      // Imprimo en la consola el error obtenido
      console.error(error);
    }
  })
}

/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los tipos de vehiculos en el elemento correspondiente
async function cargarTipoVehiculos(contendor){
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
async function cargarServicios(contendor){
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