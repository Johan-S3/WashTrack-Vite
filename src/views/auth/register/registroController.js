/* ------------------ IMPORTACIONES ------------------  */
// Realizo todas las importaciones correspondientes de las funciones necesarias.
import { errorAlert, successAlert } from "../../../helpers/alertas.js";
import { limitar, outFocus, validarCaracteres, validarCorreo, validarFormulario, validarLetras, validarNumeros } from "../../../helpers/module.js";
import { crearDato, obtenerDatos } from "../../../helpers/peticiones.js";


export const registroController = async (parametros = null) => {
  /* ------------------ VARIABLES ------------------  */
  
  // Obtengo la referencia del formulario por el ID
  const formRegistro = document.getElementById("form-Registro");
  
  // Obtengo la referencia de las entradas de texto y de seleccion del formulario por su name
  const cedula = formRegistro.querySelector('input[name="cedula"]');
  const nombre = formRegistro.querySelector('input[name="nombre"]');
  const correo = formRegistro.querySelector('input[name="correo"]');
  const telefono = formRegistro.querySelector('input[name="telefono"]');
  const selectRol = formRegistro.querySelector('select[name="rol"]');
  const contrasena = formRegistro.querySelector('input[name="contrasenia"]');
  
  /* ------------------ EVENTOS ------------------  */
  // Agrego evento para cargar los roles en el select
  document.addEventListener("DOMContentLoaded", cargarRoles());

  // Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
  cedula.addEventListener('keydown', validarNumeros);
  nombre.addEventListener('keydown', validarLetras);
  telefono.addEventListener('keydown', validarNumeros);
  contrasena.addEventListener('keydown', validarCaracteres);

  // Agrego eventos que maneja la validación de caracteres ingresados en los campos.
  cedula.addEventListener("keypress", (e) => limitar(e, 10)); 
  nombre.addEventListener("keypress", (e) => limitar(e, 40)); 
  telefono.addEventListener("keypress", (e) => limitar(e, 10)); 
  correo.addEventListener("keypress", (e) => limitar(e, 50)); 
  contrasena.addEventListener("keypress", (e) => limitar(e, 50)); 

  // Declaro y defino un arreglo con los campos del formulario.
  const campos = [cedula, nombre, correo, telefono, selectRol, contrasena];

  // Recorro el arreglo para agregar evento a cada campo: al momento de perder el enfoque se ejecuta el metodo outFocus.
  campos.forEach(campo => {
    campo.addEventListener("blur", outFocus);
  });

  // Al formualrio le agrego el evento submit
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault(); //Se previene el envio del formulario.

    // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
    if (!validarFormulario(e)) return;

    // VALIDAR FORMATO DEL CORREO
    if (!validarCorreo(correo.value)) {
      // Si el correo tiene otro elemento hermano lo remuevo
      if (correo.nextElementSibling) correo.nextElementSibling.remove();
      // Le agrego una clase al el selector del correo
      correo.classList.add("form__input--empty");

      // Creo un elemento donde se mostrará el mensaje
      const mensaje = document.createElement("span");
      // Le doy una clase al elemento creado
      mensaje.classList.add("form__mensaje");
      // Le agrego un contenido en forma de texto
      mensaje.textContent = "Ingrese un correo válido.";
      // Y lo inserto despues de la entrada de texto
      correo.insertAdjacentElement("afterend", mensaje);
      
      return; //Por ultimo retorno
    }
    
    // Creo un objeto con los valores agregados en el formualrio.
    const usuario = {
        cedula: cedula.value,
        nombre: nombre.value,
        correo: correo.value,
        contrasena: contrasena.value,
        telefono: telefono.value,
        codigo_rol: selectRol.value
    }  

    // Try..catch para poder ver el error.
    try {
      // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta.
      const respuesta = await crearDato("usuarios", usuario);  
      
      // Si la petición NO se realizó con exito...
      if(!respuesta.success){
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
        // Reseteo los campos del formulario y se dirige a la vista de login
        formRegistro.reset();
        window.location.href = '#/login';
      }
    } catch (error) {
      // Imprimo en la consola el error obtenido
      console.error(error);
    }
  })


  /* ------------------ FUNCIONES ------------------  */
  
  // Funcion para cargar los roles en el la etiqueta option correspondiente
  async function cargarRoles(){
    // Asigno en una variable la respues de la peticion de los roles
    const rolesExistentes = await obtenerDatos("roles");
    // console.log(rolesExistentes);
    
    // Recorro los roles obtenido
    rolesExistentes.data.forEach(rol => {
      // Creo un nuevo elemento option le doy el value que es el id del rol y le agrego contenido que es el nombre del rol
      const option = document.createElement('option');
      option.setAttribute("value", rol.codigo_rol);
      option.textContent = rol.nombre_rol;
      
      // Por ultimo agrego el rol al option correspondiente. 
      selectRol.append(option);
    });
  }
}


