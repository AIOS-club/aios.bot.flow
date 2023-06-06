<script lang="ts">
	import Footer from './Footer.svelte';
    import '../../styles.css';
	export let data: import('./$types').LayoutData;
</script>

<div class="app">
	<header id="header">
		<span class="left">
			<a href="/"><b>aios.bot.flow</b></a>
		</span>
		<div class="right">
			{#if data.loggedIn}
				<span><a href={`/user/${data.user.email}`}>{data.user.email}</a></span>
				{#if data.user.role === 'ADMIN'}
				<span><a href="/admin">Admin</a></span>
				{/if}
				<span><a href="/logout">Logout</a></span>
			{:else}
				<span><a href="/login">Login</a></span>
			{/if}
		</div>
	</header>
	<main>
		<slot />
	</main>
	<Footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		margin-left: 3rem;
		margin-right: 3rem;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

    #header {
        height: 2rem;
        color: var(--foreground-color);
        background-color: var(--background-color);
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        padding: 1rem;
        border-bottom: 1px #333 solid;
        display: flex;
    }
    .left {
        flex-grow: 2;
    }
    .left a {
        text-decoration: none;
        transition: background-color 0.1s ease-in-out, color 0.3s ease-in-out;
        -moz-transition: background-color 0.1s ease-in-out, color 0.3s ease-in-out;
        -webkit-transition: background-color 0.1s ease-in-out, color 0.3s ease-in-out;
        -o-transition: background-color 0.1s ease-in-out, color 0.3s ease-in-out;
    }
    .right {
        fill: var(--foreground-color);
    }
</style>
