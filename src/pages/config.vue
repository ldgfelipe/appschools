<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-list>
          <q-item-section>
            <b>Correo:</b> {{ datosuser.correo }} <b>Nombre:</b> {{ datosuser.nombre }}
            <b>Tipo Cuenta:</b> {{ datosuser.tipo }} <b>Matricula:</b>
            {{ datosuser.matricula }} <b v-if="datosuser.tipo === 'Padre'">Alumno:</b>
            {{ datosuser.h }}
            <b v-if="datosuser.tipo === 'Padre' || datosuser.tipo === 'Alumno'"
              >Nivel:</b
            >
            {{ datosuser.grado }} {{ datosuser.grupo }} {{ datosuser.nivel }}
            <b>Id:</b>
            {{ datosuser.iddoc }}
            
          </q-item-section>
        </q-list>
      </q-card-section>
    </q-card>
    <q-btn class="primary" @click="cerrarsesion()">
      Cerrar Sesión
    </q-btn>
  </q-page>
</template>
<script>
import { auth, firebase, db } from "boot/firebase.js";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {};
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