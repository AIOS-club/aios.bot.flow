<script lang="ts">
    import * as yaml from 'yaml';
    export let data;

    let api: string = data.bot.api;

    function handleUseYaml(e) {
        if (e.target.checked) {
            api = yaml.stringify(JSON.parse(api));
        } else {
            api = JSON.stringify(yaml.parse(api), undefined, '    ');
        }
    }
    
</script>


<svelte:head>
    <title>bot editor :: aios.bot.flow</title>
</svelte:head>
<div id="bot-edit">
    <form method="POST">
        <div id="bot-card">
            Name: <input name="botName" value={data.bot.botName}/><br />
            Token: <input name="token" value={data.bot.token}/><br />
            Icon: <input name="icon" value={data.bot.icon}/><br />
        </div>
        <div id="bot-body">
            <b>API</b> <input name="useYaml" type="checkbox" on:click={handleUseYaml} /> Use YAML<br />
            <textarea name="botFlow" rows="25" cols="80" bind:value={api}></textarea><br />
        </div>
        <input type="submit" value="Save" />
    </form>
</div>

<style>
    #bot-edit {
        margin: 3rem;
        border: 1px var(--border-color) solid;
        border-radius: var(--card-border-radius);
        padding: 1rem;
    }
    #bot-card {
        margin: 1rem;
        border-bottom: 1px var(--border-color) solid;
        padding-bottom: 1rem;
    }
    #bot-body {
        margin: 1rem;
        border-bottom: 1px var(--border-color) solid;
        padding-bottom: 1rem;
    }
</style>
