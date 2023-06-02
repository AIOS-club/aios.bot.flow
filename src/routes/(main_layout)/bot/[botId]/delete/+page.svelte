<script lang="ts">
    export let data;
    
</script>


<svelte:head>
    <title>bot deleting :: aios.bot.flow</title>
</svelte:head>
<div id="bot-delete">
    <form method="POST">
        Are you sure you want to delete bot {data.bot.botName} (#{data.bot.id})?
        <input type="submit" value="Delete" />
    </form>
</div>

<style>
    #bot-delete {
        margin: 3rem;
        border: 1px var(--border-color) solid;
        border-radius: var(--card-border-radius);
        padding: 1rem;
    }
</style>
