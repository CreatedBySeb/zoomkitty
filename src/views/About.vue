<template>
	<div id="about" class="view">
		<img :src="require('../assets/zoomkitty.png').default" alt="" />
		<h1>Zoomkitty</h1>
		<h4>Created by S&eacute;bastien Dunne Fulmer | Version {{version}}</h4>

		<h3>Special Thanks To:</h3>

		<p>
			The Hist, The Phil and the Bristol Debating Union for help with testing<br />
			Braedon Lehman and the Berlin Debating Union for their materials from the Berlin Online IV<br />
			The participants of the Trinity Online Open 2020<br />
		</p>

		<h3>License</h3>

		<p>
			This software is shared under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license.
		</p>

		<p>
			In brief, this means that you are able to use and modify this work freely as long as you provide correct attribution, share the resulting work under a similar license and use it for a non-commercial use. Use for commercial purposes (such as for-profit or fundraising events) may be granted on a case-by-case basis by the author.
		</p>

		<p>
			The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damagers or other liability arising from, out of or in connection with the software or other dealings in the software.
		</p>

		<a @click="$root.open('http://sebastienfulmer.com')" class="button">My Website</a>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		data(): any {
			return {
				version: require("../../package.json").version,
			};
		},

		methods: {
		},
	});
</script>

<style lang="scss">
	#about {
		text-align: center;

		img {
			height: 8rem;
		}
	}
</style>
