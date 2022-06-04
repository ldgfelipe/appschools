<template>
  <q-page class="flex flex-center">
  <q-card v-if="sesionStatus===true">
    <q-card-section>
      <inicio></inicio>
    </q-card-section>
  </q-card>

  <q-card rounded class="my-card" v-if="sesionStatus===false">
    <q-card-section class="text-center">
    <img 
      alt="Vanderbilt logo"
      src="~assets/logo-appschool.png"
      style="width:70%;"
     >
      <q-input label="correo" v-model="data.usuario"  /><br />
      <q-input type="password" label="contraseña" v-model="data.password" /><br />
      <q-btn class="bg-indigo-6 text-white" @click="validasesion()">Entrar</q-btn><br /><br />
      <q-btn to="/registro" class="text-white bg-blue">Regístrate</q-btn>
    </q-card-section>
  </q-card>
<loader :stload="carga" />

<q-dialog class="error" v-model="alertaerror">
  <q-card>
    <q-card-section >
      <q-banner inline-actions class="text-center">
  <h4 class="text-red ">Acceso Denegado</h4> 
 <span class="text-red"> {{mensajeError}}</span>
 <br /> 
  <br />
  <q-btn class="bg-red text-white" @click="aceptarError()">
    Aceptar
  </q-btn>
      </q-banner>
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
import {mapState,mapMutations,mapActions } from 'vuex'
import loader from 'components/loader.vue'
import inicio from 'components/inicio/inicio.vue'

export default {
  name: 'PageIndex',
  data(){
    return {
      data:{
      },
    }
  },

  computed:{
    ...mapState(['sesionStatus','carga','datosuser','alertaerror','mensajeError'])
  },
 
methods:{
...mapMutations(['loginstatus','takedatosuser']), 
...mapActions(['validases','aceperror']),

validasesion(){
  var datasend={usuario:this.data.usuario,password:this.data.password}
this.validases(datasend)
    },
    aceptarError(){
      this.aceperror()
    }
  },
  components:{
    loader,
    inicio
  }
}

</script>
