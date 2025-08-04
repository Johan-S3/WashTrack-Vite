import { errorAlert, successAlert } from "../../../helpers/alertas";
import { limitar, outFocus, validarFormulario, validarLetras, validarNumeros } from "../../../helpers/module";
import { crearDato } from "../../../helpers/peticiones";

export const crearLavadoresController = async (parametros = null) => {
/* ------------------ VARIABLES ------------------  */
  
  // Obtengo la referencia del formulario por el ID
  const formRegistro = document.getElementById("form-Registro");
  
  // Obtengo la referencia de las entradas de texto del formulario por su name
  const nombre = formRegistro.querySelector('input[name="nombre"]');
  const cedula = formRegistro.querySelector('input[name="cedula"]');
  
  /* ------------------ EVENTOS ------------------  */
  // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
  nombre.addEventListener('keydown', validarLetras);
  cedula.addEventListener('keydown', validarNumeros);

  // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
  nombre.addEventListener("keypress", (e) => limitar(e, 30)); 
  cedula.addEventListener("keypress", (e) => limitar(e, 10)); 

  // Declaro y defino un arreglo con los campos del formulario.
  const campos = [nombre, cedula];

  // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
  campos.forEach(campo => {
    campo.addEventListener("blur", outFocus);
  });

  // Al formualrio le agrego el evento submit
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault(); //Se previene el envio del formulario.

    // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
    if (!validarFormulario(e)) return;
    
    // Creo un objeto con los valores agregados en el formualrio.
    const lavador = {
        nombre: nombre.value,
        cedula: cedula.value,
    }  

    // Try..catch para poder ver el error.
    try {
      // En una variable almaceno la respuesta de hacer fetch a la ruta que crear el lavador.
      const respuesta = await crearDato("lavadores", lavador); 
      console.log(respuesta);
       
      
      // Si la petición NO se realizó con exito...
      if(respuesta.code != 201){
        let error = null; //Declaro variable error e inicializo en null para luego almacenar el error.
        if(Array.isArray(respuesta.errors)) error = respuesta.errors[0]; //Si lo errores obtenidos de la peticion es un arreglo entonces almaceno en la variable error el primer error del arreglo.
        else error = respuesta.errors //Si no es un arreglo solo alamceno el error obtenido en la varaible.
        // Por ultimo muestro el error en una alerta y retorno para no seguir.
        await errorAlert(respuesta.message, error);
        return;
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