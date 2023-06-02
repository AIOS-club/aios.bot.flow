<script lang="ts">
    import * as yaml from 'yaml';
    export let data;

    let yamlConfig = yaml.stringify(data.bot.api);
</script>

<svelte:head>
    <title>bot: {data.bot.botName} :: aios.bot.flow</title>
</svelte:head>
<div id="bot-profile">
    <div id="bot-card">
        {#if data.bot && data.bot.icon}
            <img width="64" height="64" src={data.bot.icon} alt="bot icon" />
        {:else}
            <img width="64" height="64" src="/default-bot-icon.jpg" alt="bot icon"/>
        {/if}
        <b>{data.bot.botName}</b>
        <span class="bot-id">#{data.bot.id}</span>
        {#if data.allowEdit}
        <a href={`/bot/${data.bot.id}/edit`}>Edit</a>
        {/if}
        <br />
        API address root: <code>{window.location.protocol}//{window.location.host}/api/v0/{data.bot.id}</code>
    </div>
    <div id="bot-body">
        <details open>
            <summary>API endpoints</summary>
            {#each data.bot.api as endpoint}
                <details class="bot-endpoint">
                    <summary>
                        <span class={`bot-endpoint-type bot-endpoint-type-${endpoint.type}`}>{endpoint.type}</span>
                        <code class="bot-endpoint-path">{endpoint.path}</code>
                    </summary>
                </details>
            {/each}
        </details>
        {#if data.allowEdit}
        <details>
            <summary>Raw config</summary>
            <details>
                <summary>In YAML</summary>
                <pre>{yamlConfig}</pre>
            </details>
            <details>
                <summary>In JSON</summary>
                <pre>{JSON.stringify(data.bot.api, undefined, '    ')}</pre>
            </details>
        </details>
        {/if}
    </div>
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
    #bot-body {
        padding: 1rem;
    }
    #bot-body details {
        margin-left: 2rem;
    }
    .bot-endpoint-type {
        font-size: 0.8rem;
        color: white;
        background-color: black;
        font-weight: bold;
        padding: 0 0.5rem;
    }
    .bot-endpoint-type-GET { background-color: green; }
    .bot-endpoint-type-POST { background-color: darkslategray; }
</style>
