import Swal from 'sweetalert2';

export const successAlert = (titulo, texto) => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: "success",
    draggable: true,
    backdrop: false,             // Desactiva el fondo oscuro
    allowOutsideClick: false,     // No se cierra al hacer clic fuera
    // showClass: {
    //   popup: 'swal2-show',
    //   backdrop: 'swal2-backdrop-show',
    //   icon: 'swal2-icon-show'
    // }
  })
}

export const errorAlert = (titulo, texto) => {
  return Swal.fire({
          title: titulo,
          text: texto,
          icon: "error",
          backdrop: false,             // Desactiva el fondo oscuro
          allowOutsideClick: false     // No se cierra al hacer clic fuera
        });
}

export const infoAlert = (titulo, texto) => {
  return Swal.fire({
          title: titulo,
          text: texto,
          icon: "info",
          backdrop: false,             // Desactiva el fondo oscuro
          allowOutsideClick: false     // No se cierra al hacer clic fuera
        });
}

export const confirmAlert = async (titulo, texto) => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, seguro",
    cancelButtonText: "No, cancelar"
  })
}