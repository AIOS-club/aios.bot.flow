<script lang="ts">
</script>
<header id="header">
    <span class="left">
        <a href="/"><b>aios.bot.flow</b></a>
    </span>
    <div class="right">
        <span><a href="/demo">Try without login</a></span>
        <span><a href="/login">Login</a></span>
    </div>
</header>

<style>
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
