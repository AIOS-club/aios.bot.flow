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
        config:
          private: boolean  // cannot be used publicly when true.
          gated: boolean  // requires a token to use.
          inputSchema: SCHEMA
          rateLimit: number  // number of requests allowed per second per IP. only works when `private` is false.
          flow: Flow  // not sure.
          output: array of string
          outputSchema: SCHEMA
```

```
Flow: array
    // the variables this step requires.
    <!-- variables: array of string -->
    // the precondition of this step
    <!-- precondition: string -->
    // the prompt that gets populated with `variables` when send to LLM.
    template: string
    // what part of the response get carried over onto other steps.
    effect: string
    // ignore `effect`; the output (interpreted as JSON) gets piped into result.
    result: string
```

the logic:

1.  user provide the input.
2.  check the input against inputSchema.
3.  new env with `input` populated with the input.
4.  for steps in flow:
        1.  populate step.template with input.
        2.  ask LLM.
        3.  perform effect with response.
5.  perform outputEffect
6.  check `output` from env against outputSchema

pseudo-code:

``` javascript
if (!_CheckSchema(userInput, config.inputSchema)) { throw Error(); }
env = {input: userInput};
config.flow.forEach((f) => {
    let prompt = _Instantiate(f.template, env);
    let llmResponse = _AskLLM(prompt);
    _PerformEffect(env, llmResponse, f.result? f.result : f.effect);
});
_PerformEffect(env, config.outputEffect);
if (!_CheckSchema(env.output, config.outputSchema)) { throw Error(); }
return env.output;
```


```
type Schema = "string"
            | "number"
            | "boolean"
            | ["array", Schema]
            | ["map", "number"|"string", Schema]
            | ["object", {[key: string|number]: Schema}]
            | ["oneof", schema1, schema2, ...]
```

``` yaml
# e.g.: 
schema: string
schema: number
schema: boolean
schema:
  - array
  - # schema for elements
schema:
  - map
  - string   # or number
  - # schema for elements
schema:
  - object
  - # kvpairs.
schema:
  - oneof
  - # possible schema branches...
```


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

## Config

### `mailer`

```
type: smtp
config:
  server: [insert data here]
  port: [insert data here]
  email: [insert data here]
  password: [insert data here]
```

Postmark:

```
type: smtp
config:
  token: [insert postmark token here]
```

### `hostname`

Required for github login.

```
string
```

### `github`

Required for github login.

```
clientId: string
clientSecret: string
```
