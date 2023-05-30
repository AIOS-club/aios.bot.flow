# data structure

(NOTE: "CC" in this document refers to "classical computing", i.e. without LLM.)

very early draft. may change drastically.

## bot

```
Bot:
    id: number  // auto-filled;
    name: string
    author: string
    icon: string
    // retrieved from the `flow` field in the db.
    api: object
        // versioning: i guess we'll just do something like `image-v1` `chat-v2`...
        [endpoint]:
            type: string  // GET, POST, that kind of stuff.
            private: boolean  // cannot be used publicly when true.
            gated: boolean  // requires a token to use.
            inputSchema: SCHEMA
            outputSchema: SCHEMA
            flow: Flow  // not sure.
            rateLimit: number  // number of requests allowed per second per IP. only works when `private` is false.
```

```
Flow: array
    // the variables this step requires.
    variables: array of string
    // the prompt that gets populated with `variables` when send to LLM.
    template: string
    // how to interpret the re
    responseFormat: ???
    // what part of 
    effect: ???
```

the logic:

1.  user provide the input.
2.  for step in flow:
        1.  populate step.template with input.
        2.  ask LLM.
        3.  perform effect with response.

## schema

+ currently only 4 kind of objects: number, string, boolean, object.
+ object are kvpairs whose values can be other objects.

## external api

wrapping external services to use in aios.bot.flow

(NOTE 2023.5.26: maybe next time?)

```
ExternalApi:
    id: number  // auto-filled;
    name: string
    rootUrl: string  // root URL
    api: array
        [endpoint]:
            type: string  // GET, POST, etc..
            inputSchema: SCHEMA
            outputSchema: SCHEMA
```

## api response

Ok response:

```
code: 0
message: string
data: SCHEMA
```

Error response:

```
code: number  // negative
message: string
data: string|null
```

Errors:

+ -2001: bot does not have a token
+ -2002: bot ran out of points
+ -2004: api is for private use only.
+ -3001: input failed to accompany 
+ -4001: does not have such user.
+ -4002: does not have such bot.
+ -4003: bot does not have such endpoint.
+ -5001: internal error (`data` may contain extra errmsg)
