<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { db,firebase,auth } from 'boot/firebase.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'App',
  data(){
    return {

    }
  },
  computed:{
    ...mapState(['sesionStatus'])
  },
  methods:{
    ...mapMutations(['loginstatus','takedatosuser']),
    validasesion(){
      auth.onAuthStateChanged((user)=>{
       if(user){  

        db.collection('user').where("uid","==",user.uid).get()
          .then((user)=>{
            user.forEach((dad)=>{
              if(dad.data().edoac===1){
                  this.loginstatus()
                  this.carga=false
                  this.takedatosuser(dad.data())
              }
            })
          })
       }
      })
    }
  },
  mounted(){
    this.validasesion()
  } 
}
</script>
