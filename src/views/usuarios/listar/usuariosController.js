import { confirmAlert, errorAlert, successAlert } from "../../../helpers/alertas";
import { eliminarDato, obtenerDatos } from "../../../helpers/peticiones";

let nombreUsuario;

export const usuariosController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    // Obtengo los elementos donde va el nombre el usuario y su rol por su clase
    const nameUser = document.querySelector(".header__nameUser");
    const rolUser = document.querySelector(".header__nameRol");

    // Recibo los datos del usuario del localStorage
    const datosUsuario = JSON.parse(localStorage.getItem("usuario"));
    // console.log(datosUsuario);
    // En una variable almaceno los datos de la respuesta de hacer fetch a la ruta que me consulta un rol por ID.
    const { data } = await obtenerDatos(`roles/${datosUsuario.codigo_rol}`);
    // console.log(data);

    // Le asigno el contenido correspondiente a los selectores del nombre del usuario logeado y su rol.
    nameUser.textContent = datosUsuario.nombre;
    rolUser.textContent = data.nombre_rol;

    nombreUsuario = datosUsuario.nombre;

    // Obtengo el boton para crear un nuevo tipo de lavado
    const buttonCreate = document.querySelector(".table__button--create");

    // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
    const bodyTable = document.querySelector(".table__body");

    // Llamo la funcion donde se carga los usuarios en el contenedor correspondiente.
    cargarUsuarios(bodyTable);


    /* ------------------ EVENTOS ------------------  */
    // Agrego evento para cargar las la vista donde se crea un nuevo tipo de lavado.

    buttonCreate.addEventListener('click', cargarVistaCrear);
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los usuarios en el elemento correspondiente
async function cargarUsuarios(contendor) {
    try {
        // Asigno en una variable la respuesta de la peticion de los usuarios
        const usuarios = await obtenerDatos("usuarios");
        // console.log(usuarios); 

        // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no hay usuarios creados se redirige a la pagina donde se agregan nuevos usuarios a a base de datos.
        if (usuarios.code == 404) cargarVistaCrear();

        // Recorro los usuarios obtenidos
        usuarios.data.forEach(async (usuario) => {

            // Creo nuevos elementos: Una fila y todas su celdas o campos.
            const fila = document.createElement('tr');
            const celdaId = document.createElement("td");
            const celdaCedula = document.createElement("td");
            const celdaNombre = document.createElement("td");
            const celdaCorreo = document.createElement("td");
            const celdaTelefono = document.createElement("td");
            const celdaContrasena = document.createElement("td");
            const celdaRol = document.createElement("td");
            const celdaAcciones = document.createElement("td");

            // Le agrego una clase a la fila.
            fila.classList.add("table__row");

            // Le agrego a la fila el atributo que contiene el id de la tupla.
            fila.setAttribute("data-id", usuario.id)

            // Declaro y asigno a una variable un arreglo con las celdas de la fila
            const celdas = [celdaId, celdaCedula, celdaNombre, celdaCorreo, celdaTelefono, celdaContrasena, celdaRol, celdaAcciones];

            // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
            celdas.forEach(celda => {
                celda.classList.add("table__cell");
            })

            // Agrego clase diferente a la celda de acciones.
            celdaAcciones.classList.add("table__cell--separate");

            // Agrego a las celdas el contenido correspondiente.
            celdaId.textContent = usuario.id;
            celdaCedula.textContent = usuario.cedula;
            celdaNombre.textContent = usuario.nombre;
            celdaCorreo.textContent = usuario.correo;
            celdaTelefono.textContent = usuario.telefono;
            celdaContrasena.textContent = usuario.contrasena;

            const rol = await obtenerDatos(`roles/${usuario.codigo_rol}`);
            celdaRol.textContent = rol.data.nombre_rol;

            // Creo el boton de editar con sus clases y atributos y sus nodos hijos y los agrego.
            const botonEditar = document.createElement("button");
            botonEditar.classList.add("table__button");
            botonEditar.setAttribute("data-id", usuario.id)
            const iconoEditar = document.createElement("i");
            iconoEditar.classList.add("ri-edit-2-line");
            botonEditar.append(iconoEditar);
            
            // Agrego eventos a los botones
            botonEditar.addEventListener("click", async () => {
                const alerta = await confirmAlert("¿Desea actualizar el usuario?");

                // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
                if (alerta.isConfirmed) {
                    const idEditar = botonEditar.getAttribute("data-id");
                    window.location.href = `#/usuarios/editar/id=${idEditar}`;
                }
            })


            // Agrego los botones a la celda de acciones.
            celdaAcciones.append(botonEditar);
            if(usuario.nombre != nombreUsuario){
                // Creo el boton de eliminar con sus clases y atributos y sus nodos hijos y los agrego.
                const botonEliminar = document.createElement("button");
                botonEliminar.classList.add("table__button", "table__button--delete");
                botonEliminar.setAttribute("data-id", usuario.id)
                const iconoEliminar = document.createElement("i");
                iconoEliminar.classList.add("ri-delete-bin-2-fill");
                botonEliminar.append(iconoEliminar);

                // Le agrego al boton eliminar el evento click en el cual se valida si se quiere eliminar el usuario
                botonEliminar.addEventListener("click", async () => {
                    const alerta = await confirmAlert("¿Está seguro de eliminar el usuario?");
    
                    // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
                    if (alerta.isConfirmed) {
                        const idEliminar = botonEliminar.getAttribute("data-id");
                        // Y se llama a la función que elimina el usuario enviando como argumento el id a eliminar.
                        eliminarusuario(idEliminar);
                    }
    
                })

                // Agrego los botones a la celda de acciones.
            celdaAcciones.append(botonEliminar);
            }



            // Agrego las celdas a la fila
            fila.append(celdaId, celdaCedula, celdaNombre, celdaCorreo, celdaTelefono, celdaContrasena, celdaRol, celdaAcciones);

            // Por ultimo agrego la fila al contenedor
            contendor.append(fila);
        })
    } catch (error) {
        // Muestro el error en la consola.
        console.log(error);
    }
}

// Funcion para borrar de la base de datos el id y para eliminar la tupla en la tabla.
async function eliminarusuario(id) {
    // Se realiza la peticion para obtener lavados por el id o codigo del usuario.
    const lavadoExist = await obtenerDatos(`lavados/usuario/${id}`);

    // Si el codigo de respuesta de la peticion es 200. Es decir, existe un lavado con ese usuario relacionado.
    if (lavadoExist.code == 200) {
        // Muestro mensaje de error ya que no se puede eliminar ese usuario y retorno.
        errorAlert("¡Ups! No se puede eliminar el usuario", "Este usuario ya pertenece a un lavado");
        return;
    }

    // Se realiza la peticion para eliminar el usuario por el id.
    const peticion = await eliminarDato("usuarios", id);
    // Si el codigo de la respuesta el 200. Es decir, el usuario ya se eliminó de la base de datos...
    if (peticion.code == 200) {
        // Obtengo la fila con el id del registro que se eliminó y la remuevo de la tabla.
        const fila = document.querySelector(`[data-id = "${id}"]`)
        fila.remove();
        // Por ultimo muestro una alerta de exito indicando que el usuario se eliminó.
        successAlert("usuario eliminado correctamente");
    }
}

// Funcion para cargar los usuarios en el elemento correspondiente
async function cargarVistaCrear() {
    window.location.href = "#/usuarios/crear";
}