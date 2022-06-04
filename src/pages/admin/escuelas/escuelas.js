import { db,storage } from "src/boot/firebase"

export default {
    data(){
        return {
            data:[],
            columns:[
                {
                    name:"idesc",
                    label:"Idesc",
                    field: 'idesc',
                    sortable: true
                   
                },
                {
                    name:"nombre",
                    label:"Nombre",
                    field: 'nombre',
                    sortable: true
                  
                },
                {
                    name:"estado",
                    label:"Estado",
                    field: 'estado',
                    sortable: true
                   
                },
                
               
            ],
            filter:"",
            addescuela:false,
            maximizedToggle:true,
            model:null,
            altaEsc:{},
            editarescuela:false,
            dataeditescuela:[],
            imgedit:{},
            nameFile:"",
            uploadporcentaje:0,
            imgurl:""
        
        }
        
    },
    methods:{
        editaEscuela(p){
            this.editarescuela=true
            this.dataeditescuela=p.row
           
        },
            cargaDatos(){
            this.data=[]
                db.collection('escuelas').get()
                .then((esc)=>{
                    esc.forEach((esc)=>{
                       this.data.push(esc.data())
                    })
                    
                })
            },
          async  altaEscuela(){
           await db.collection('escuelas').add(this.altaEsc)
                .then((data)=>{
                    console.log(data)
                 
                    this.addescuela=false
                    /// actualiza el id de datos
                  this.altaEsc.idesc=data.id
                        console.log(this.altaEsc)
                  db.collection('escuelas').doc(data.id).update(this.altaEsc)
                  .then((regesc)=>{
                      console.log(regesc)
                    this.cargaDatos()
                  })
            
                })   
        },
       async guardarCambios(){
        if(this.imgedit.name){
        
               this.uploadFile(this.imgedit)
               this.editarescuela=false

        }else{
            await db.collection('escuelas').doc(this.dataeditescuela.idesc).update(this.dataeditescuela)
            .then((da)=>{
                this.editarescuela=false
            })
        }
        },
        uploadFile(p){
         var dataEdit={...this.dataeditescuela}
            const storageRef = storage.ref();
  
            var uploadTask = storageRef.child("escuelas/iconos/"+this.dataeditescuela.idesc+"/"+p.name).put(p);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', function(snapshot){
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
}, function(error) {
    // Handle unsuccessful uploads
  },
   function() {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    console.log('File available at', downloadURL);

    dataEdit.imglogo=downloadURL

    db.collection('escuelas').doc(dataEdit.idesc).update(dataEdit)
    .then((da)=>{
        console.log(da)
        console.log(dataEdit)
        
    })

  });
});



        }
    },
    mounted(){
        this.cargaDatos()
        console.log(this.data)
    }

}