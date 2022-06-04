import { db,storage,firebase } from "src/boot/firebase"
import {mapState,mapMutations,mapActions} from 'vuex'
export default {
    data(){
        return {
            data:[],
            statusperfil:[
               1,0
                ],
            listaescuelas:[],
            grupos:["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            grados:["","1","2","3","4","5","6","7","8","9","10","11","12","13"],
            nivel:["","KINDER","PREESCOLAR","PRIMARIA","SECUNDARIA","BACHILLERA","TECNICA","LICENCIATURA","MAESTRIA","DOCTORADO"],
            columns:[
                {
                    name:"iddoc",
                    label:"Iddoc",
                    field: 'iddoc',
                    sortable: true
                   
                },
                {
                    name:"nombre",
                    label:"Nombre",
                    field: 'nombre',
                    sortable: true
                  
                },
                {
                    name:"correo",
                    label:"Correo",
                    field: 'correo',
                    sortable: true
                  
                },
                {
                    name:"Grupo Ub",
                    label:"grupoUB",
                    field: 'grupoUB',
                    sortable: true
                  
                },
                {
                    name:"tipo",
                    label:"Tipo",
                    field: 'tipo',
                    sortable: true
                  
                },
                {
                    name:"escuela",
                    label:"Escuela",
                    field: 'escuela',
                    sortable: true
                   
                },
                
               
            ],
            filter:"",
            addescuela:false,
            maximizedToggle:true,
            model:null,
            altaEsc:{},
            editarescuela:false,
            dataeditescuela:[],
            busqueda:{},
            tipos:["Alumno","Profesor","Admin","Sistem"],
            addusuario:false,
            reguser:{},
            error:[],
            addGrupos:{},
            addGruposDialog:false
        }
        
    },
    methods:{
        ...mapActions(['validases']),
       async GuardarGrupo(){
           
            if(!this.dataeditescuela.grupos){ this.dataeditescuela.grupos=[] }
           
            this.addGrupos.idGrupo=this.addGrupos.grado+"-"+this.addGrupos.grupo+"-"+this.addGrupos.nivel+"-"+this.addGrupos.escuela
           
            this.dataeditescuela.grupos.push(this.addGrupos)
            console.log(this.dataeditescuela)
           await db.collection('user')
           .doc(this.dataeditescuela.iddoc)
           .update(this.dataeditescuela)

           .then((res)=>{
            console.log(res)
            this.addGruposDialog=false
            this.addGrupos={}
           })

        },
        genGrupoUB(){
            this.dataeditescuela.grupoUB=this.dataeditescuela.grado+"-"+this.dataeditescuela.grupo+"-"+this.dataeditescuela.nivel+"-"+this.dataeditescuela.escuela
        },
       async deleteGrupo(key){
            var select=this.dataeditescuela.grupos.indexOf(key)
            this.dataeditescuela.grupos.splice(select,1)
            console.log(this.dataeditescuela)
            await db.collection('user')
            .doc(this.dataeditescuela.iddoc)
            .update(this.dataeditescuela)
 
            .then((res)=>{
             console.log(res)
            })
        },
        eliminarUsuario(){
            if(confirm('¿Deseas eliminar al usuario?')){
                db.collection('user').doc(this.dataeditescuela.iddoc).delete()
                this.buscarlista()
                this.editarescuela=false
                this.dataeditescuela={}
            }
        },
       async crearUsuario(){
            await  firebase.auth().createUserWithEmailAndPassword(this.reguser.correo,this.reguser.password)
                .then((data)=>{
                  this.reguser.uid=data.user.uid
                  this.reguser.cemail=data.user.emailVerified
                   db.collection('user').add(this.reguser);
                    this.addusuario=false
                })
                .catch((error)=>{
                  this.error.push('El correo ya esta registrado')
                  console.error(e)
                  var errorCode = error.code 
                  var errorMessage = error.message
                })
        },
        buscarlista(){
            this.data=[]
            switch(this.busqueda.tipo){
                case 'Alumno':
                    if(this.busqueda.escuela && this.busqueda.grado && this.busqueda.grupo && this.busqueda.nivel){
                    db.collection('user')
                    .where('tipo','==','Alumno')
                    .where('escuela','==',this.busqueda.escuela) 
                    .where('grado','==',this.busqueda.grado)
                    .where('grupo','==',this.busqueda.grupo)
                    .where('nivel','==',this.busqueda.nivel)
                    .get()
                    .then((esc)=>{
                        esc.forEach((esc)=>{
                            let datosus=esc.data()
                            datosus.iddoc=esc.id
                        this.data.push(datosus)
                        })
                    })
                }else{
                    db.collection('user')
                    .where('tipo','==','Alumno')
                    .where('escuela','==',this.busqueda.escuela) 
                    .get()
                    .then((esc)=>{
                        esc.forEach((esc)=>{
                            let datosus=esc.data()
                            datosus.iddoc=esc.id
                        this.data.push(datosus)
                        })
                    })

                }
            break;

            default:
                    db.collection('user')
                    .where('tipo','==',this.busqueda.tipo)
                    .where('escuela','==',this.busqueda.escuela)
                    .get()
                    .then((esc)=>{
                        esc.forEach((esc)=>{
                            let datosus=esc.data()
                            datosus.iddoc=esc.id
                        this.data.push(datosus)
                        })
                    })
            break;
        }
        },
        editaEscuela(p){
            this.editarescuela=true
            this.dataeditescuela=p.row
           
        },
        async cargaescuelas(){
            await db.collection('escuelas').get()
            .then((escuela)=>{
                escuela.forEach((e)=>{
                    this.listaescuelas.push(e.data().nombre)
                })
                
            
            })

        },
         
       async guardarCambios(){
            await db.collection('user').doc(this.dataeditescuela.iddoc).update(this.dataeditescuela)
            .then((da)=>{
                this.editarescuela=false
                this.cargaescuelas()
            })
        },
        uploadFile(p){
            const storageRef = storage.ref();
            const imageRef = storageRef.child('user/iconos/'+p.name);
            imageRef.put(p)
                .then((p) => {
           
                
                });
  
        }
    },
    mounted(){
        this.cargaescuelas()
    }

}