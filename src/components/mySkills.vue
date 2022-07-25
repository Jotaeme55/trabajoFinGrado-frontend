<template>

    <div class="galeria">
        <h1>My skills</h1>
        <div class="linea"></div>
        <div class="contenedor-imagenes">
            <div class="imagen" @click="displayDialog('python')">
                <img src="images/python logo.png" alt="">
                <div class="text">
                    <p>PYTHON</p>
                </div>
            </div>
            <div class="imagen" v-on:click="displayDialog('js')">
                <img src="images/JavaScript logo.png" alt="">
                <div class="text">
                    <p>JAVASCRIPT</p>
                </div>
            </div>
            <div class="imagen" v-on:click="displayDialog('vue')">
                <img src="images/vue logo.png" alt="" >
                <div class="text">
                    <p>VUE</p>
                </div>
            </div>
            <div class="imagen" v-on:click="displayDialog('tf')">
                <img src="images/tensorflow logo.png" alt="">
                <div class="text">
                    <p>TENSORFLOW</p>
                </div>
            </div>
            <div class="imagen" v-on:click="displayDialog('sk')">
                <img src="images/scikitlearn_logo.png" alt="">
                <div class="text">
                    <p>SCIKIT LEARN</p>
                </div>
            </div>
            
            <div class="imagen" v-on:click="displayDialog('java')">
                <img src="images/java_logo.png" alt="">
                <div class="text">
                    <p>JAVA</p>
                </div>
            </div>
        </div>
        <Dialog v-model:visible="displayBasic" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
            <p style="font-size:2rem; text-align: center;">{{contentactual}}</p>
        </Dialog>
    </div>

</template>

<script>

export default {
	data() {
        return {
            contentactual:"actual",
            contentPython:"hola",
            contentjs:"holajs",
            contentvue:"holavue",
            contenttf:"holatf",
            contentsl:"holascikit",
            contentjava:"java",
            displayBasic:false,
        }
    },
    created() {
	
	},
	mounted() {
		
    },
    methods: {
        displayDialog(str){
            if(this.displayBasic==true){
                this.displayBasic=false  
            }else{
                if(str == "python"){
                    this.contentactual = this.contentPython;
                }else if(str == "js"){
                    this.contentactual = this.contentjs;
                }else if(str == "vue"){
                    this.contentactual = this.contentvue;
                }else if(str == "tf"){
                    this.contentactual = this.contenttf;
                }else if(str == "sk"){
                    this.contentactual = this.contentsl;
                }else if(str == "java"){
                    this.contentactual = this.contentjava;
                }else{
                    this.contentactual = "error";
                }
                this.displayBasic=true
            }
            
        }
    },
	computed: {

	},
    components: {
    }
}
</script>

<style>
    .galeria h1{
        text-align: center;
        margin:0 0 15px 0;
        font-weight: 300;
        color: white;
    }

    .linea{
        border-top: 5px solid white;
        margin-bottom: 30px;
    }
    .contenedor-imagenes{
        display: flex;
        width: 85%;
        margin: auto;
        justify-content: space-around;
        flex-wrap: wrap;
        border-radius: 3px;
    }

    .imagen{
        width: 32%;
        position: relative;
        height: 250px;
        margin-bottom: 15px !important;
        box-shadow: 0 0 5px 0 rgb(255, 255, 255, .75);
        
    }

    .imagen img{
        width: 100%;
        height: 100%;
        object-fit: contain ;
        -webkit-transition:all 0.30s ease-in-out;
		-moz-transition:all 0.30s ease-in-out;
		-o-transition:all 0.30s ease-in-out;
		-ms-transition:all 0.30s ease-in-out;
		transition:all 0.30s ease-in-out;
    }

    .text{
        /* background-color: white;
        border-radius: 20px; */
        padding: 5px;
        position:absolute;
        width: 70%;
        top:40%;
        right: 15%;
        visibility: hidden;
        text-align: center;
        transition:all 0.35s ease-in-out;
        
    }

    .text p{
        color: white;
        text-transform: uppercase;
        font-size: large !important;
        font: oblique bold 120% cursive;
    }

    .dialog-content p{
        font-size: 2rem;
    }

    .imagen:hover img{
        filter: blur(3px) brightness(10%);
        /* filter: brightness(10%); */
        opacity: 1;
        background-color: black;
		transform: scale(1.07,1.07);
		-webkit-transform:scale(1.07,1.07);
		-moz-transform:scale(1.07,1.07);
		-ms-transform:scale(1.07,1.07);
		-o-transform:scale(1.07,1.07);
    }

    .imagen:hover > .text{
        opacity: 1;
        visibility: visible;
    }

    @media screen and (max-width: 1000px) {
        .contenedor-imagenes{
            width:95%;
        }
    }

    @media screen and (max-width: 450px) {
        .h1{
            font-size: 32px;
        }
        .contenedor-imagenes{
            width:98%;
        }
        .contenedor-imagenes .imagen{
            width: 80%;
            margin-bottom: 5%;
        }
    }
    
</style>