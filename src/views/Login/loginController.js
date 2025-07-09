// Importo los meotdos que se necesitan.
import { outFocus, validarCaracteres, validarFormulario, validarNumeros } from "../../helpers/module.js";

import { errorAlert, successAlert } from "../../helpers/alertas.js";

// Obtengo la referencia del formulario por el ID
const formLogin = document.getElementById('form-Login');
// Obtengo la referencia de cedula y contrasena por el name del input
const cedula = formLogin.querySelector('input[name="documento"]');
const contrasena = formLogin.querySelector('input[name="contrasenia"]');

// Agrego eventos para permitir solo la entradas de numero y caracteres a los campos.
cedula.addEventListener('keydown', validarNumeros);
contrasena.addEventListener('keydown', validarCaracteres);

// Declaro y defino un arreglo con los campos del formualrio.
const campos = [cedula, contrasena];

// Recorro el arreglo para agregar evento a cada campo; al momento de perder el enfoque se ejecuta el metodo outFocus.
campos.forEach(campo => {
  campo.addEventListener("blur", outFocus);
});

// Al formualrio le agrego el evento submit
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault(); //Se previene el envio del formulario.

  // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
  if (!validarFormulario(e)) return;

  // Si no se ha ingresado información en los campos se muestra alerta.
  if (!cedula.value || !contrasena.value) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Try..catch para poder ver ele error.
  try {
    // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta la cedula ingresada-
    const respuesta = await fetch(`http://localhost:8080/proyecto/api/usuarios/${cedula.value}`);

    // En una variable almaceno la respuesta en JSON.
    const objeto = await respuesta.json();
    
    // Si la respuesta no está ok entonces muestra alerta y retorna.
    if (!respuesta.ok) {
      errorAlert(objeto.message, objeto.data)
      return;
    }
    
    // En una varaible almaceno los datos del usuario
    const usuarioData = objeto.data;
    
    // Si el valor ingresado en el campo contrasena es igual a la contraseña del usuario obtenido muestra aleta de bienvenida, resetea el formualrio y redirige a la pagina de incio.
    if (usuarioData.contrasena === contrasena.value) {
      successAlert(`¡Bienvenido, ${usuarioData.nombre}!`, null).then(() => {
        formLogin.reset();
        // window.location.href = '../../../public/Home/inicio.html';
      });      
    } else { //Si no muestra alerta
      errorAlert("Contraseña incorrecta", "Por favor intentelo nuevamente");
    }
  } catch(error) {
    // Muestro mensaje personalizado y el error que se ocacionó.
    alert('Error de red,   inténtalo más tarde.');
    console.error(error);
  }
});