import { db,storage } from "src/boot/firebase"
export default {
    data(){
        return {
            listabla:[],
            escuelas:[],
            escselect:{
                escuela:""
            },
            addgrupo:false,
            creaGrupo:{},
            grupos:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            grados:["1","2","3","4","5","6","7","8","9","10","11","12","13"],
            niveles:["","KINDER","PREESCOLAR","PRIMARIA","SECUNDARIA","BACHILLERA","TECNICA","LICENCIATURA","MAESTRIA","DOCTORADO"],
            columns:[
                {
                    label:"Grado",
                    name:"grado",
                    field:"grado"
                },
                {
                    label:"Grupo",
                    name:"grupo",
                    field:"grupo"
                },
                {
                    label:"Nivel",
                    name:"nivel",
                    field:"nivel"
                },
                {
                    label:"Profesor",
                    name:"profesor",
                    field:"profesor"
                },
                {
                    label:"Turno",
                    name:"turno",
                    field:"turno"
                }
            ],
            editGrupo:false,
            edtGrupo:{},
            profesores:[]
        }
    },
    created(){
        this.cargaescuelas()
     
    },
    methods:{
        async cargaescuelas(){
                await db.collection('escuelas').get()
                .then((das)=>{           
                    das.forEach((d)=>{
                        this.escuelas.push(d.data().nombre)
                    })
                })
        },
        editarGrupo(p){
                this.editGrupo=true
                this.edtGrupo=p.row
        },
        async cargaprofesores(){
            this.profesores=[]
            console.log(this.escselect.escuela)
            await db.collection('user')
            .where("tipo","==","Profesor")
            .where("escuela","==",this.escselect.escuela)
            .get()
            .then((pro)=>{
                console.log(pro)
                pro.forEach((p)=>{
                    this.profesores.push(p.data().nombre)
                })
               
            })
        },
        async cargalistadeGrupo(){
           
            await db.collection('grupos')
            .where("escuela","==",this.escselect.escuela)
            .get()
            .then((lis)=>{         
                this.listabla=[]
                    lis.forEach((g)=>{
                        this.listabla.push(g.data())
                    })

                    this.cargaprofesores()
            })
        },
        elimiarGrupo(p){
            if(confirm('Seguro que desea eliminar el grupo')){
                db.collection('grupos').doc(this.edtGrupo.id).delete()
                this.editGrupo=false
                this.edtGrupo={}
                this.cargalistadeGrupo()
            }
        },
        async guardarCambioGrupo(){
            db.collection('grupos').doc(this.edtGrupo.id).update(this.edtGrupo)
            .then((dt)=>{
                this.editGrupo=false
                this.edtGrupo={}
            })
        },
        async creaNuevoGrupo(){
            this.creaGrupo.escuela=this.escselect.escuela
                await db.collection('grupos').add(this.creaGrupo)
                .then((ter)=>{
                        this.creaGrupo.id=ter.id
                        db.collection('grupos').doc(ter.id).update(this.creaGrupo)
                        .then((p)=>{

                            this.cargalistadeGrupo()
                            this.addgrupo=false
                            this.creaGrupo={}
                        })
                 
                })
        }
    }
}