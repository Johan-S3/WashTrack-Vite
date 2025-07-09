// Importo los meotdos que se necesitan.
import { objeto, outFocus, validarCaracteres, validarFormulario, validarLetras, validarNumeros } from "../../helpers/module.js";

// Obtengo la referencia del formulario por el ID
const formRegistro = document.getElementById("form-Registro");

// Obtengo la referencia de los inputs del formulario por su name
const cedula = formRegistro.querySelector('input[name="cedula"]');
const nombre = formRegistro.querySelector('input[name="nombre"]');
const correo = formRegistro.querySelector('input[name="correo"]');
const telefono = formRegistro.querySelector('input[name="telefono"]');
const rol = formRegistro.querySelector('select[name="rol"]');
const contrasena = formRegistro.querySelector('input[name="contrasenia"]');

// Agrego eventos para permitir solo la entradas de numeros, letras y caracteres a los campos correspondientemente.
cedula.addEventListener('keydown', validarNumeros);
nombre.addEventListener('keydown', validarLetras);
telefono.addEventListener('keydown', validarNumeros);
contrasena.addEventListener('keydown', validarCaracteres);

// Declaro y defino un arreglo con los campos del formualrio.
const campos = [cedula, nombre, correo, telefono, rol, contrasena];

// Recorro el arreglo para agregar evento a cada campo; al momento de perder el enfoque se ejecuta el metodo outFocus.
campos.forEach(campo => {
  campo.addEventListener("blur", outFocus);
});

// Al formualrio le agrego el evento submit
formRegistro.addEventListener("submit", async (e) => {
  e.preventDefault(); //Se previene el envio del formulario.

  // Si el metodo validar formualrio retorna falso entonces retorna y no se hace nada.
  if (!validarFormulario(e)) return;
  

  // Creo un objeto con los valores agregados en el formualrio.
  const usuario = {
      cedula: cedula.value,
      nombre: nombre.value,
      correo: correo.value,
      telefono: telefono.value,
      // rol: rol.value,
      contrasena: contrasena.value
  }

  console.log(usuario); //Imprimo el objeto por consola
  
  // Si alguno de los campos está vacio solicito ingresar todos los campos
  if (!usuario.cedula || !usuario.nombre || !usuario.correo || !usuario.telefono || !usuario.contrasena) {
      alert('Por favor completa todos los campos');
      return;
  }

  // Try..catch para poder ver ele error.
  try {
    // En una variable almaceno la respuesta de hacer fetch a la ruta que me consulta.
    const respuesta = await fetch('http://localhost:8080/proyecto/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    
    // Si la respuesta no está ok entonces muestra alerta y retorna.
    if (respuesta.ok) {
      alert('Registro exitoso. Ya puedes iniciar sesión.');
      formRegistro.reset();
      window.location.href = 'index.html';
    } else {
      const objeto = await respuesta.json();
      alert(objeto.message + "\n\n" + objeto.errors);
      }
  } catch (error) {
    alert(objeto.message + "\nError: \n" + objeto.errors);
    // console.error(error);
  }
})