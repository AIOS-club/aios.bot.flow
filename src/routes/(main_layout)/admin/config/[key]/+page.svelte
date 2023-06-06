<script lang="ts">
    import * as yaml from 'yaml';

    export let data;

    let resultText = JSON.stringify(data.config.value, undefined, '    ');
    let elemReturn: HTMLInputElement;
    let useYaml: boolean;
    
    function handleUseYaml(e: Event) {
        if (e.target.checked) {
            resultText = yaml.stringify(JSON.parse(resultText));
        } else {
            resultText = JSON.stringify(yaml.parse(resultText), undefined, '    ');
        }
    }

    function handleSubmit(e: Event) {
        if (useYaml) {
            elemReturn.value = JSON.stringify(yaml.parse(resultText));
        } else {
            elemReturn.value = resultText;
        }
    }

</script>

<svelte:head>
    <title>editing config :: aios.bot.flow</title>
</svelte:head>
<div id="config">
    <form method="POST">
        Editing {data.config.key}
        <input name="useYaml" type="checkbox" on:click={handleUseYaml} bind:checked={useYaml}/> Use YAML
        <input type="submit" value="Save" on:click={handleSubmit}/><br />
        <input name="__raw" type="hidden" bind:this={elemReturn} />
        <textarea rows="15" cols="80" bind:value={resultText}></textarea>
    </form>
    <a href="/admin/config">Back</a>
</div>

<style>

</style>

