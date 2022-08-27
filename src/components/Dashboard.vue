<template>
    
	<div class="inicioDashboard grid justify-content-center">
		<div class="columna col-6">
            <div id="retrato" class="retrato">
                <img v-if="windowWidth > 700" id="imageinicio" class="imageinicio" src="images/inicio.jpeg" alt="este soy yo ;)">
                <img v-if="windowWidth <= 700" id="imageinicio" class="imageinicio" src="images/iniciorecortado.jpeg" alt="este soy yo ;)">
            </div>       
        </div>
        <div class="columna col2 col-6">
            <div id="cardInicio" style="  text-align: left;">
                    <h1 style="color:black">Convolucionales Explicables</h1>
                    <br>
                    <p id="content" style="font-family:Montserrat; font-size: x-large; color:black">
                        En esta web dispondrás de diferentes modelos 
                        creados mediante redes neuronales convolucionales.
                        <br>
                        <br>
                        Podrás publicar tus propias imágenes para predecir si se trata de un número y cual es, si la imágen es de un hombre o una mujer e incluso puede diferenciar entre un perro y un gato.
                        <br>
                        <br>
                        Lo interesante es obsevar mediante un modelo de Inteligencia Artificial como predice lo mencionado.
                        <br>
                        <br>
                        ¡Disfruta!
                    </p>
            </div>
        </div>
	</div>




</template>

<script>
console.log(window.innerWidth)
export default {
	data() {
        return {
            windowWidth: window.innerWidth
        }
    },
    async created() {
        

	},
	mounted() {
        window.onresize = () => {
            this.windowWidth = window.innerWidth
        }
    },
    methods: {

    },
	computed: {

	},
    components: {
    }
}
</script>
<style>
    @media(max-width: 700px) {
        .inicioDashboard{
            display:block !important;
        }
        .columna{
            width:100% !important;
        }
        .col2{
            margin-top:0px !important;
        }
        #cardInicio{
            text-align:center !important;
        }
        #content{
            padding-right:0px !important;
        }
    }  
    
    .col2{
        margin-top:120px;
    }

    .retrato{
        display: flex;
        justify-content: center;
    }

    .imageinicio{
        width:56vh
    }

    #content{
        padding-right:200px;
    }

</style>