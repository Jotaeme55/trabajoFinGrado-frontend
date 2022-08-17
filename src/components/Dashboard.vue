<template>
    
	<div class="grid justify-content-center">
		<div class="col-6">
            <div id="retrato" class="retrato">
                <img id="imageinicio" class="imageinicio" src="images/mujer.png" alt="este soy yo ;)">
            </div>       
        </div>
        <div class="col-6">
            <Card style="  text-align: center;">
                <template #title>
                    <h1 style="4rem">Bienvenido a Convolucionales Explicables</h1>
                </template>
                <template #content>
                    <p style="font-family:cursive; font-size: x-large;">
                        Esta se trata de una web donde dispondrás de diferentes modelos creados mediante redes neuronales convolucionales y podrás
                        publicar tus propias imágenes para predecir si se trata de un número y el número concreto, si se trata de un hombre o una 
                        mujer o un diferenciar entre un perro y un gato.
                        <br>
                        <br>
                        Lo interesante es que podrás observar mediante un método que se ha estudiado el por qué la inteligencia 
                        artificial predice lo mencionado.
                        <br>
                        <br>
                        ¡Diviértete!
                    </p>
                </template>
            </Card>
        </div>
	</div>




</template>

<script>

export default {
	data() {
        return {
        }
    },
    async created() {
        

	},
	mounted() {
        
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
    .retrato{
        display: flex;
        justify-content: center;
    }

    .imageinicio{
        width:100%
    }

</style>