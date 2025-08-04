import { confirmAlert, errorAlert, successAlert } from "../../../helpers/alertas";
import { eliminarDato, obtenerDatos } from "../../../helpers/peticiones";

export const lavadoresController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    // Obtengo el boton para crear un nuevo tipo de lavado
    const buttonCreate = document.querySelector(".table__button--create");

    // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
    const bodyTable = document.querySelector(".table__body");

    // Llamo la funcion donde se carga los lavadores en el contenedor correspondiente.
    cargarLavadores(bodyTable);


    /* ------------------ EVENTOS ------------------  */
    // Agrego evento para cargar las la vista donde se crea un nuevo tipo de lavado.

    buttonCreate.addEventListener('click', cargarVistaCrear);
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los lavadores en el elemento correspondiente
async function cargarLavadores(contendor){
    try {
        // Asigno en una variable la respuesta de la peticion de los lavadores
        const lavadores = await obtenerDatos("lavadores");
        // console.log(lavadores); 

        // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no hay lavadores creados se redirige a la pagina donde se agregan nuevos lavadores a a base de datos.
        if(lavadores.code == 404) cargarVistaCrear();

        // Recorro los lavadores obtenidos
        lavadores.data.forEach(lavador => {

        // Creo nuevos elementos: Una fila y todas su celdas o campos.
        const fila = document.createElement('tr');
        const celdaId = document.createElement("td");
        const celdaNombre = document.createElement("td");
        const celdaCedula = document.createElement("td");
        const celdaAcciones = document.createElement("td");

        // Le agrego una clase a la fila.
        fila.classList.add("table__row");

        // Le agrego a la fila el atributo que contiene el id de la tupla.
        fila.setAttribute("data-id", lavador.codigo_lavador)

        // Declaro y asigno a una variable un arreglo con las celdas de la fila
        const celdas = [celdaId, celdaNombre, celdaAcciones, celdaCedula];

        // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
        celdas.forEach (celda => {
            celda.classList.add("table__cell");
        })

        // Agrego clase diferente a la celda de acciones.
        celdaAcciones.classList.add("table__cell--separate");

        // Agrego a las celdas el contenido correspondiente.
        celdaId.textContent = lavador.codigo_lavador;
        celdaNombre.textContent = lavador.nombre;
        celdaCedula.textContent = lavador.cedula;

        // Creo el boton de editar con sus clases y atributos y sus nodos hijos y los agrego.
        const botonEditar = document.createElement("button");
        botonEditar.classList.add("table__button");
        botonEditar.setAttribute("data-id", lavador.codigo_lavador)
        const iconoEditar = document.createElement("i");
        iconoEditar.classList.add("ri-edit-2-line");
        botonEditar.append(iconoEditar);

        // Creo el boton de eliminar con sus clases y atributos y sus nodos hijos y los agrego.
        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("table__button", "table__button--delete");
        botonEliminar.setAttribute("data-id", lavador.codigo_lavador)
        const iconoEliminar = document.createElement("i");
        iconoEliminar.classList.add("ri-delete-bin-2-fill");
        botonEliminar.append(iconoEliminar);

        // Agrego eventos a los botones
        botonEditar.addEventListener("click", async () => {
            const alerta = await confirmAlert("¿Desea actualizar el lavador?");

            // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
            if(alerta.isConfirmed){
                const idEditar = botonEditar.getAttribute("data-id");
                window.location.href = `#/lavadores/editar/id=${idEditar}`;
            }
        })

        // Le agrego al boton eliminar el evento click en el cual se valida si se quiere eliminar el lavador
        botonEliminar.addEventListener("click", async () => {
            const alerta = await confirmAlert("¿Está seguro de eliminar el lavador?");

            // Si es confirmada la aleta entonces se obtiene el id del atributo almacenado en el boton...
            if(alerta.isConfirmed){
                const idEliminar = botonEliminar.getAttribute("data-id");
                // Y se llama a la función que elimina el lavador enviando como argumento el id a eliminar.
                eliminarLavador(idEliminar);
            }
            
        })

        // Agrego los botones a la celda de acciones.
        celdaAcciones.append(botonEditar, botonEliminar);

        // Agrego las celdas a la fila
        fila.append(celdaId, celdaNombre, celdaCedula, celdaAcciones);

        // Por ultimo agrego la fila al contenedor
        contendor.append(fila);
        })
    } catch (error) {
        // Muestro el error en la consola.
        console.log(error);
    }
}

// Funcion para borrar de la base de datos el id y para eliminar la tupla en la tabla.
async function eliminarLavador(id) {
    // Se realiza la peticion para obtener lavados por el id o codigo del lavador.
    const lavadoExist = await obtenerDatos(`lavados/lavador/${id}`);

    // Si el codigo de respuesta de la peticion es 200. Es decir, existe un lavado con ese lavador relacionado.
    if(lavadoExist.code == 200){
        // Muestro mensaje de error ya que no se puede eliminar ese lavador y retorno.
        errorAlert("¡Ups! No se puede eliminar el lavador", "Este lavador ya pertenece a un lavado");
        return;
    }

    // Se realiza la peticion para eliminar el lavador por el id.
    const peticion = await eliminarDato("lavadores", id);
    // Si el codigo de la respuesta el 200. Es decir, el lavador ya se eliminó de la base de datos...
    if (peticion.code == 200) {
        // Obtengo la fila con el id del registro que se eliminó y la remuevo de la tabla.
        const fila = document.querySelector(`[data-id = "${id}"]`)
        fila.remove();
        // Por ultimo muestro una alerta de exito indicando que el lavador se eliminó.
        successAlert("Lavador eliminado correctamente");
    }
}

// Funcion para cargar los lavadores en el elemento correspondiente
async function cargarVistaCrear(){
    window.location.href = "#/lavadores/crear";
}