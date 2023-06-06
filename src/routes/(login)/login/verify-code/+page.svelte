<script lang="ts">

    export let form: any;
</script>

<div id="login-window">
    Please enter the code you've just received in your email. Check your spam folder if you cannot find it.
    {#if form && !form.success}
    <div class="error-msg">{form.data.errorMsg}</div>
    {/if}
    <form method="POST">
        Code:
        <input name="code" />
        <input type="submit" value="Login" />
    </form>
</div>

<style>
    #login-window {
        width: 500px;
        margin: 0 auto;
        border: 1px black solid;
        border-radius: 4px;
        margin-top: 200px;
        padding: 1rem;
    }
    .error-msg {
        color: red;
    }
</style>
