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
    // has to be array because we can have more than 1 request type under
    // the same path.
    api: array
        // versioning: i guess we'll just do something like `image-v1` `image-v2`...
        path: string
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
    // the precondition of this step
    precondition: string
    // the prompt that gets populated with `variables` when send to LLM.
    template: string
    // how to interpret the response
    // NOTE: the "csv" is not actually csv; in a csv each record is separated by
    //       newline, here each record is separated by semicolon, so it's really
    //       comma-semicolon separated values, or "cssv".
    responseFormat: "csv"|"json"
    // what part of the response get carried over onto other steps.
    effect: string
```

the logic:

1.  user provide the input.
2.  for step in flow:
        1.  populate step.template with input.
        2.  ask LLM.
        3.  perform effect with response.

### The effect language

each line is in the format of `[variable-name]=[expression]`.

expression supports any combination of follows:

+ `[number]` - retrieve element from array
+ `.key-name` - retrieve value with key from object.
+ `#number`/`#boolean`/`#string` - convert to number/boolean/string.

when the responseFormat is json, their semantics are obvious; not so much when it's csv, so we have the following rules:

+ `[number1][number2]` selects the `number1` record and then its `number2` field.

  ```
  a,b,c,d,e;
  f,g,h,i,j;
  k,l,m,n,o;
  ```

  `[1][2]` would retrieve the `h` in the `f,g,h,i,j` row.

+ `.key-name` uses the first row as key names. you still refer to the second row as `[1]`.

  ```
  a,b,c,d,e;
  f,g,h,i,j;
  k,l,m,n,o;
  ```

  `[2].b` would select the `l` in the `k,l,m,n,o` row.

rules about the converting thing:

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
+ -4001: does not have such bot.
+ -4002: bot does not have such endpoint.
+ -5001: internal error (`data` may contain extra errmsg)
