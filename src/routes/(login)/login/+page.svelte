<div id="login-window">
    <h1>Login</h1>
    <form method="POST">
        Email:<br />
        <input id="email" name="email" type="email">
        <input type="submit" value="Login" />
    </form>
    <hr />
    Or:<br />
    <a href="/login/via-github">Login via GitHub</a><br />
    <a href="/login/via-indieauth">Login via IndieAuth</a><br />
    <hr />
    <a href="/">Back</a>
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
