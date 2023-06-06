<script lang="ts">
    export let data;
</script>
<div id="login-window">
    <h1>Login via IndieAuth</h1>
    <form action="https://indielogin.com/auth" method="get">
        <label for="url">Web Address:</label>
        <input id="url" type="text" name="me" placeholder="yourdomain.com" />
        <p><button type="submit">Sign In</button></p>
        <input type="hidden" name="client_id" value={data.hostName} />
        <input type="hidden" name="redirect_uri" value={data.redirectUri} />
        <input type="hidden" name="state" value={data.state} />
    </form>
    <hr />
    <details>
        <summary>What is IndieAuth?</summary>
        <p>IndieAuth is a login protocol for Web sign-in that allows users to login with their own domain. You can read more about IndieAuth <a href="https://indieweb.org/IndieAuth">here</a>.</p>
        <p>aios.bot.flow's IndieAuth service is currently provided by IndieLogin.com.</p>
    </details>
    <hr />
    <a href="/login">Back</a>
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
</style>
