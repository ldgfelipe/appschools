<template>
     <q-dialog
      v-model="stload"
      persistent
    >
      <q-card style="width: 300px">
        <q-card-section class="text-center">
          <q-circular-progress
      indeterminate
      size="150px"
      color="white"
      track-color="primary"
      class="q-ma-md"
    />
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    props:{
        stload:false
    }
}
</script>