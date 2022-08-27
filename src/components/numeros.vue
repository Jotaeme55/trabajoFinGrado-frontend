<template>

    <div>
        <Toast/>
        <div id="linea">
            <Button label="Añadir tu propia foto" icon="pi pi-external-link" @click="openDialog" />
            <Dialog header="Añade tu propia foto" v-model:visible="displayDialog" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
                <FileUpload id="fileUpload" @select="onFileSelected" @remove="removeButton" @uploader="saveFile" accept="image/*" :fileLimit="1" :showUploadButton="false" :showCancelButton="false">
                    <template #empty>
                        <p>Suelta aquí tu imagen para guardarla.</p>
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
								<img :src="slotProps.data.image" :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5 product-image" 
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
											<img :src="slotProps.data.image" :alt="slotProps.data.name" 
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
                 <div class="portrait" style="position:relative">
                    <img id="resolution" :src="imagen.image" style="display:none">
                    <img class="overlayImage" id="preview" :src="imagen.image"> 
                    <canvas class="overlayImage2" style=" width:100%; height:100%" :style="sliderOpacity" id="mycanvas"></canvas>
                    <img id="preview100px" :src="imagen.image" style="width:28px; height:28px; visibility:hidden "> 
                </div>
            </div>
            <div class="prediccion" style="display:grid; justify-content:center;text-align: center">
                <div id="botones">
                    <Button v-if="!prediccion" label="Predecir"  @click="predecir"/>
                    <Button v-if="!prediccion" label="Borrar" style="margin-left:5px; background-color:red"  @click="borrarImagen(imagen._id)"/>
                </div>
                <h1 v-if="prediccion">{{prediccion}}</h1>
                <img v-if="this.prediccion == null && this.prediciendo == true" src="/images/loading.gif" alt="cargando" style="width:50px; height: 50px;">
                <Slider v-if="prediccion" v-model="opacity" :step="0.05" :min="0" :max="1" style=" margin-top:20px; width:250px;" />
            </div>
        </Dialog>
    </div>
</template>

<script>
import axios from 'axios'
import imagenesService from '../service/ImagenesService';
import * as tf from '@tensorflow/tfjs';
import gradCamService from "../service/gradCamService"



export default {
	data() {
        return {
            displayDialog:null,
            selectedFile : null,
            dataImg : null,
            totalRecords :null,
            dataviewValue : null,
            opacity: 0.30,
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
            let model = await tf.loadLayersModel("../data/detectorNumeros/model.json");
            const preview100px = document.getElementById('preview100px');
            var arrayOfPixels = tf.browser.fromPixels(preview100px,4).dataSync()
            var arr100 = [] 
            var arrRes = []
            console.log(arrayOfPixels.length)
            for( var pixel = 0; pixel <= arrayOfPixels.length ; pixel += 4){
                var red = arrayOfPixels[pixel]/255
                var green = arrayOfPixels[pixel+1]/255 
                var blue = arrayOfPixels[pixel+2]/255
                var gray = [(red+green+blue)/3];
                arr100.push(gray)
                if(arr100.length == 28){
                    arrRes.push(arr100)
                    arr100=[]
                }

            }
            var tensor = tf.tensor4d([arrRes]);
            var resultado = model.predict(tensor).dataSync();
            console.log(resultado)
            //codigo concreto de números
            var val = Math.max(...resultado)
            let res = resultado.indexOf(val)
            if(res == 0){
                this.prediccion="0"
            }else{
                this.prediccion = res
            }
            
            this.generateGradCam(model,tensor)
        },
        borrarImagen(id){
            
            this.imagenesService.removeImg(id)
            .then(()=>{
                
                this.fetchItems()
                this.displayDialogImagen = false
                this.$toast.add({severity:'success', summary: 'Éxito', detail:'Se ha eliminado corréctamente', life: 3000})
            })
        },
        generateGradCam(model,tensor){
            function gradClassActivationMap(model, x) {
                let Numcapa = model.layers.length - 1;
                while (Numcapa >= 0) {
                    if (model.layers[Numcapa].getClassName().startsWith('Conv')) {
                        break;
                    }
                    Numcapa--;}
                const ultimaConv = model.layers[Numcapa];
                let modeloInput = model.inputs
                let ultimaConvOutput = ultimaConv.output
                //let lastConvLayerOutput = model.getLayer("conv2d_8"/ultimaConv.name).output
                let submodelo1 = tf.model({inputs:modeloInput,outputs:ultimaConvOutput})
                const nInput = tf.input({shape: ultimaConvOutput.shape.slice(1)});
                Numcapa++;
                let y = nInput;
                while (Numcapa < model.layers.length) {
                    y = model.layers[Numcapa++].apply(y);
                }
                const subModelo2 = tf.model({inputs: nInput, outputs: y});
                return tf.tidy(() => {
                    const convOutput2ClassOutput = (input) =>
                        subModelo2.apply(input, {training: true}).gather([0], 1);
                    const Functiongrad = tf.grad(convOutput2ClassOutput);
                    const ultimaConvOutputValues = submodelo1.apply(x);
                    const gradValues = Functiongrad(ultimaConvOutputValues);
                    const pooledGradValues = tf.mean(gradValues, [0, 1, 2]);
                    const scaledultimaConvOutputValues =
                        ultimaConvOutputValues.mul(pooledGradValues);
                    let mapaCalor = scaledultimaConvOutputValues.mean(-1);
                    mapaCalor = mapaCalor.relu();
                    mapaCalor = mapaCalor.div(mapaCalor.max()).expandDims(-1);
                    mapaCalor = tf.image.resizeBilinear(mapaCalor, [x.shape[1], x.shape[2]]);
                    mapaCalor = gradCamService.aplicarHeatMap(mapaCalor);
                    mapaCalor = mapaCalor.mul(2).add(x.div(255));
                    return mapaCalor.div(mapaCalor.max());
                });
            }
            var resolution = document.getElementById("resolution")
            console.log(resolution.naturalWidth)
            console.log(resolution.naturalHeight)
            let Fin = gradClassActivationMap(model,tensor)
            Fin =tf.image.resizeBilinear(Fin, [resolution.naturalHeight,resolution.naturalWidth])
            const squeezed = tf.squeeze(Fin)
            console.log(squeezed.shape)

            const myCanvas = document.getElementById("mycanvas"); 
            tf.browser.toPixels(squeezed, myCanvas)
            myCanvas.style.visibility="visible"
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
            let mycanvas = document.getElementById("mycanvas")
            mycanvas.style.visibility="hidden"
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
                "tipoDeModelo" :"numeros"
            }
            axios.post("/images",imageFile)
            .then(()=>{
                this.$toast.add({severity:'success', summary: 'Éxito', detail:'Se ha guardado corréctamente', life: 3000})
            })
            this.closeDialog()
            this.fetchItems()
        },

        fetchItems() {
            this.imagenesService.getImagenesFromUser(this.lazyParams,document.getElementById('BuscadorImagenes').value, this.$store.state.username,"numeros")
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
        sliderOpacity: function () {
            return { opacity: this.opacity };
        }

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