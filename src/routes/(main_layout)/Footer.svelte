<script lang="ts">
    import socialNetworkSprite from '$lib/images/sn-sprite.svg';
</script>
<footer id="footer">
    <span class="left">
        &copy; <b>2023 AIOS Club</b>
    </span>
    <span class="right">
        <a class="sn-icon" href="https://github.com/AIOS-club"
            style:lineHeight="100%"
            ><svg width="32" height="32">
                <use href={`${socialNetworkSprite}#github`} />
            </svg></a>
    </span>
</footer>

<style>
    #footer {
        height: 2rem;
        color: var(--foreground-color);
        background-color: var(--background-color);
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        padding: 1rem;
        border-top: 1px #333 solid;
    }
    .right {
        float: right;
        fill: var(--foreground-color);
    }
    .right .sn-icon svg {        
        transition: fill 0.1s ease-in-out, color 0.3s ease-in-out;
        -moz-transition: fill 0.1s ease-in-out, color 0.3s ease-in-out;
        -webkit-transition: fill 0.1s ease-in-out, color 0.3s ease-in-out;
        -o-transition: fill 0.1s ease-in-out, color 0.3s ease-in-out;
    }
    .right .sn-icon svg:hover {
        fill: var(--background-color);
        background-color: var(--foreground-color);
    }

</style>
