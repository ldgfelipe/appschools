<template>
<div>
  
    {{datosuser.grado}}{{datosuser.grupo}} {{datosuser.nivel}}


    <listacontactos @gochat="gochat($event)" />
    </div>
</template>
<script>
import listacontactos from 'components/listacontactos/listacontactos.vue'
import {mapState} from 'vuex'
export default {
    data(){
        return {
            tabs:'users'
        }
    },
    computed:{
        ...mapState(['datosuser'])
    },
    components:{
        listacontactos
    },
    methods:{
        gochat(p){
            this.tabs="chat"
        }
    }
}
</script>