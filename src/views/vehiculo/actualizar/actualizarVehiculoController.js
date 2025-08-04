import { obtenerDatos } from "../../../helpers/peticiones";

export const actualizarVehiculoControllador = async (parametros = null) => {

    const placaVeh = document.querySelector('input[name="placa"]');
    const marca = document.querySelector('input[name="marca"]');
    const modelo = document.querySelector('input[name="modelo"]');
    const tipoVeh = document.querySelector('select[name="type"]');

    const {placa} = parametros;

    const vehiculo = await obtenerDatos(`vehiculos/placa/${placa}`);

    placaVeh.disabled = true;;
    placaVeh.value = vehiculo.data.placa;
}