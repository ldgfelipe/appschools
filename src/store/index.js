import Vue from 'vue'
import Vuex from 'vuex'
import { db,firebase,auth } from 'boot/firebase'
// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
let observer
export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
  /*  modules: {
      // example
    },
*/
state:{
  sesionStatus:false,
  datosuser:{},
  carga:false,
  contacts:{},
  datosContact:{},
  mensajesChat:[],
  mensajeError:"",
  posicion:0,
  alertaerror:false,
  escueladata:{}

},
actions:{
 async llamalistacontacto({commit},listadatos){
   console.log(listadatos)
    var returlista=[]
    const users=await db.collection('user')
    .where("grupoUB","==",listadatos.grupo)
    .where("tipo","==",listadatos.tipo)
        observer = users.onSnapshot((datos)=>{       
           datos.forEach((data)=>{
            commit('changeContacts',data.data())
             }) 
         },
           err=>{
             console.error(err)
           }
         )

  },
  aceperror({commit}){
    commit('changeError',false)
  },
  cleandata({commit}){
    commit('limpiadatos',true)
  },
  validases: async ({commit},data)=>{

    try{
      await firebase.auth().signInWithEmailAndPassword(data.usuario,data.password)
      .then((d)=>{
       
        db.collection('user').where("uid","==",d.user.uid).get()
        .then((user)=>{ 
          var escuela={}
          user.forEach((dad)=>{
            
            escuela=dad.data().escuela // carga datos de escuela asignada del usuario
            if(dad.data().edoactividad===1){
            commit('loginstatus',dad.data()) ///// carga los datos del usuario en el store datosuser
            commit('changeLoader',false)
            let payload=dad.data() //// carga los datos del usuario
            payload.online=true
            payload.iddoc=dad.id
            db.collection('user').doc(dad.id)
              .update(payload)
            //commit('takedatosuser',payload)
            }else{
              commit('mensajeEr',"Solicite la validación de su cuenta en su centro ")
              commit('changeLoader',false)
              commit('changeError',true)
            }
          })

          db.collection('escuelas').where('nombre','==',escuela).get()
          .then((esc)=>{
              commit('datosescuela',esc.docs[0].data()) //// carga datos de la escuela
          })


        })
      })
      .catch(function(error){
        console.error('En login')
        console.error(error)
        commit('mensajeEr',"Usuario o contraseña incorrecto")
        commit('changeLoader',false)
        commit('changeError',true)
      })
    }catch(e){
      commit('mensajeEr',"Error de sistema")
      console.error('En catch')
      console.error(e)
      commit('changeLoader',false)
      commit('changeError',true)
    }
  },
  cargaDatosuser:async ({commit},uid)=>{
    console.log('datos usuario')
    console.log(uid)
    const user=await db.collection('user').where("uid","==",uid)
    observer = user.onSnapshot((datos)=>{
      datos.forEach((data)=>{

        commit('changeDataContact',data.data())
      })
    },
    err=>{
      console.error(err)
    }
    )
  },
  enviaMjs:async ({state},data)=>{

    data.fecha=new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDay()
    data.hora=new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds()
   /// envia y guarda en remitente 
await db.collection('chatSistem').doc(state.datosuser.uid).collection(data.datauser).add(data)
   /// envia y guarda en emisor
  .then((p)=>{
     var payloademisor = {
      text:data.text,
      de:state.datosuser.nombre,
      fecha:data.fecha,
      hora:data.hora,
      posicion:data.posicion
    }
      db.collection('chatSistem').doc(data.datauser).collection(state.datosuser.uid).add(payloademisor)
   }) 

  },
  cargaChat:async ({commit},data)=>{
        const userchat=await db.collection('chatSistem').doc(data.eid).collection(data.rid).orderBy('posicion','desc').limit(20)
        observer = userchat.onSnapshot((e)=>{
          commit('cargamensajes',e.docs)
        })
  },
  async tomausuariosAlumnos({commit},dat){

  
    const users=await db.collection('user')
    .where("tipo","==","Profesor")
    .where("grupos","array-contains",{grado:dat.grado,grupo:dat.grupo,"nivel":dat.nivel,"escuela":dat.escuela,idGrupo:dat.grado+"-"+dat.grupo+"-"+dat.nivel+"-"+dat.escuela})
        observer = users.onSnapshot((datos)=>{    
          console.log(datos)   
           datos.forEach((data)=>{
            commit('changeContacts',data.data())
             }) 
         },
           err=>{
             console.error(err)
           }
         )     
      },
    tomausuariosProfesor:async({dispatch},data)=>{
      var secciones=data.grupos
      var seccion={}
      secciones.forEach((dat)=>{
        console.log("Agregando salon: "+dat.grado+"-"+dat.grupo+"-"+dat.nivel+"-"+dat.escuela)
        seccion={
          grupo:dat.grado+"-"+dat.grupo+"-"+dat.nivel+"-"+dat.escuela,
          tipo:"Alumno"
        }
        dispatch('llamalistacontacto',seccion)
      })
    },
  cerrarconexion(){
    console.log('action close conexion')
    if(observer){
    observer()
    }
  }
},
mutations:{
  datosescuela(state,data){
    state.escueladata=data
  },
  mensajeEr(state,data){
    state.mensajeError=data
  },
  limpiadatos(state,data){
    if(data===true){
    state.datosuser={}
    }
  },
  cargamensajes(state,data){
    state.mensajesChat=[]
    state.posicion=0
    
    data.forEach((docs)=>{
      state.mensajesChat.push(docs.data())
      state.posicion++
    })

    state.mensajesChat.sort(function(a, b) {
      return a.posicion - b.posicion;
    });
    console.log(state.mensajesChat)
  },
  changeLoader(state,data){
    state.carga=data
  },
  changeError(state,data){
    state.alertaerror=data
  },
  changeDataContact(state,data){
    state.datosContact=data
  },
  changeContacts(state,data){
    Vue.set(state.contacts,data.uid,data)
  },
  loginstatus(state,data){
    state.sesionStatus=true
    state.datosuser=data
  },
  cambiarsesion(state,data){
    if(data===false){
      state.datosuser={}
    }
 
    state.sesionStatus=data
  },
  takedatosuser(state,data){
    state.datosuser=data
  },

},
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
