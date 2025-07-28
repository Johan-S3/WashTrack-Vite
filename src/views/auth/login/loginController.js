/* ------------------ IMPORTACIONES ------------------  */
// Realizo todas las importaciones correspondientes de las funciones necesarias.
import { errorAlert, successAlert } from "../../../helpers/alertas.js";
import { limitar, outFocus, validarCaracteres, validarCorreo, validarFormulario, validarLetras, validarNumeros } from "../../../helpers/module.js";
import { crearDato } from "../../../helpers/peticiones.js";

export const loginController = async (parametros = null) => {
  // Limpio el localStorage
  localStorage.clear();
  
  /* ------------------ VARIABLES ------------------  */
  
  // Obtengo la referencia del formulario por el ID
  const formLogin = document.getElementById("form-Login");
  
  // Obtengo la referencia de las entradas de texto y de seleccion del formulario por su name
  const cedula = formLogin.querySelector('input[name="documento"]');
  const contrasena = formLogin.querySelector('input[name="contrasenia"]');
  
  /* ------------------ EVENTOS ------------------  */

  // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
  cedula.addEventListener('keydown', validarNumeros);
  contrasena.addEventListener('keydown', validarCaracteres);

  // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
  cedula.addEventListener("keypress", (e) => limitar(e, 10)); 
  contrasena.addEventListener("keypress", (e) => limitar(e, 50)); 

  // Declaro y defino un arreglo con los campos del formulario.
  const campos = [cedula, contrasena];

  // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
  campos.forEach(campo => {
    campo.addEventListener("blur", outFocus);
  });

  // Al formualrio le agrego el evento submit
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault(); //Se previene el envio del formulario.

    // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
    if (!validarFormulario(e)) return;
    
    // Creo un objeto con los valores agregados en el formualrio.
    const usuario = {
        cedula: cedula.value,
        contrasena: contrasena.value,
    }  

    // Try..catch para poder ver el error.
    try {
      // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta.
      const respuesta = await crearDato("usuarios/login", usuario);

      // Si la petición NO se realizó con exito...
      if(!respuesta.success){
        let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
        if(Array.isArray(respuesta.errors)) error = respuesta.errors[0]; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
        else error = respuesta.errors //Si no es un arreglo solo alamceno el error obtenido en la varaible.

        // Por ultimo muestro el error en una alerta y retorno para no seguir.
        await errorAlert(respuesta.message, error);
        return
      }
      
      // Destructuro el objeto de los datos obtenido en la respuesta.
      let {data} = respuesta;
      
      // Guardo los datos en el localStorage
      localStorage.setItem("usuario", JSON.stringify(data));

      // Si la peticion se realizó con exito muestro una alerta informando y la alamaceno en una variable.
      const alerta = await successAlert(`Bienvenido ${data.nombre}`, respuesta.message);
      // Si la alerta es confirmado. Es decir, se di "Ok" en ellas
      if(alerta.isConfirmed){
        // Reseteo los campos del formulario y se dirige a la vista de login
        formLogin.reset();
        window.location.href = '#/inicio';
      }
    } catch (error) {
      // Imprimo en la consola el error obtenido
      console.error(error);
    }
  })
}


