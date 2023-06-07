# How to configure a bot (for now (June 2023))

The basic execution flow of a bot goes as follow:

1.  there would be an `env` dictionary.
2.  if there's an input (e.g. a POST endpoint), that input got put under `env.input`.
3.  for step in flow:
    1.  replace any `{key}` with the value of `env[key]`.
    2.  check if there's a `responseFormat` config; if there isn't, it would force the LLM to generate JSON when asking.
    3.  ask the LLM with the template replaced with variable values.
    4.  parse the answer from LLM as a JSON object (or keep it as a raw string, if `responseFormat` is set). store this value in `env[result]`.
4.  in the config there would be an `output` option; this option is used to collect result from `env`.


``` yaml
# bot api root: /api/v0/1
# GET /generate-color-scheme
flow:
  - result: output
    template: >
      Please suggest a color scheme with a name, a background color, a
      foreground color and two highlight colors.
output:
  - output
```

Thus `GET /api/v0/1/generate-color-scheme` would return result like this:

``` json
{
  "code": 0,
  "message": "",
  "data": {
    "output": {
      "name": "Midnight Dreams",
      "background_color": "#1A1A1A",
      "foreground_color": "#D7D7D7",
      "highlight_color_1": "#6B5B95",
      "highlight_color_2": "#FF7733"
    }
  }
}
```

The only step of the flow did not specify a responseFormat; the result is thus returned as a JSON object.

The `code` and `message` part is for representing success/failure state (described in `datastructure.md`).

Example for a POST endpoint:

``` yaml
flow:
  - result: colors
    template: >
      Please generate a color scheme based on the notion of {input}. A color
      scheme has three colors: background color, foreground color, highlight
      color.
  - effect: |
      output=*str
    template: >
      Here is a color scheme named {input} with its background, foreground and
      highlight color: {colors}. Please generate HTML code to demonstrate this
      color scheme.
    responseFormat: HTML
output:
  - colors
  - output
```

Result:

``` json
{
    "code": 0,
    "message": "",
    "data": {
        "colors": {
            "background": "#1a1a1a",
            "foreground": "#ffffff",
            "highlight": "#ff00ff"
        },
        "output": "<!DOCTYPE html>\n<html>\n  <head>\n    <title>City Neon Color Scheme</title>\n    <style>\n      body {\n        background-color: #1a1a1a;\n        color: #ffffff;\n      }\n      \n      h1 {\n        color: #ff00ff;\n      }\n      \n      p {\n        text-shadow: 2px 2px #ff00ff;\n      }\n    </style>\n  </head>\n  \n  <body>\n    <h1>Welcome to City Neon</h1>\n    \n    <p>This is a sample text to demonstrate the City Neon color scheme. The background color is #1a1a1a, foreground (text) color is #ffffff and the highlight color is #ff00ff.</p> \n  </body> \n</html>"
    }
}
```

There are two fields in `data` now because `output` config specified `env.colors` and `env.output`.

NOTE: as of now (2023.6) history is not retained; each step is independent, so you need to include enough context for each step.
