import { loginController } from '../views/auth/login/loginController.js'
import { registroController } from '../views/auth/register/registroController.js'
import { inicioController } from '../views/inicio/inicioController.js'
import { tipoLavadosController } from '../views/lavados/listar/tipoLavadosController.js'


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
      controlador: "No",
      private: false
    },
    crear: {    
      path: `lavadores/crear/index.html`,
      controlador: "no",
      private: false
    },
  },
  lavados: {
    "/":{
      path: `lavados/listar/index.html`,
      controlador: tipoLavadosController,
      private: false
    },
    crear: {    
      path: `lavados/crear/index.html`,
      controlador: "no",
      private: false
    },
    Editar: {
      path: `Categorias/Editar/index.html`,
      controlador: "no",
      private: false
    }
  },

  pago:{    
    path: "pago/index.html",
    controlador: "No",
    private: false
  },
  vehiculo:{    
    path: "vehiculo/index.html",
    controlador: "No",
    private: false
  },
  asignarLavado:{    
    path: "asignarLavado/index.html",
    controlador: "No",
    private: false
  },
}