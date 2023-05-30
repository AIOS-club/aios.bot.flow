<script lang="ts">
    export let data;
</script>

<svelte:head>
    <title>user: {data.params.userEmail} :: aios.bot.flow</title>
</svelte:head>
<div id="user-profile">
    <div id="user-card">
        {#if data.user && data.user.icon}
            <img width="64" height="64" src={data.user.icon} alt="user icon" />
        {:else}
            <svg width="64" height="64">

            </svg>
        {/if}
        <b>{data.params.userEmail}</b><br />
    </div>
    <details open id="user-bot-list">
        <summary>Bots</summary>
        {#if data.user.bot}
            {#each data.user.bot as bot}
                <div class="user-bot-item">
                    <img width="32" height="32" src={bot.icon} alt="bot icon" />
                    <b>{bot.name}</b> {bot.latestVersion}
                    <a href={`/bot/${bot.id}`}>Details</a>
                </div>
            {/each}
        {/if}
    </details>
</div>

<style>
    #user-profile {
        margin: 3rem;
        border: 1px var(--border-color) solid;
        border-radius: var(--card-border-radius);
    }
    #user-card {
        margin: 1rem;
        border-bottom: 1px var(--border-color) solid;
        padding-bottom: 1rem;
    }
    #user-bot-list {
        margin: 1rem;
    }
    .user-bot-item {
        margin: 1rem;
    }
</style>
