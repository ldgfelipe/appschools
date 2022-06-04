<template>
  <q-page class="flex flex-center ">


          <q-card rounded class="my-card">
              <q-card-section class="text-center">
        <img
      alt="Vanderbilt logo"
      src="~assets/logo-vanderbilt.png"
      style="width:70%;"
    >


      <q-select v-model="datos.escuela" :options="escuelas" label="Escuelas" />

      <q-input type="text" label="Nombre"  v-model="datos.nombre" /><br />
      <q-input type="mail" label="Correo"  v-model="datos.correo" /><br />
      <q-input  type="password" label="Contraseña"  v-model="datos.password" /><br />
      
        <q-radio v-model="datos.tipo" val="Alumno" label="Alumno" />  
        <q-radio v-model="datos.tipo" val="Padre" label="Padre" />  
        <q-radio v-model="datos.tipo" val="Profesor" label="Profesor" />  
        <q-radio v-model="datos.tipo" val="Admin" label="Admin" />  
        <q-radio v-model="datos.tipo" val="Sistem" label="Sistem" />  
       <q-input  type="text"  label="Matricula o Clave de Alumno o profesor"  v-model="datos.matricula" /><br /> 
      <q-input  v-if="datos.tipo==='Padre'" type="text" label="Escriba el nombre del alumno"  v-model="datos.hijo" /><br />    
      <q-select  v-if="datos.tipo==='Padre' || datos.tipo==='Alumno'" label="Seleccione el Grado" :options="grados"  v-model="datos.grado" /><br /> 
      <q-select  v-if="datos.tipo==='Padre' || datos.tipo==='Alumno'" label="Seleccione el Grupo" :options="grupos"  v-model="datos.grupo" /><br />
      <q-select  v-if="datos.tipo==='Padre' || datos.tipo==='Alumno'" label="Seleccione el Nivel" :options="nivel"  v-model="datos.nivel" /><br />   
<br />
      <q-btn class="bg-indigo-6 text-white" @click="acptAcuerdo=true">Registrar</q-btn><br /><br />
      <q-btn to="/" class="bg-indigo-6 text-white" >Iniciar Sesión</q-btn>
    </q-card-section>
          </q-card>

  <q-dialog v-model="acptAcuerdo" >
    <q-card>

        <q-card-section>
          Recuerda que toda actividad relacionada con la escuela sera monitoriada, por el personale de la misma,  por lo tanto se podra denegar o bloquear el accesos en caso de la suplantación o mal uso de la herramienta.
        </q-card-section>
          <q-card-section class="text-center">
                 <q-btn class="bg-primary text-white" @click="registeruser()">Aceptar</q-btn> 
          <q-btn class="bg-blue text-white" @click="acptAcuerdo=false" >Cancelar</q-btn>
          </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
         <q-card-section class="bg-red text-white">
           Debe resolver lo siguiente
         </q-card-section>
        <q-card-section>
          <q-list>
            <q-item v-for="(err,index) in error" :key="'ind'+index">
              <q-item-section>
                {{err}}
              </q-item-section>
            </q-item>
          
          </q-list>
        </q-card-section>
        <q-card-section>
          <q-btn class="bg-primary text-white" @click="alert=false">Aceptar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style scoped>
.my-card{
  width: 100%;
  max-width: 500px;
}
.q-input{
font-size:30px;
}
</style>
<script>
import { db,firebase,auth } from 'boot/firebase'
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return {
            datos:{},
            Mensajeserver:"",
            error:[],
            escuelas:[],
            acptAcuerdo:false,
            alert:false,
            grupos:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            grados:["1","2","3","4","5","6","7","8","9","10","11","12","13"],
            nivel:["KINDER","PREESCOLAR","PRIMARIA","SECUNDARIA","BACHILLERA","TECNICA","LICENCIATURA","MAESTRIA","DOCTORADO"]
        }
    },
    created(){
      this.cargaEscuelas()
    },
    methods:{
      ...mapMutations(['loginstatus','takedatosuser']),
     async cargaEscuelas(){
        await db.collection('escuelas').get()
        .then((data)=>{
            data.forEach((da)=>{
              this.escuelas.push(da.data().nombre)
            })

            console.log(this.escuelas)
        })
      },
async  registeruser(){
            switch(this.datos.tipo){
                      case 'Alumno':
                      case 'Padre':  
                      case 'Profesor':
                        this.datos.permiso=0
                        break;
                      case 'Admin':
                         this.datos.permiso=1
                        break;
                      case 'Sistem':
                         this.datos.permiso=2
                        break;      
                  }
            this.datos.edoactividad=0
    this.error=[]
            try{
              this.acptAcuerdo=false
              if(!this.datos.nombre){
                this.error.push('Ingrese su nombre');
              }
              if(!this.datos.correo){
                this.error.push('Ingrese su Correo')
              }
                if(!this.datos.matricula){
                this.error.push('Debe ingresar la Matricula o Identificación institucional en caso de padre la matricula del alumno ')
              } 
              if(!this.datos.password){
                this.error.push('Ingrese su contraseña')
              }
              if(!this.datos.tipo){
                this.error.push('Debe seleccionar el tipo de usuario')
              }
              if(this.error.length===0){
              await  firebase.auth().createUserWithEmailAndPassword(this.datos.correo,this.datos.password)
                .then((data)=>{
                  this.datos.uid=data.user.uid
                  this.datos.cemail=data.user.emailVerified
                  if(this.datos.tipo==='Alumno'){
                  this.datos.grupoUB=this.datos.grado+"-"+this.datos.grupo+"-"+this.datos.nivel+"-"+this.datos.escuela
                  }
                  
                  db.collection('user').add(this.datos);
                   this.$router.push('/')
                        /*
                        this.loginstatus(this.datos)
                        this.takedatosuser(this.datos)
                        this.cleandata()
                        */
                })
                .catch((error)=>{
                  this.error.push('El correo ya esta registrado')
                  console.error(e)
                  var errorCode = error.code 
                  var errorMessage = error.message
                })
              }else{
                this.alert=true
              }
            }catch(e){
                this.alert=true
            }
        }
    }
}
</script>