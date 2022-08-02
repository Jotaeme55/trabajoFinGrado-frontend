<template>
    <div>
        <div id="linea">
            <Button label="Añadir tu propia foto" icon="pi pi-external-link" @click="openDialog" />
            <Dialog header="Añade tu propia foto" v-model:visible="displayDialog" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
                <FileUpload id="fileUpload" @select="onFileSelected" @remove="removeButton" @uploader="saveFile" accept="image/*" :fileLimit="1" :showUploadButton="false" :showCancelButton="false">
                    <template #empty>
                        <p>Drag and drop files to here to upload.</p>
                    </template>
                </FileUpload>
                <div style="display:flex; justify-content: center; margin-top: 20px;">
                    <Button id="botonGuardar" @click="saveFile()"  label="Añadir tu propia foto" style="visibility: hidden;" />
                </div>
            </Dialog>
        </div>

        <DataView :value="dataviewValue" :layout="layout"  :totalRecords="totalRecords" :lazy="true"
					:paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField" @page="onPage($event)">
					<template #header>
						<div class="grid formgroup-inline justify-content-between ">
							<div class="field">
								<Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Ordenar por" @change="onSortChange($event)"/>
							</div>
							<div class="field">
								<span class="p-input-icon-left mb-2">
									<i class="pi pi-search" @click="fetchItems()" style="cursor:pointer;"/>
									<InputText placeholder="Buscar" style="width: 100%" @keyup.enter="fetchItems()" @focusout="fetchItems()" id="BuscadorImagenes"/>
								</span>
							</div>
							<div class="field">
								<DataViewLayoutOptions v-model="layout" />
							</div>
						</div>
					</template>
					<template #list="slotProps">
						<div class="col-12">
							<div class="flex flex-column md:flex-row align-items-center p-3 w-full"  @click="detallesImagen(slotProps.data)">
								<img :src="slotProps.data.image || 'https://i.imgur.com/Z8jQBw4.png'" :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5 product-image" 
									style="width: 100%; display: block;" id="imagen-busqueda"/>
								<div class="flex-1 text-center md:text-left">
									<div class="font-bold text-2xl" style="color:#6366F1;">
										Nombre: {{ (slotProps.data.name).split(".")[0] }} 
									</div>
                                    <div class="text-2xl mt-2" style="color:#6366F1;">
                                        Fecha de guardado: {{ new Date(slotProps.data.fechaDeGuardado)}}
                                    </div>
                                    <div class="text-2xl mt-2 " style="color:#6366F1;">
                                        Extension: {{  (slotProps.data.name).split(".")[1] }}
                                    </div>
								</div>
							</div>
						</div>
					</template>
					<template #grid="slotProps">
						<div  class="col-12 md:col-4">
							<div class="card m-3 border-1 surface-border" style="min-height: 92%">
								<div @click="detallesImagen(slotProps.data)" class="text-align-center">
									<div class="grid grid-nogutter alimento-busqueda">
										<div class="col-4 text-left">
											<img :src="slotProps.data.image ||'https://i.imgur.com/Z8jQBw4.png'" :alt="slotProps.data.name" 
													class="w-9 shadow-2 my-3 mx-0" id="imagen-busqueda"/>
										</div>											
                                        <div class="font-bold text-4xl" style="color:#6366F1;">
                                            {{ (slotProps.data.name).split(".")[0] }} 
                                        </div>
                                        <div class="text-2xl mt-2" style="color:#6366F1;">
                                            Fecha de guardado: {{ new Date(slotProps.data.fechaDeGuardado).toString().split("GMT")[0]}}
                                        </div>
                                        <div class="text-2xl mt-2 " style="color:#6366F1;">
                                            Extension: {{  (slotProps.data.name).split(".")[1] }}
                                        </div>

									</div>
								</div>
								
							</div>
						</div>
					</template>
        </DataView>
        <Dialog id="dialogimg"  v-model:visible="displayDialogImagen" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw', height:'70v'}">
            <h1 style="text-align:center">{{imagen.name.split(".")[0]}}</h1>
            <div style="display:flex ; justify-content:center ; text-align:center">
                <div class="portrait">
                    <img id="preview" :src="imagen.image"> 
                    <img id="preview100px" :src="imagen.image" style="width:100px; height:100px; visibility:hidden "> 
                </div>
            </div>
            <div class="prediccion">
                <Button label="Predecir"  @click="predecir"/>
                <h1 v-if="prediccion">{{prediccion}}</h1>
                <img v-if="this.prediccion == null && this.prediciendo == true" src="/images/loading.gif" alt="cargando" style="width:50px; height: 50px;">
            </div>
        </Dialog>
    </div>
</template>

