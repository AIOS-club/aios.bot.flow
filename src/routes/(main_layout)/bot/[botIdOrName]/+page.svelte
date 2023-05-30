<script lang="ts">
    export let data;

</script>

<svelte:head>
    <title>bot: {data.bot.name} :: aios.bot.flow</title>
</svelte:head>
<div id="bot-profile">
    <div id="bot-card">
        {#if data.bot && data.bot.icon}
            <img width="64" height="64" src={data.bot.icon} alt="bot icon" />
        {:else}
            <svg width="64" height="64">

            </svg>
        {/if}
        <b>{data.bot.name}</b>
        <span class="bot-id">#{data.bot.id}</span>
    </div>
    <details>
        <summary>API endpoints</summary>
        {#each data.bot.api as api}
            <div class="bot-api-endpoint">
                <span class={`bot-api-endpoint-method bot-api-endpoint-method-${api.type}`}>{api.type}</span>
                <span class="bot-api-endpoint-path">{api.path}</span>
                <div class="bot-api-input-schema">

                </div>
                <div class="bot-api-output-schema">
                    
                </div>
            </div>
        {/each}
    </details>
</div>

<style>
    #bot-profile {
        margin: 3rem;
        border: 1px var(--border-color) solid;
        border-radius: var(--card-border-radius);
    }
    #bot-card {
        margin: 1rem;
        border-bottom: 1px var(--border-color) solid;
        padding-bottom: 1rem;
    }
</style>
