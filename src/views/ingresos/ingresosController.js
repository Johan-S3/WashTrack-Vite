import { obtenerDatos } from "../../helpers/peticiones";

export const ingresosController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    // Obtengo los elementos donde va el nombre el usuario y su rol por su clase
    const nameUser = document.querySelector(".header__nameUser");
    const rolUser = document.querySelector(".header__nameRol");

    // Obtengo el selector donde se pondra el total de ingresos
    const ingresoD = document.querySelector("#ingresos");

    // Recibo los datos del usuario del localStorage
    const datosUsuario = JSON.parse(localStorage.getItem("usuario"));
    // console.log(datosUsuario);
    // En una variable almaceno los datos de la respuesta de hacer fetch a la ruta que me consulta un rol por ID.
    const { data } = await obtenerDatos(`roles/${datosUsuario.codigo_rol}`);
    // console.log(data);

    // Le asigno el contenido correspondiente a los selectores del nombre del usuario logeado y su rol.
    nameUser.textContent = datosUsuario.nombre;
    rolUser.textContent = data.nombre_rol;

    // Obtengo el cuerpo de la tabla donde se agragaran los registros encontrados.
    const bodyTable = document.querySelector(".table__body");

    // Llamo la funcion donde se carga los facturas en el contenedor correspondiente y lo asigno a una variable ya que retorna el total de ingresos diarios.
    let totalIng = await cargarIngresos(bodyTable);
    
    console.log(totalIng);
    ingresoD.textContent = totalIng;


    /* ------------------ EVENTOS ------------------  */
}


/* ------------------ FUNCIONES ------------------  */

// Funcion para cargar los facturas en el elemento correspondiente
async function cargarIngresos(contendor) {
    try {
        // Asigno en una variable la respuesta de la peticion de los facturas
        const facturas = await obtenerDatos("facturas");
        // console.log(facturas);

        // Si el codigo obtenido de la petición es 404 (Recurso no encontrado). Es decir, no hay facturas creados retorna.
        if (facturas.code == 404) return;

        let totalIngresos = 0;

        // Recorro los facturas obtenidos
        facturas.data.forEach(async (factura) => {
            console.log(factura);

            // Obtengo la fecha actual del sistema en formato "YYYY-MM-DD" (por ejemplo: "2025-08-05")
            const hoy = new Date().toLocaleDateString("en-CA"); // Hoy: "2025-08-05"

            // Convierto el timestamp recibido (en milisegundos) a una fecha con formato "YYYY-MM-DD"
            const fechaFactura = new Date(factura.fecha).toLocaleDateString("en-CA");

            if(fechaFactura != hoy) return;
            
            // Creo nuevos elementos: Una fila y todas su celdas o campos.
            const fila = document.createElement('tr');
            const celdaId = document.createElement("td");
            const celdaSubtotal = document.createElement("td");
            const celdaTotal = document.createElement("td");

            // Le agrego una clase a la fila.
            fila.classList.add("table__row");

            // Le agrego a la fila el atributo que contiene el id de la tupla.
            fila.setAttribute("data-id", factura.id_factura)

            // Declaro y asigno a una variable un arreglo con las celdas de la fila
            const celdas = [celdaId, celdaSubtotal, celdaTotal];

            // Recorro el arreglo de las celdas para asignarles la misma clase a todas.
            celdas.forEach(celda => {
                celda.classList.add("table__cell");
            })

            // Agrego a las celdas el contenido correspondiente.
            celdaId.textContent = factura.id_factura;
            celdaSubtotal.textContent = `$ ${factura.subtotal}`;
            celdaTotal.textContent =  `$ ${factura.total}`;

            totalIngresos += factura.total;

            // Agrego las celdas a la fila
            fila.append(celdaId, celdaSubtotal, celdaTotal);

            // Por ultimo agrego la fila al contenedor
            contendor.append(fila);

        })
        return totalIngresos;
    } catch (error) {
        // Muestro el error en la consola.
        console.log(error);
    }
}