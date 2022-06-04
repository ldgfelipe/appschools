
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path:'/registro', component:()=> import('pages/registro.vue')},
      { path:'/contactos', component:()=> import('pages/contactos.vue')},
      { path:'/chat/:userid', component:()=> import('pages/chat.vue')},
      { path:'/agenda', component:()=> import('pages/agenda.vue')},
      { path:'/grupos', component:()=> import('pages/grupos.vue')},
      { path:'/config', component:()=> import('pages/config.vue')},
      { path:'/admin', component:()=> import('pages/admin.vue')}
    ]
  },
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
