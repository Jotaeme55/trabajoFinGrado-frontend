<template>
	<div class="grid" style="align-items: center;">
		<div class="col-12">
			<div class="card" style="background-color: #b6ccde;">
				<div class="text-align-center" style="text-align:center">
				<h3 style="color:#18042c; font-size:2.5rem; font-family: 'Oswald', sans-serif;">Registro</h3>
				<br>
				</div>
				<div class="p-fluid formgrid grid">
					<div class="field col-12 md:col-4">
						<label for="nombre">Nombre*</label>
						<InputText v-model="user.nombre" required="true" id="nombre" type="text" autofocus :class="{'p-invalid': enviado && errorNombre}"/>
						<small class="p-invalid" :key="errorNombre" v-show="enviado && errorNombre">{{this.errorNombre}}</small>
					</div>
					<div class="field col-12 md:col-4">
						<label for="apellidos">Apellido/s*</label>
						<InputText v-model="user.apellidos" required="true" id="apellidos" type="text" :class="{'p-invalid': enviado && errorApellido}"/>
						<small class="p-invalid" :key="errorApellido" v-if="enviado && errorApellido">{{this.errorApellido}}</small>
					</div>
					<div class="field col-12 md:col-4">
						<label for="username">Nombre de usuario*</label>
						<InputText v-model="user.username" required="true" id="username" type="text" :class="{'p-invalid': enviado && errorUser}"/>
						<small class="p-invalid" :key="errorUser" v-if="enviado && errorUser">{{this.errorUser}}</small>
					</div>
					<div class="field col-12 md:col-4">
						<label for="password">Contraseña*</label>
						<InputText v-model="user.password" required="true" id="password" type="password" :class="{'p-invalid': enviado && errorPassword}"/>
						<small class="p-invalid" :key="errorPassword" v-if="enviado && errorPassword">{{this.errorPassword}}</small>
					</div>
					<div class="field col-12 md:col-4">
						<label for="password_confirm">Confirmación de la Contraseña*</label>
						<InputText v-model="user.password_confirm" required="true"  id="password_confirm" type="password" :class="{'p-invalid': enviado && errorConfirmPassword}"/>
						<small class="p-invalid" :key="errorConfirmPassword" v-if="enviado && errorConfirmPassword">{{this.errorConfirmPassword}}</small>
					</div>
					<div class="field col-12 md:col-4">
						<label for="email">Email</label>
						<InputText v-model="user.email" id="email" :class="{'p-invalid': enviado && errorEmail}"/>
						<small class="p-invalid" :key="errorEmail" v-if="enviado && errorEmail">{{this.errorEmail}}</small>
					</div>
					<div class="field col-12 md:col-4">
						<label for="telefono">Teléfono*</label>
						<InputNumber v-model="user.telefono" aria-valuenow="" required="true" id="telefono" :class="{'p-invalid': enviado && errorTelefono}" :useGrouping="false"/>
						<small class="p-invalid" :key="errorTelefono" v-if="enviado && errorTelefono">{{this.errorTelefono}}</small>
					</div>
					
				</div>
			</div>
			<div class="p-fluid formgrid grid">
				<div class="field col-12 md:col-2 md:col-offset-5">
					<Button label="Guardar" style="background-color:lightsteelblue; color:#18042c;" @click="guardar"/>
				</div>
				<div class="field col-12 md:col-2 md:col-offset-3">
					<Button label="Volver" style="background-color:lightsteelblue; color:#18042c;" @click="volver"/>
				</div>
			</div>
		</div>
    </div>


	
</template>

<script>
	import UserService from "../service/UserService";
	export default {
		data() {
			return {
				userExists: null,
				user: {},
				enviado: false,
				prueba: null,
				dieta_pref: null,
				errorNombre: null,
				errorApellido: null,
				errorUser: null,
				errorEmail: null,
				errorPassword: null,
				errorTelefono: null,
			}
		},
		userService: null,
	mounted (){
		this.user;
		this.errorNombre;
	},
	created(){
		this.userService = new UserService;
	},
	methods: {
		guardar() {
			this.enviado = true;
			//HACER COMPROBACIONES PERTINENTES DE LOS CAMPOS
			let comprobado = this.comprobarCampos();
			if(comprobado){
                delete this.user.password_confirm;
                this.userService.guardar(this.user).then(() => {
					//REDIRIGIR A LA PAGINA DE LISTADO CON UN TOAST DE CONFIRMACIÓN
					this.$router.push({ name: 'login', params: {mensaje: 'registroRealizado'} });
				})
				.catch((e)=>{
					//SI OCURRE ALGÚN FALLO AL INSERTAR EN LA BD, MOSTRAR
					console.log('error' + e);
					this.$toast.add({severity:'error', summary: 'Fallo', detail: 'No se ha podido registrar correctamente, lo sentimos.', life: 3000});
				})
			}
		},
		comprobarCampos()
		{
			let regexLetras = /^[A-zÀ-ÿ ]+$/;
			/* eslint-disable */
			let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			let resultado = true;
			if(!this.user.nombre || !regexLetras.test(this.user.nombre))
			{
				resultado = false;
				this.errorNombre = 'El nombre es obligatorio y solo puede tener letras';
			}else{
				this.errorNombre = null;

			}
			if(!this.user.apellidos || !regexLetras.test(this.user.apellidos))
			{
				resultado = false;
				this.errorApellido = 'El campo apellidos es obligatorio y solo puede tener letras';
			}else{
				this.errorApellido = null;

			}
			this.userService.getUser(this.user.username).then(data => {this.userExists = data
			
			if(!this.user.username)
			{
				
				resultado = false;
				this.errorUser = 'El nombre de usuario es obligatorio';

			}else{
				if(this.userExists)
				{
					resultado = false;
					this.errorUser = 'El nombre de usuario ya está en uso';

				}else{
					this.errorUser = null;
					
				}
				
			}
				  
			this.$forceUpdate();
			})
			if(!this.user.password || this.user.password.length < 8)
			{
				resultado = false;
				this.errorPassword = 'La contraseña es obligatoria y debe tener al menos 8 carácteres';

			}else{
				this.errorPassword = null;
				
			}
			if(this.user.password !== this.user.password_confirm)
			{
				resultado = false;
				this.errorConfirmPassword = 'Las contraseñas no coinciden';

			}else{
				this.errorConfirmPassword = null;
			}
			if(!regexEmail.test(this.user.email) && this.user.email)
			{
				resultado = false;
				this.errorEmail = 'El email no es válido';

			}else{
				this.errorEmail = null;
				
			}
			if(!this.user.telefono || this.user.telefono.toString().length !== 9)
			{
				resultado = false;
				this.errorTelefono = 'El telefono es obligatorio y debe contener 9 dígitos';

			}else{
				this.errorTelefono = null;
				
			}
			
			
			this.$forceUpdate();
			return resultado;
			
		},
		volver()
		{
			this.$router.push('/login');
		}
	}
	}
</script>