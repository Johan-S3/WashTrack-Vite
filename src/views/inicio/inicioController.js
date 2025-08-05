import Swal from "sweetalert2";
import { confirmAlert, infoAlert, successAlert } from "../../helpers/alertas";
import { eliminarDato, obtenerDatos } from "../../helpers/peticiones";

// Variable en el que se almacenará un valor booleano para indicar si se puede agregar un vehiculo para asignar un lavado.
let canCreate = true;

export const inicioController = async (parametros = null) => {
  /* ------------------ VARIABLES ------------------  */
  
  // Obtengo los elementos donde va el nombre el usuario y su rol por su clase
  const nameUser = document.querySelector(".header__nameUser");
  const rolUser = document.querySelector(".header__nameRol");
  // Obtengo la referencia de los elementos donde se agregará la información de la base de datos
  const tipoLavadosContent = document.getElementById("contenedor_tipo_lavados");
  const lavadoresContent = document.getElementById("contenedor_lavadores");
  const historialContent = document.getElementById("contenedor_historial");
  const ingresosContent = document.getElementById("contenedor_ingresos");
  
  // Obtengo la referencia de los elementos botones donde me redirige al apartado donde se registra un vehiculo.
  const haederAgregar = document.getElementById("header-vehiculo");
  const cardAgregar = document.getElementById("card-vehiculo");

  // Llamo las funciones donde se cargan las entidades enviando como argumento el elemento donde se deben cargar respectivamente.
  cargarTipoLavados(tipoLavadosContent);
  cargarLavadores(lavadoresContent);
  cargarIngresos(ingresosContent);

  // Si la variable canCreate es contienen un valor falso...
  if (!canCreate) {
    // Agrego eventos a los botones que permite crear un vehiculo que al dar click muestre mensaje de información para no crear vehiculo.
    haederAgregar.addEventListener("click",() => {
      infoAlert("Aún no se puede realizar un registro.", "Deben haber tipos de lavados y lavadores agregados");
    }); 
    cardAgregar.addEventListener("click",() => {
      infoAlert("Aún no se puede realizar un registro.", "Deben haber tipos de lavados y lavadores agregados");
    }); 
  } else { //Si el valor de la variable es true entonces...
    // Agrego evento a los botones que al dar click llama a la función buscarVehiculo.
    haederAgregar.addEventListener("click", buscarVehiculo);
    cardAgregar.addEventListener("click", buscarVehiculo);
  }

  // Recibo los datos del usuario del localStorage
  const datosUsuario = JSON.parse(localStorage.getItem("usuario"));
  // console.log(datosUsuario);
// En una variable almaceno los datos de la respuesta de hacer fetch a la ruta que me consulta un rol por ID.
  const {data} = await obtenerDatos(`roles/${datosUsuario.codigo_rol}`);
  // console.log(data);
  
  // Le asigno el contenido correspondiente a los selectores del nombre del usuario logeado y su rol.
  nameUser.textContent = datosUsuario.nombre;
  rolUser.textContent = data.nombre_rol;
  
  /* ------------------ EVENTOS ------------------  */
  
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los tipos de lavados en el elemento correspondiente
async function cargarTipoLavados(contendor){
  try {
    // Asigno en una variable la respuesta de la peticion de los tipos de lavados
    const tiposLavados = await obtenerDatos("tipolavados");
    // console.log(tiposLavados);
    
    // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no hay tipos de lavados creados se le asigna a la variable canCreate el valor de false y se retorna-
    if(tiposLavados.code == 404){
      canCreate = false;
      return
    }
     
    // Le asigno a la variable canCreate true lo que indica que se puede registrar un vehiculo para asignar un lavado.
    canCreate = true;
    // Recorro los tipos de lavados obtenidos
    tiposLavados.data.forEach(tipoLavado => {
      // Creo un nuevo elemento span le agrego una clase y le agrego contenido que es el nombre del tipo de lavado
      const span = document.createElement('span');
      span.classList.add("content__field");
      span.textContent = tipoLavado.nombre;
    
      // Por ultimo agrego el span al contendor de los tipos de lavados. 
      contendor.append(span);
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
      // console.log(lavadores);

      // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no hay lavadaores creados se le asigna a la variable canCreate el valor de false y se retorna.
      if(lavadores.code == 404){
          canCreate = false;
          return
      }
      
      // Le asigno a la variable canCreate true lo que indica que se puede registrar un vehiculo para asignar un lavado.
      canCreate = true;
      // Recorro los tipos de lavados obtenidos
      lavadores.data.forEach(lavador => {
      // Creo un nuevo elemento span le agrego una clase y le agrego contenido que es el nombre del tipo de lavado
      const span = document.createElement('span');
      span.classList.add("content__field");
      span.textContent = lavador.nombre;
      
      // Por ultimo agrego el span al contendor de los lavadores. 
      contendor.append(span);
      })
  } catch (error) {
      console.log(error);
  }
}

async function buscarVehiculo() {
  // Le asigno a una variable el valor ingresado por medio de un Swall
    let placaBuscar =  await Swal.fire({
    title: 'Ingrese la placa',
    input: 'text',
    inputLabel: 'Placa del vehiculo',
    inputPlaceholder: 'Ej. AAA00A',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return '¡Debes escribir algo!';
      }
    }
  });

  // Si el swal se confirmó...
  if (placaBuscar.isConfirmed) {
    // Asigno a una varaible la respuesta de la peticion de buscar  un vehiculo por la palca ingresada.
    const vehiculo = await obtenerDatos(`vehiculos/placa/${placaBuscar.value}`);
    // Si el codigo de la peticion es 200 es decir, obtenido con exito entonces redirige a la pagina donde se actualizará la informacion del vehiculo.
    if (vehiculo.code == 200) window.location.href = `#/vehiculo/editar/placa=${placaBuscar.value}`;
    // Si el codigo de la peticion no es 200 entonces redirige a la pagina donde se crear un nuevo vehiculo.
    else window.location.href = `#/vehiculo/crear/placa=${placaBuscar.value}`;
  }
}

async function cargarIngresos(contenedor) {
  try {
    // Asigno en una variable la respuesta de la peticion de los ingresos
    const ingresos = await obtenerDatos(`detallesingreso/estado/registrado`);
    console.log(ingresos);

    // Recorro los ingresos obtenidos
    for (const ingreso of ingresos.data) {
    // Creo un nuevo elemento div le agrego sus clases y su atributo -> Card que contiene los detalles de cada ingreso
    const card = document.createElement('div');
    card.classList.add("panel__card", "card");
    card.setAttribute("data-id", ingreso.id_registro)
    
    // Creo un nuevo elemento div y le agrego su clase -> Bloque que contiene el tipo de vehiculo y el boton para eliminar.
    const infoVeh = document.createElement('div');
    infoVeh.classList.add("card__information");
    // Consulto el vehiculo por el id del vehiculo en el ingreso.
    const vehiculoIng = await obtenerDatos(`vehiculos/id/${ingreso.id_vehiculo}`);
    const tipoV = document.createElement('small');
    tipoV.classList.add("card__vehicle");
    const tipo = await obtenerDatos(`tiposvehiculos/${vehiculoIng.data.codigo_tipo_veh}`);
    tipoV.textContent = tipo.data.nombre_tipo
    const deleteIng = document.createElement('i');
    deleteIng.classList.add("ri-delete-bin-6-fill", "card__icon");
    deleteIng.setAttribute("data-id", ingreso.id_registro);
    deleteIng.addEventListener("click", async () => {
      const confirmacion = await confirmAlert("¿Está seguro de eliminar el ingreso?");
      if (!confirmacion.isConfirmed) return;
      const eliminado = await eliminarDato("detallesingreso", deleteIng.getAttribute("data-id"));
      // Si la peticion se realizó con exito muestro una alerta informando.
      if(eliminado.code == 200){
        const cardEliminar = document.querySelector(`div[data-id="${deleteIng.getAttribute("data-id")}"]`)
        cardEliminar.remove();
        await successAlert(eliminado.message);
      }
    })
    infoVeh.append(tipoV, deleteIng);
    
    // Creo un nuevo elemento strong le agrego su clase -> Bloque que contiene la placa del vehiculo
    const placaIng = document.createElement('strong');
    placaIng.classList.add("card__plate");
    placaIng.textContent = vehiculoIng.data.placa;

    // Creo un nuevo elemento div le agrego sus clases y su atributo -> Bloque que contiene las acciones de los ingresos
    const accionesIng = document.createElement('div');
    accionesIng.classList.add("card__space", "space");

    const editarIng = document.createElement('a');
    editarIng.classList.add("space__icon");
    editarIng.setAttribute("href", `#/vehiculo/editar/placa=${vehiculoIng.data.placa}`);
    const iconEdit = document.createElement('i');
    iconEdit.classList.add("ri-edit-2-line");
    editarIng.append(iconEdit);

    const asignarLav = document.createElement('a');
    asignarLav.classList.add("space__icon", "space__icon--scale");
    asignarLav.setAttribute("href", `#/lavados/crear/id=${ingreso.id_registro}`);
    const iconAsignar = document.createElement('i');
    iconAsignar.classList.add("ri-car-washing-fill");
    asignarLav.append(iconAsignar);

    accionesIng.append(editarIng, asignarLav);

    // Creo un nuevo elemento div le agrego su clase y su atributo -> Bloque que contiene la clave del vehiculo si tiene.
    const infoClave = document.createElement('div');
    infoClave.classList.add("card__washer");
    const claveVeh = document.createElement('small');
    if(vehiculoIng.data.clave == "" || vehiculoIng.data.clave == null) claveVeh.textContent = "Sin clave";
    else claveVeh.textContent = vehiculoIng.data.clave;
    const iconCandado = document.createElement('i');
    iconCandado.classList.add("ri-lock-2-fill", "card__icon");

    infoClave.append(claveVeh, iconCandado);

    // console.log(vehiculoIng);

    card.append(infoVeh, placaIng, accionesIng, infoClave);

    contenedor.append(card);
    
    
    // Por ultimo agrego el span al contendor de los lavadores. 
    // contendor.append(span);
  }
  } catch (error) {
      console.log(error);
  }
}