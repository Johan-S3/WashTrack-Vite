import { obtenerDatos } from "../../../helpers/peticiones";


export const tipoLavadosController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    // Obtengo el boton para crear un nuevo tipo de lavado
    const buttonCreate = document.querySelector(".table__button--create");

    // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
    const bodyTable = document.querySelector(".table__body");

    // Llamo la funcion donde se carga los tipos de lavados en el contenedor correspondiente.
    cargarTipoLavados(bodyTable);


    /* ------------------ EVENTOS ------------------  */
    // Agrego evento para cargar las entidades necesarias

    buttonCreate.addEventListener('click', cargarVistaCrear);
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los tipos de lavados en el elemento correspondiente
async function cargarTipoLavados(contendor){
    try {
        // Asigno en una variable la respuesta de la peticion de los tipos de lavados
        const tiposLavados = await obtenerDatos("tipolavados");
        // console.log(tiposLavados);

        // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no hay tipos de lavados creados se le asigna a la variable canCreate el valor de false y se retorna-
        if(tiposLavados.code == 404) window.location.href = "#/lavados/crear";

        // Recorro los tipos de lavados obtenidos
        tiposLavados.data.forEach(tipoLavado => {

        // Creo nuevos elementos: Una fila y todas su celdas o campos.
        const fila = document.createElement('tr');
        const celdaId = document.createElement("td");
        const celdaNombre = document.createElement("td");
        const celdaValor = document.createElement("td");
        const celdaDuracion = document.createElement("td");
        const celdaAcciones = document.createElement("td");

        // Le agrego una clase a la fila.
        fila.classList.add("table__row");

        // Declaro y asigno a una variable un arreglo con las celdas de la fila
        const celdas = [celdaId, celdaNombre, celdaValor, celdaDuracion, celdaAcciones];

        // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
        celdas.forEach (celda => {
            celda.classList.add("table__cell");
        })

        // Agrego clase diferente a la celda de acciones.
        celdaAcciones.classList.add("table__cell--separate");

        // Agrego a las celdas el contenido correspondiente.
        celdaId.textContent = tipoLavado.codigo_tipo_lavado;
        celdaNombre.textContent = tipoLavado.nombre;
        celdaValor.textContent = tipoLavado.valor;
        celdaDuracion.textContent = tipoLavado.duracion_minutos + " minutos";

        // Creo el boton de editar con sus clases y atributos y sus nodos hijos y los agrego.
        const botonEditar = document.createElement("button");
        botonEditar.classList.add("table__button");
        botonEditar.setAttribute("data-id", tipoLavado.codigo_tipo_lavado)
        const iconoEditar = document.createElement("i");
        iconoEditar.classList.add("ri-edit-2-line");
        botonEditar.append(iconoEditar);

        // Creo el boton de eliminar con sus clases y atributos y sus nodos hijos y los agrego.
        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("table__button", "table__button--delete");
        botonEliminar.setAttribute("data-id", tipoLavado.codigo_tipo_lavado)
        const iconoEliminar = document.createElement("i");
        iconoEliminar.classList.add("ri-delete-bin-2-fill");
        botonEliminar.append(iconoEliminar);

        // Agrego eventos a los botones
        botonEditar.addEventListener("click", () => {
            
        })

        // Agrego los botones a la celda de acciones.
        celdaAcciones.append(botonEditar, botonEliminar);

        // Agrego las celdas a la fila
        fila.append(celdaId, celdaNombre, celdaValor, celdaDuracion, celdaAcciones);

        // Por ultimo agrego la fila al contenedor
        contendor.append(fila);
        })
    } catch (error) {
        console.log(error);
    }
}

// Funcion para cargar los tipos de lavados en el elemento correspondiente
async function cargarVistaCrear(){
    window.location.href = "#/lavados/crear";
}