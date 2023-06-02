<script lang="ts">

</script>


<svelte:head>
    <title>new bot :: aios.bot.flow</title>
</svelte:head>
<div id="bot-edit">
    <form method="POST">
        <div id="bot-card">
            Name: <input name="botName" /><br />
            Token: <input name="token" /><br />
            Icon: <input name="icon" /><br />
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
