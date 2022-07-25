<template>
    <img id="hombre" src="images/mujer.jpg" alt="" width="400" class="shadow-2" />
    <img id="hombreNonVisible" src="images/mujer.jpg" alt="" width="100" height="100" class="shadow-2" style="display:none"/>
<!--     <canvas id="canvasHombre" width="400" height="350" style="border: 1px solid #ffffff;"></canvas> -->
    <h1 v-if="res_hombres!=null">{{res_hombres}}</h1>
    <button @click="predecirHombreMujer()">PREDECIR</button>
    <!-- input type="file"> -->
</template>

<script>
import * as tf from '@tensorflow/tfjs';




export default {
	data() {
        return {
            model:null,
            raw_model:null,
            res_hombres:null,
        }
    },
    async created() {
                let model = await tf.loadLayersModel("../data/detectorHombresMujeres/model.json");


                const hombre = document.getElementById('hombreNonVisible');
                var arrayOfPixels = tf.browser.fromPixels(hombre,4).dataSync()
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
                if(resultado[0]>0.5){
                    this.res_hombres="hombre"
                }else{
                    this.res_hombres="mujer"
                }

                /* tf.LRNGrad */

                
                let modelInput = model.inputs
                let lastConvLayerOutput = model.getLayer("conv2d_8").output

                let submodel = tf.model({inputs:modelInput,outputs:lastConvLayerOutput})
                
                const inputNuevo = tf.input({shape: lastConvLayerOutput.shape.slice(1)});

                console.log(submodel)
                console.log(inputNuevo)
	},
	mounted() {
        
    },
    methods: {
        predecirHombreMujer() {

        }
    },
	computed: {

	},
    components: {
    }
}
</script>
<style>


</style>