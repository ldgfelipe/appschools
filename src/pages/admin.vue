<template>
  <q-page class="q-pa-md">
        <q-tabs v-model="tabs" class="text-teal">
          <q-tab name="Sistema" icon="build" label="Sistema" />
          <q-tab name="Usuarios" icon="account_box" label="Usuarios" />
          <q-tab name="chats" icon="fact_check" label="chats" />
           <q-tab name="escuelas" icon="home_work" label="escuelas" />
           <q-tab name="Grupos" icon="home_work" label="Grupos" />
        </q-tabs>

        <q-tab-panels
          v-model="tabs"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="Sistema">
            <div class="text-h4 q-mb-md">Sistema</div>

          </q-tab-panel>

          <q-tab-panel name="Usuarios">
            <div class="text-h4 q-mb-md">Usuarios</div>
              <usuarios></usuarios>
          </q-tab-panel>

          <q-tab-panel name="chats">
            <div class="text-h4 q-mb-md">Chats</div>
  
          </q-tab-panel>

             <q-tab-panel name="escuelas">
         <admipage></admipage>

             </q-tab-panel>

               <q-tab-panel name="Grupos">
            <div class="text-h4 q-mb-md">Grupos</div>
                <grupos></grupos>
             </q-tab-panel>

        </q-tab-panels>

  </q-page>
</template>
<script>
import { auth, firebase, db } from "boot/firebase.js";
import { mapState, mapMutations } from "vuex";
import admipage from "pages/admin/escuelas/escuelas.vue"
import usuarios from "pages/admin/usuarios/usuarios.vue"
import grupos from "pages/admin/grupos/grupos.vue"
export default {
  data() {
    return {
      tabs:"Sistema"
    };
  },
  components:{
    admipage,
    usuarios,
    grupos
  },
  computed: {
    ...mapState(["datosuser"])
  },
  methods: {
    ...mapMutations(["cambiarsesion"]),
    cerrarsesion() {
      var payload={...this.datosuser}
      auth.signOut().then((logout) => {
            this.cambiarsesion(false);
          payload.online=false

     db.collection("user")
            .doc(payload.iddoc)
            .update(payload)

            this.$router.push("/"); 
      });
    }
  }
};
</script>