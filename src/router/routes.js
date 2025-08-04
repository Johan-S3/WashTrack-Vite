import { loginController } from '../views/auth/login/loginController.js'
import { registroController } from '../views/auth/register/registroController.js'
import { inicioController } from '../views/inicio/inicioController.js'
import { actualizarLavadorController } from '../views/lavadores/actualizar/actualizarLavadoController.js'
import { crearLavadoresController } from '../views/lavadores/crear/crearLavadoresController.js'
import { lavadoresController } from '../views/lavadores/listar/lavadoresController.js'
import { actualizarTipoLavadoController } from '../views/tipolavados/actualizar/actualizarTipoLavadoController.js'
import { crearTipoLavadoController } from '../views/tipolavados/crear/crearTipoLavadoController.js'
import { tipoLavadosController } from '../views/tipolavados/listar/tipoLavadosController.js'
import { actualizarVehiculoControllador } from '../views/vehiculo/actualizar/actualizarVehiculoController.js'
import { crearVehiculoControllador } from '../views/vehiculo/crear/crearVehiculoController.js'


export const routes = {
  // Ruta simple
  login:{    
    path: "auth/login/index.html",
    controlador: loginController,
    private: false
  },
  register:{    
    path: "auth/register/index.html",
    controlador: registroController,
    private: false
  },
  inicio:{    
    path: "inicio/index.html",
    controlador: inicioController,
    private: false
  },
  // Grupo de rutas
  lavadores:{    
    "/":{
      path: `lavadores/listar/index.html`,
      controlador: lavadoresController,
      private: false
    },
    crear: {    
      path: `lavadores/crear/index.html`,
      controlador: crearLavadoresController,
      private: false
    },
    editar: {
      path: `lavadores/actualizar/index.html`,
      controlador: actualizarLavadorController,
      private: false
    }
  },
  tipolavados: {
    "/":{
      path: `tipolavados/listar/index.html`,
      controlador: tipoLavadosController,
      private: false
    },
    crear: {    
      path: `tipolavados/crear/index.html`,
      controlador: crearTipoLavadoController,
      private: false
    },
    editar: {
      path: `tipolavados/actualizar/index.html`,
      controlador: actualizarTipoLavadoController,
      private: false
    }
  },
  vehiculo:{    
    crear: {    
      path: `vehiculo/crear/index.html`,
      controlador: crearVehiculoControllador,
      private: false
    },
    editar: {    
      path: `vehiculo/actualizar/index.html`,
      controlador: actualizarVehiculoControllador,
      private: false
    }
  },
  pago:{    
    path: "pago/index.html",
    controlador: "No",
    private: false
  },
  asignarLavado:{    
    path: "asignarLavado/index.html",
    controlador: "No",
    private: false
  },
}