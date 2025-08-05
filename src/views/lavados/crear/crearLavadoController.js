import { obtenerDatos } from "../../../helpers/peticiones";

export const crearLavadoController = async (parametros = null) => {
    const {id} = parametros;

    // Obtengo la referencia del formulario por el ID
    const formRegistro = document.getElementById("form-Registro");

    // Obtengo los elementos del vehiculo en el formulario. 
    const placa = document.querySelector('input[name="placa"]');
    const tipoLavado = document.querySelector('select[name="type"]');
    const lavador = document.querySelector('select[name="lavador"]')

    const ingreso = await obtenerDatos(`detallesingreso/id/${id}`)

    const {id_vehiculo} = ingreso.data;

    const vehiculo = await obtenerDatos(`vehiculos/id/${id_vehiculo}`)

    console.log(vehiculo);
    placa.value = vehiculo.data.placa
    
    cargarTipoLavados(tipoLavado);
    cargarLavadores(lavador);
}

/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los tipos de lavados en el elemento correspondiente
async function cargarTipoLavados(contendor){
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
async function cargarLavadores(contendor){
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