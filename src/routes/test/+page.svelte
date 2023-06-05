<script lang="ts">
    
onMount(async () => {

    let token = 'ak-5vS9SfP3mduZuVVXEM6JUonCsAKEeYgs1eT3gLPhSCEIkRin';
    let template = 'Please suggest a color scheme with a name, a background color, a foreground color and a highlight color. Please reply with these four things as JSON; I need you to reply only with the JSON.';
    
    let fetchReq = await fetch(
        'https://api.aios.chat/v1/chat/completions',
        {
            method: 'POST',
            body: JSON.stringify({
                frequency_penalty: 1,
                temperature: 0.8,
                presence_penalty: -1,
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: template,
                    }
                ],
                stream: false,
            }),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
})
</script>