import {mapState,mapActions} from 'vuex'  
  export default {
    data () {
      return {
        contactos:[],

        cabeceras:[
          {
            name:"nombre",
            label:"nombre",
            field:"nombre"
          },
          {
            name:"escuela",
            label:"escuela",
            field:"escuela"
          }
      ]
      }
    },
    computed:{
      ...mapState(['datosuser','contacts'])
    },
    mounted(){
      this.cargaUsuarios()
    },
    methods:{
    ...mapActions(['tomausuariosProfesor','tomausuariosAlumnos','cerrarconexion']),
    cargaUsuarios()
    {

      switch(this.datosuser.tipo){
        case 'Alumno':
      this.tomausuariosAlumnos(this.datosuser)
     
      break;
      case 'Profesor':
        this.tomausuariosProfesor(this.datosuser)
        break;
      case 'Admin':

        break;
      }
    }
    },
    destroyed(){
      
        this.cerrarconexion()
    },
    watch:{
      contacts(){
        console.log(this.contacts)
          this.contactos=this.contacts
      }
    }
  }