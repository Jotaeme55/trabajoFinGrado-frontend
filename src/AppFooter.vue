<template>
	<div class="layout-footer">
		
	</div>
</template>

<script>
	export default {
		name: "AppFooter",
		methods: {
			footerImage() {
				return this.$appState.darkTheme ? 'brado pitt.jpg' : 'brado pitt.jpg';
			}
		},
		computed: {
			darkTheme() {
				return this.$appState.darkTheme;
			}
		}
	}
</script>
<style>
	.boba{
		width: 50px;
		object-fit: cover;
	}
</style>