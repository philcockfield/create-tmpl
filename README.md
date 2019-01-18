[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/philcockfield/create-tmpl.svg?branch=master)](https://travis-ci.org/philcockfield/create-tmpl)

![tmpl](https://user-images.githubusercontent.com/185555/51378810-daa55200-1b72-11e9-9658-275929147ee9.png)

Succinct, composable, template stamper...🤖...🤖...🤖

<p>&nbsp;</p>

### Introduction
Take a directory, or compose multiple directories and files together with glob patterns, into a powerful `tmpl` that can be copied anywhere...to the file-system, to memory, wherever.

Add simple `transformer` functions to the pipeline to precisely customize each file (or conditionally filter the file out) as it is written based on variable arguments (via the [API](#API)), or values entered by the user in the command-line (via the [CLI](#CLI)).

#### Interfaces

- Simple, flexible programmatic control via the [API](#API)
- or rich command-line interaction via the [CLI](#CLI)

---


## CLI

### Installation
To use the `tmpl` command-line across your machine install it globally:

```
yarn global add create-tmpl
```

then use `tmpl` from any folder:

```
$ tmpl <command> [options]
$ tmpl --help
```


---

### Local Module
To use the `tmpl` command locally within your scripts, add it to your module:

```
yarn add create-tmpl
```

then invoke it from `scripts` within your `package.json` like so:

```json
{
  "name": "my-module",
  "scripts": {
    "postinstall": "tmpl ./node_modules/my-module/setup-template"
  },
  "dependencies": {
    "create-tmpl": "latest"
  }
}
```

---

### YAML Configuration
...

---

### Commands
...

## API
...
