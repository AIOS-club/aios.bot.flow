<script lang="ts">
    export let data;

    let iconUrl = data.user.icon;

    function handleUseGravatar(e) {
        e.preventDefault();
        iconUrl = data.gravatarIcon;
    }
    function handleReset(e) {
        e.preventDefault();
        iconUrl = '/default-user-icon.jpg';
    }
</script>


<div id="user-profile">
    <form method="POST">
        Icon: <input name="icon" bind:value={iconUrl} />
        <button on:click={handleUseGravatar}>Use Gravatar</button>
        <button on:click={handleReset}>Reset</button>
        <br />
        {#if data.canSetAdmin}
        Role: <select name="role" value={data.user.role}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
        </select>
        {/if}
        <hr />
        <input type="submit" value="Save" />
    </form>
</div>

<style>
    #user-profile {
        margin: 3rem;
        border: 1px var(--border-color) solid;
        border-radius: var(--card-border-radius);
        padding: 1rem;
    }
</style>
