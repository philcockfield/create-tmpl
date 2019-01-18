[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/philcockfield/create-tmpl.svg?branch=master)](https://travis-ci.org/philcockfield/create-tmpl)

![tmpl](https://user-images.githubusercontent.com/185555/51378810-daa55200-1b72-11e9-9658-275929147ee9.png)

Succinct, composable, template stamper...🤖...🤖...🤖

<p>&nbsp;</p>

### Introduction
Take a directory, or compose multiple files and directories, into a template that can be copied to the file-system or memory.  Add simple transformers to the pipeline to precisely customize each file, or conditionally filter the file out, before it is written based on programmatic variables (via the [API](#API)), or values entered by the user into the command-line (via the [CLI](#CLI)).

---


## CLI

### Installation
To use the `tmpl` command-line across your machine install it globally:

```
yarn global add create-tmpl
```

then use the `tmpl` command from any folder:

```
$ tmpl <command> [options]
$ tmpl --help
```


---

### Local Module
To use the `tmpl` command locally within you module scripts:

```
yarn add create-tmpl
```

and invoke it within your `package.json` like:

```json
{
  "name: "my-module",
  "scripts": {
    "postinstall": "tmpl ./node_modules/my-module/setup-template"
  },
  "dependencies": {
    "create-tmpl": "latest"
  }
}
```

---

### Commands


## API

