import { loginController } from '../views/auth/login/loginController.js'
import { ingresosController } from '../views/ingresos/ingresosController.js'
import { inicioController } from '../views/inicio/inicioController.js'
import { actualizarLavadorController } from '../views/lavadores/actualizar/actualizarLavadoController.js'
import { crearLavadoresController } from '../views/lavadores/crear/crearLavadoresController.js'
import { lavadoresController } from '../views/lavadores/listar/lavadoresController.js'
import { actualizarLavadoController } from '../views/lavados/actualizar/actualizarLavadoController.js'
import { crearLavadoController } from '../views/lavados/crear/crearLavadoController.js'
import { pagoController } from '../views/pago/pagoController.js'
import { actualizarTipoLavadoController } from '../views/tipolavados/actualizar/actualizarTipoLavadoController.js'
import { crearTipoLavadoController } from '../views/tipolavados/crear/crearTipoLavadoController.js'
import { tipoLavadosController } from '../views/tipolavados/listar/tipoLavadosController.js'
import { actualizarUsuariosController } from '../views/usuarios/actualizar/actualizarUsuariosController.js'
import { crearUsuariosController } from '../views/usuarios/crear/crearUsuariosController.js'
import { usuariosController } from '../views/usuarios/listar/usuariosController.js'
import { actualizarVehiculoController } from '../views/vehiculo/actualizar/actualizarVehiculoController.js'
import { registrarVehiculoExistenteController } from '../views/vehiculo/actualizar/registrarVehiculoExistenteController.js'
import { crearVehiculoController } from '../views/vehiculo/crear/crearVehiculoController.js'


export const routes = {
  // Ruta simple
  login:{    
    path: "auth/login/index.html",
    controlador: loginController,
    private: false
  },
  inicio:{    
    path: "inicio/index.html",
    controlador: inicioController,
    private: false
  },
  ingresos:{    
    path: "ingresos/index.html",
    controlador: ingresosController,
    private: false
  },
  // Grupo de rutas
  usuarios:{    
    "/":{
      path: `usuarios/listar/index.html`,
      controlador: usuariosController,
      private: false
    },
    crear: {    
      path: `usuarios/crear/index.html`,
      controlador: crearUsuariosController,
      private: false
    },
    editar: {
      path: `usuarios/actualizar/index.html`,
      controlador: actualizarUsuariosController,
      private: false
    }
  },
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
      controlador: crearVehiculoController,
      private: false
    },
    registrar: {    
      path: `vehiculo/actualizar/index.html`,
      controlador: registrarVehiculoExistenteController,
      private: false
    },
    editar: {    
      path: `vehiculo/actualizar/index.html`,
      controlador: actualizarVehiculoController,
      private: false
    }
  },
  lavados:{
    crear:{
      path: `lavados/crear/index.html`,
      controlador: crearLavadoController,
      private: false
    },
    editar: {    
      path: `lavados/actualizar/index.html`,
      controlador: actualizarLavadoController,
      private: false
    }
  },
  pago:{    
    crear: {
      path: "pago/index.html",
      controlador: pagoController,
      private: false
    }
  }
}