<template>
  <q-page class="flex column" >
    <q-banner v-if="datosContact.online!==true" class="bg-red text-center text-white">
    Fuera de línea {{datosContact.online}}
    </q-banner>
    <div class="q-pa-md column col justify-end">


      <q-chat-message
        v-for="(msj,index) in mensajesChat"
        :key="msj.de+index"
        :name="msj.de"
        :text="[msj.text]"
        :sent="msj.de === 'Yo' ? true : false"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
   
        <q-input
          class="full-width"
          bg-color="white"
          rounded
          outlined
          v-model="nuevoMensaje"
          label="Mensaje"
          dense
         
        >
          <template v-slot:append>
            <q-icon
              v-if="nuevoMensaje !== ''"
              name="close"
              @click="nuevoMensaje = ''"
              class="cursor-pointer"
            />
            <q-icon name="schedule" />
          </template>

          <template v-slot:hint>
   
          </template>

          <template v-slot:after>
            <q-btn color="white" 
                @click="enviarMensaje"
                round 
                dense 
                flat 
                icon="send" 
                />
          </template>
        </q-input>

      </q-toolbar>
    </q-footer>
  </q-page>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
  data() {
    return {
      nuevoMensaje: "",

    }
  },
  computed:{
    ...mapState(['datosContact','datosuser','mensajesChat','posicion'])
  },
  mounted(){
    this.initChat()
  },
  methods:{
    ...mapActions(['cargaDatosuser','cargaChat','enviaMjs']),
    initChat(){

       this.cargaDatosuser(this.$route.params.userid)

      this.detectaStore()
     
    },
    detectaStore(){
      if(this.datosuser.uid){
            var payload={
         eid:this.datosuser.uid,
         rid:this.$route.params.userid,
       }
      this.cargaChat(payload)
      }else{
         setTimeout(()=>{
           this.detectaStore()
         },1000) 
      }

    },
      enviarMensaje(){
        if(this.nuevoMensaje){
          var payload={
              de:'Yo',
              text:this.nuevoMensaje,
              datauser:this.$route.params.userid,
              posicion:this.posicion
          }
          this.enviaMjs(payload)
        this.nuevoMensaje=""
        } 
      }
  }
}
</script>
