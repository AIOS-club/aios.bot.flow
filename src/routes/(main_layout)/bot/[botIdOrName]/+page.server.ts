
export function load({ params }) {
    // TODO: resolve idOrName into id *and* name.
    return {
        params: params,
        bot: {
            id: 1,
            name: 'Dummy Bot',
            author: 'bctnry@outlook.com',
            icon: '',
            api: [
                {
                    path: 'chat-v1',
                    type: 'GET',
                    private: false,
                    gated: false,
                    inputSchema: '',
                    outputSchema: '',
                    flow: [
                        {
                            variables: ['prompt'],
                            template: "{prompt}",
                            responseFormat: "json",
                            effect: "raw"
                        }
                    ],
                    rateLimit: 20,
                }
            ]
        }
    };
}
