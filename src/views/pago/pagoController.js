import { errorAlert, successAlert } from "../../helpers/alertas";
import { generarFactura } from "../../helpers/generarFactura";
import { limitar, outFocus, validarFormulario, validarNumeros } from "../../helpers/module";
import { crearDato, editarDato, obtenerDatos } from "../../helpers/peticiones";

export const pagoController = async (parametros = null) => {
    /* ------------------ VARIABLES ------------------  */

    const { id } = parametros;

    // Obtengo la referencia del formulario por el ID
    const formRegistro = document.getElementById("form-Registro");

    // Obtengo la referencia de las entradas de texto del formulario por su name
    const placa = formRegistro.querySelector('input[name="placa"]');
    const valorLav = formRegistro.querySelector('input[name="valor"]');
    const iva = formRegistro.querySelector('input[name="iva"]');
    const descuento = formRegistro.querySelector('input[name="descuento"]');
    const total = formRegistro.querySelector('input[name="total"]');
    const recibido = formRegistro.querySelector('input[name="recibido"]');
    const cambio = formRegistro.querySelector('input[name="cambio"]');

    // Declaro e inicilizo un objeto vacio para agregar los valoores necesarios para calcular y luego crear la factura.
    let objetoValores = {};

    // Obtengo los datos del lavado.
    const lavado = await obtenerDatos(`lavados/id/${id}`);
    // console.log(lavado); 

    // Obtengo el tipo de lavado.
    const tipoLavado = await obtenerDatos(`tipolavados/${lavado.data.codigo_tipo_lavado}`);
    objetoValores.valor = tipoLavado.data.valor; //Agrego el valor del lavado al objeto.
    // console.log(tipoLavado); 

    // Obtngo el ingreso.
    const ingreso = await obtenerDatos(`detallesingreso/id/${lavado.data.id_registro}`);
    console.log(ingreso);

    // Obtengo el servicio que presta el vehiculo en ese ingreso.
    const servicioVeh = await obtenerDatos(`serviciosvehiculos/${ingreso.data.codigo_servicio}`);
    // console.log(servicioVeh);
    objetoValores.porcDesc = servicioVeh.data.porcentaje_descuento;

    // Obtengo el vehiculo registrado en ese ingreso en ese ingreso.
    const vehiculo = await obtenerDatos(`vehiculos/id/${ingreso.data.id_vehiculo}`);
    // console.log(vehiculo);
    objetoValores.placa = vehiculo.data.placa;


    // Agrego nuevas propiedades al objeto las cuales tienen como valor los calculos correspondientes.
    objetoValores.descuentoFactura = objetoValores.valor * (objetoValores.porcDesc / 100);
    objetoValores.subtotal = objetoValores.valor;
    objetoValores.totalFactura = objetoValores.subtotal - objetoValores.descuentoFactura;

    // Le asigno a las entradas de texto el valor corresppondiente.
    placa.value = objetoValores.placa;
    valorLav.value = objetoValores.subtotal;
    descuento.value = objetoValores.descuentoFactura;
    total.value = objetoValores.totalFactura;

    /* ------------------ EVENTOS ------------------  */
    // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
    recibido.addEventListener('keydown', validarNumeros);

    // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
    recibido.addEventListener("keypress", (e) => limitar(e, 7));

    // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
    recibido.addEventListener("blur", outFocus);

    // Agrego evento a la entrada de texto recibido la cual a medida que escribe realiza un calculo y realiza una accion.
    recibido.addEventListener("input", () => {
        let cambioDinero = parseInt(recibido.value) - parseInt(total.value);
        if(cambioDinero > 0) cambio.value = cambioDinero;
        else cambio.value = "";
    });

    // Al formualrio le agrego el evento submit
    formRegistro.addEventListener("submit", async (e) => {
        e.preventDefault(); //Se previene el envio del formulario.

        // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
        if (!validarFormulario(e)) return;

        // Creo un objeto con los valores quye se guardaran en la base de datos.
        const factura = {
            id_lavado: id,
            subtotal: parseInt(valorLav.value),
            total: parseInt(total.value)
        }

        // Si el total de la factura es mayor al valor ingresado en el dinero recibido muestra mensaje de error y retorna para no seguir ejecutando el codigo.
        if(factura.total > parseInt(recibido.value)){
            await errorAlert("Ups, !verifica el dinero que recibiste¡", "El valor recibido no puede ser menor al total de la factura");
            return;
        }

        // Try..catch para poder ver el error.
        try {
            // En una variable almaceno la respuesta de hacer fetch a la ruta que crear el tipo de lavado.
            const respuesta = await crearDato("facturas", factura);

            // Si la petición NO se realizó con exito...
            if (respuesta.code != 201) {
                mostrarErrores(respuesta);
                return;
            }

            // En una variable almaceno la respuesta de hacer fetch a la ruta que actualiza el estado del ingreso.
            const estadoActualizado = await editarDato(`detallesingreso/estado`, ingreso.data.id_registro, { estado: "facturado" });

            // Si la petición NO se realizó con exito...
            if (estadoActualizado.code != 200) {
                mostrarErrores(estadoActualizado);
                return;
            }

            // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
            const alerta = await successAlert(respuesta.message);
            // Si la alerta es confirmado. Es decir, se di "Ok" en ellas
            // await generarFactura(respuesta.data);
            if (alerta.isConfirmed) {
                // Reseteo los campos del formulario y se dirige a la vista de tipos de lavados
                formRegistro.reset();
                window.location.href = '#/inicio';
            }
        } catch (error) {
            // Imprimo en la consola el error obtenido
            console.error(error);
        }
    })
}

// Funcion que me muestras los errores de una peticion recibiendo la peticion como parametro.
async function mostrarErrores(peticion) {
    let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
    if (Array.isArray(peticion.errors)) error = peticion.errors[0]; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
    else error = peticion.errors //Si no es un arreglo solo alamceno el error obtenido en la varaible.
    // Por ultimo muestro el error en una alerta y retorno para no seguir.
    await errorAlert(peticion.message, error);
}