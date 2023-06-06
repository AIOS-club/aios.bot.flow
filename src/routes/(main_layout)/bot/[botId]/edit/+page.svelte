<script lang="ts">
    import * as yaml from 'yaml';
    export let data;


    let apiData = JSON.parse(data.bot.api);
    let apiEndpointList: any[] = [];
    let useYaml: boolean = false;

    let botBodyElem: HTMLDivElement;
    function handleNewEndpoint(e: MouseEvent) {
        e.preventDefault();
        apiData.push({
            path: '',
            type: 'GET',
            config: {
                input: 'string',
                output: 'string',
            }
        });
        apiData = apiData;
    }
    function handleUseYaml(e) {
        let endpoint = botBodyElem.querySelectorAll('.endpoint-config');
        endpoint.forEach((v) => {
            if (e.target.checked) {
                (v as any).value = yaml.stringify(JSON.parse((v as any).value));
            } else {
                (v as any).value = JSON.stringify(yaml.parse((v as any).value), undefined, '    ');
            }
        })
    }
    function handleMethodChange(i: number, e: Event) {
        apiData[i].type = (e.target as any).value;
        apiData = apiData;
    }
    function handlePathChange(i: number, e: Event) {
        apiData[i].path = (e.target as any).value;
        apiData = apiData;
    }
    function handleDeleteEndpoint(i: number, e: Event) {
        e.preventDefault();
        (apiData as any[]).splice(i, 1);
        apiData = apiData;
    }
    function handleConfigChange(i: number, e: Event) {
        (apiData as any[])[i].config = (
            useYaml? yaml.parse((e.target as any).value)
            : JSON.parse((e.target as any).value)
        );
        apiData = apiData;
    }
    let elemReturn: HTMLInputElement;
    function handleSubmit(e: Event) {
        elemReturn.value = JSON.stringify(apiData);
    }
    
</script>


<svelte:head>
    <title>editing bot "{data.bot.botName}" (#{data.bot.id}) :: aios.bot.flow</title>
</svelte:head>
<div id="bot-edit">
    <form method="POST">
        <div id="bot-card">
            Name: <input name="botName" value={data.bot.botName}/><br />
            Token: <input name="token" value={data.bot.token}/><br />
            Icon: <input name="icon" value={data.bot.icon}/><br />
        </div>
        <div id="bot-body" bind:this={botBodyElem}>
            <b>API</b>
            <input name="useYaml" type="checkbox" on:click={handleUseYaml} bind:checked={useYaml}/> Use YAML<br />
            <button on:click={handleNewEndpoint}>New endpoint</button>
            {#each apiData as endpoint, i}
                <details class="bot-api-endpoint">
                    <summary class="bot-api-endpoint-title">{endpoint.type} {endpoint.path}</summary>
                    <button on:click={(e) => handleDeleteEndpoint(i, e)}>Delete this endpoint</button><br />
                    Path: <select value={endpoint.type} on:change={(e) => handleMethodChange(i, e)}>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                    </select>
                    <input value={endpoint.path} on:change={(e) => handlePathChange(i, e)} required /><br />
                    Config:<br /><textarea class="endpoint-config" rows="10" cols="80" on:change={(e) => handleConfigChange(i, e)}>{JSON.stringify(endpoint.config)||''}</textarea>
                </details>
            {/each}
            <input type="hidden" name="__raw" bind:this={elemReturn}/>
        </div>
        <input type="submit" value="Save" on:click={handleSubmit}/>
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
