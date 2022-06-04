<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="sesionStatus === true"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <q-btn
            v-if="$route.fullPath.includes('/chat')"
            icon="arrow_back"
            flat
            dense
            to="/contactos"
          >
            Contactos</q-btn


          >
          <span v-if="datosuser.n && !$route.fullPath.includes('/chat')">
            {{ datosuser.n ? datosuser.n.substr(0, 15) : "AppSchool" }}</span
          >
        <span v-if="$route.fullPath.includes('/contactos')">
          usuario:{{datosuser.nombre}}  tipo:{{datosuser.tipo}}
          </span>
        </q-toolbar-title>

        <div>V{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="sesionStatus === true"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          {{ datosuser.escuela }}
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          v-if="validaAdmin(link.lvl)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { mapState } from "vuex";
import { db, firebase, auth } from "boot/firebase";
const linksData = [
  {
    title: "Inicio",
    caption: "",
    icon: "home",
    link: "/",
    lvl: "0",
  },
  {
    title: "Contactos",
    caption: "",
    icon: "date_range",
    link: "/contactos",
    lvl: "0",
  },
  {
    title: "Grupos",
    caption: "",
    icon: "people",
    link: "/grupos",
    lvl: "1",
  },
  {
    title: "Configuración",
    caption: "",
    icon: "settings",
    link: "/config",
    lvl: "0",
  },
  {
    title: "Administracion",
    caption: "",
    icon: "tune",
    link: "/admin",
    lvl: "2",
  },
];
export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    };
  },
  computed: {
    ...mapState(["sesionStatus", "loginstatus", "datosuser"]),
  },
  methods: {
    validsesion() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
          if (uid) {
            db.collection("user")
              .where("uid", "==", uid)
              .get()
              .then((user) => {
                var escuela = {};
                user.forEach((dad) => {
                  escuela = dad.data().escuela; // carga datos de escuela asignada del usuario
                  if (dad.data().edoactividad === 1) {
                    this.$store.commit("loginstatus", dad.data()); ///// carga los datos del usuario en el store datosuser
                    this.$store.commit("changeLoader", false);
                    let payload = dad.data(); //// carga los datos del usuario
                    payload.online = true;
                    payload.iddoc = dad.id;
                    db.collection("user").doc(dad.id).update(payload);
                    //commit('takedatosuser',payload)
                  } else {
                    this.$store.commit(
                      "mensajeEr",
                      "Solicite la validación de su cuenta en su centro "
                    );
                    this.$store.commit("changeLoader", false);
                    this.$store.commit("changeError", true);
                  }
                });

                db.collection("escuelas")
                  .where("nombre", "==", escuela)
                  .get()
                  .then((esc) => {
                    this.$store.commit("datosescuela", esc.docs[0].data()); //// carga datos de la escuela
                  });
              });
          }
          // ...
        } else {
          this.$router.push('/')
        }
      });
    },
    validaAdmin(p) {
      var val = true;
      if (this.datosuser.permiso >= p) {
        val = true;
      } else {
        val = false;
      }
      return val;
    },
  },
  mounted() {
    this.validsesion();
  },
};
</script>