<script>
import axios from 'axios'
import imagenesService from '../service/ImagenesService';
import * as tf from '@tensorflow/tfjs';




export default {
	data() {
        return {
            displayDialog:null,
            selectedFile : null,
            dataImg : null,
            totalRecords :null,
            dataviewValue : null,
            lazyParams:null,
            imagen:null,
            displayDialogImagen:null,
            layout: 'grid',
            sortField:null,
            sortOptions: [
					{label: 'Nombre alfabéticamente', value: 'name'},
					{label: 'Nombre alfabéticamente inverso', value: '!name'},
					{label: 'fechaDeGuardado - más antiguas', value: 'fechaDeGuardado'},
					{label: 'fechaDeGuardado - más nuevas', value: '!fechaDeGuardado'},
				],
            prediccion:null,
            prediciendo : false,
        }
    },
    created() {
      this.imagenesService = new imagenesService();
	},
	mounted() {
         this.lazyParams = {
            pagina: 0,
            sort: [], //2 items: sortField y sortOrder (Ejemplo: Nombre,-1 ==> Ordenar por nombre inversamente)
            filters: ''
        };
		this.fetchItems();
    },
    methods: {
        async predecir(){
            this.prediciendo = true
            let model = await tf.loadLayersModel("../data/detectorHombresMujeres/model.json");
            const preview100px = document.getElementById('preview100px');
            var arrayOfPixels = tf.browser.fromPixels(preview100px,4).dataSync()
            var arr100 = [] 
            var arrRes = []
            for( var pixel = 0; pixel <= arrayOfPixels.length ; pixel += 4){
                var red = arrayOfPixels[pixel]/255
                var green = arrayOfPixels[pixel+1]/255 
                var blue = arrayOfPixels[pixel+2]/255
                var gray = [(red+green+blue)/3];
                arr100.push(gray)
                if(arr100.length == 100){
                    arrRes.push(arr100)
                    arr100=[]
                }

            }
            var tensor = tf.tensor4d([arrRes]);
            var resultado = model.predict(tensor).dataSync();
            //codigo concreto de números
            console.log(resultado)
            if(resultado > .5){
                this.prediccion = "hombre"
            }else{
                this.prediccion = "mujer"
            }
        },
        onPage(event){
                this.lazyParams.pagina = event.page;
                this.fetchItems();	
            },
        detallesImagen(imagen){
            this.prediciendo = false
            this.prediccion = null
            this.imagen = imagen
            this.displayDialogImagen = true
        },

        //parte de funcionalidad de guardar tu propia imagen
        removeButton(){
            document.getElementById("botonGuardar").style.visibility="hidden"
        },
        openDialog() {
            this.displayDialog = true;
        },
        closeDialog() {
            this.displayDialog = false;
        },
        onFileSelected(event) {
            document.getElementById("botonGuardar").style.visibility="visible"
            this.selectedFile = event.files[0];
            this.getFile().then(res => {
                this.dataImg = res
            })
        },
        async getFile(){
            return new Promise (resolve => {
                var fileReader = new FileReader();
                fileReader.onload = function (res){
                resolve( res.target.result )
                }
            fileReader.readAsDataURL(this.selectedFile)
            })
        },
    
        saveFile(){
            var user = this.$store.state.username
            var now = new Date().getTime()
            var imageFile = {
                "name" : this.selectedFile.name,
                "image" : this.dataImg,
                "usernameAsociated" : user,
                "fechaDeGuardado" : now,
                "tipoDeModelo" :"hombresYmujeres"
            }
            axios.post("/images",imageFile)
            this.closeDialog()
            this.fetchItems()
        },
        //parte funcionalidad de coger todas las fotos de una persona
        fetchItems() {
            this.imagenesService.getImagenesFromUser(this.lazyParams,document.getElementById('BuscadorImagenes').value, this.$store.state.username, "hombresYmujeres")
            .then(data => {
                this.totalRecords = data.total;
                this.dataviewValue = data.imagenesDB;
            })
        },
        onSortChange(event){
				let value = event.value.value;
				if (value.indexOf('!') === 0) {
					let sortField = value.substring(1, value.length)
					this.lazyParams.sort = [sortField,'-1']
				}
				else {
					this.lazyParams.sort = [value,'1']
				}
				this.fetchItems();
			},
    },
	computed: {

	},
    components: {
    }
}
</script>
<style>
    #linea{
        border-bottom: 1px  #fff;
        margin-bottom: 20px;
    }

    .portrait{
        height: 200px;
        width: 60%;
        margin-bottom:20px;
        border: solid; 
    }

    #preview{
        width:100%;
        height:100%;
        object-fit: contain;
    }

</style>