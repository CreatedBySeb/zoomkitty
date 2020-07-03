<template>
	<div id="app">
		<div id="sidebar" :class="!showSidebar ? 'hidden' : ''">
			<h2>
				<button @click="showSidebar = !showSidebar">
					<img class="sidebar-logo" :src="require('./assets/zoomkitty.png').default" alt="" />
				</button>
				<span>{{$localise("general.zoomkitty")}}</span>
			</h2>

			<ul>
				<router-link to="/"><li><i class="fas fa-home"></i><span> {{$localise("sidebar.welcome")}}</span></li></router-link>
				<router-link to="/participants"><li><i class="fas fa-user-friends"></i><span> {{$localise("sidebar.participants")}}</span></li></router-link>
				<router-link to="/allocate"><li><i class="fas fa-map-signs"></i><span> {{$localise("sidebar.allocate")}}</span></li></router-link>
				<router-link to="/about"><li><i class="fas fa-info-circle"></i><span> {{$localise("sidebar.about")}}</span></li></router-link>
			</ul>
		</div>

		<div id="main"><router-view></router-view></div>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		data() {
			return {
				showSidebar: true,
			};
		},
	});
</script>

<style lang="scss">
	@import "./variables.scss";

	#app {
		display: flex;
		height: 100%;
		width: 100%;

		#main {
			flex-grow: 1;
			overflow: auto;
			padding: 1rem 2rem 0.5rem 2rem;
		}

		#sidebar {
			background-color: $dark-grey;
			flex-grow: 0;
			flex-shrink: 0;
			height: 100%;
			overflow-x: hidden;
			transition: width ease-in-out .25s;
			white-space: nowrap;
			width: 12rem;

			&.hidden {
				width: 4rem;

				img, svg.svg-inline--fa {
					margin-right: 0;
				}

				span {
					display: none;
				}
			}

			.sidebar-logo {
				height: 1.2em;
				margin-right: .2em;
				vertical-align: text-bottom;
			}

			a {
				color: inherit;
				text-decoration: none;
			}

			h2 {
				padding: 0 1rem;
			}

			svg.svg-inline--fa {
				width: 1.5em;
			}

			ul {
				padding: 0;

				li {
					&:hover {
						background-color: $almost-black;
					}

					list-style: none;
					padding: 0.5rem 1rem;
				}
			}
		}
	}
</style>
