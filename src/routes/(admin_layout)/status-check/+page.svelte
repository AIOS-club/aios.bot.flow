<script lang="ts">
    import type { RequestEvent } from "@sveltejs/kit";
    import { Redis } from "ioredis";
    import { onMount } from "svelte";

    let redisUrl: string;
    let redisChk: boolean|undefined = undefined;
    function handleCheck(e) {
        let a = new Redis(redisUrl, {lazyConnect: true});
        a.connect().then(() => {
            redisChk = true;
            a.disconnect();
        }).catch((e) => {
            redisChk = false;
            console.log(e);
        });
    }

</script>

<div id="status-check">
    Redis: <input bind:value={redisUrl} /><br />
    <button on:click={handleCheck}>Check</button>
    <div>
        <b>Redis:</b>
        {#if redisChk === undefined}
        Checking...
        {:else if redisChk}
        OK
        {:else}
        FAIL
        {/if}
    </div>
</div>