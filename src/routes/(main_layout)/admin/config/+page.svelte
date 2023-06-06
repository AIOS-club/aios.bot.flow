<script lang="ts">
    import * as yaml from 'yaml';

    export let data;
    let newKeyValue: string = '';

</script>


<div id="config">
    <form action="?/new" method="POST">
        <input name="key" required/>
        <input type="submit" value="New Config" />
    </form>
    <hr />
    {#each data.configList as config}
    <details>
        <summary>{config.key} <a href={`/admin/config/${config.key}`}>Edit</a></summary>
        <pre>{yaml.stringify(config.value)}</pre>
    </details>
    {/each}
</div>

<style>

</style>
