<template>
    <q-card>
        <q-card-section>
            <img :src="escueladata.imglogo" />
        </q-card-section>
    </q-card>
</template>
<script>

import {mapState} from 'vuex'

export default {
  data(){
      return {
          imgEscuela:""
      }
  },
    computed:{
        ...mapState(['escueladata'])
    }

}
</script>
