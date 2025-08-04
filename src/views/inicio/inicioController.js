import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alertas";
import { obtenerDatos } from "../../helpers/peticiones";

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
    // Llamo las funciones donde se cargan las entidades enviando como argumento el elemento donde se deben cargar respectivamente.
    cargarTipoLavados(tipoLavadosContent);
    cargarLavadores(lavadoresContent);

    const haederAgregar = document.getElementById("header-vehiculo");
    const cardAgregar = document.getElementById("card-vehiculo");

    if(!canCreate){
        haederAgregar.addEventListener("click",() => {
            infoAlert("Aún no se puede realizar un registro.", "Deben haber tipos de lavados y lavadores agregados");
        }); 
        cardAgregar.addEventListener("click",() => {
            infoAlert("Aún no se puede realizar un registro.", "Deben haber tipos de lavados y lavadores agregados");
        }); 
    }else{
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
    let placaBuscar =  await Swal.fire({
    title: 'Ingresa la placa',
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

  if(placaBuscar.isConfirmed){
    const vehiculo = await obtenerDatos(`vehiculos/placa/${placaBuscar.value}`);
    if(vehiculo.code == 200) window.location.href = `#/vehiculo/editar/placa=${placaBuscar.value}`;
    else window.location.href = "#/vehiculo/crear";
  }
}