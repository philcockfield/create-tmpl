[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/philcockfield/create-tmpl.svg?branch=master)](https://travis-ci.org/philcockfield/create-tmpl)
![Header](https://user-images.githubusercontent.com/185555/51378810-daa55200-1b72-11e9-9658-275929147ee9.png)

Succinct, composable, template stamper...🤖...🤖...🤖  
Think of it as your machinary for making scaffolding.

<p>&nbsp;</p>

### Introduction
Compose directories and files together with [glob](https://en.wikipedia.org/wiki/Glob_(programming)) patterns into a powerful `tmpl` that can be copied anywhere...to the file-system, to memory, wherever.

Add `filter` and `transformer` functions to the pipeline to precisely customize each file as it is written, taking variable arguments (via the [API](#API)) or values entered by the user (via the [command-line](#CLI)).

#### Interfaces

- Simple, flexible programmatic control via the [API](#API)
- or rich command-line interaction via the [CLI](#CLI).

### Philosophy
The [best programmers are lazy](http://threevirtues.com). If you do anything [more than three times](http://wiki.c2.com/?RuleOfThree), it might be a **good idea to automate it** 🤖

The `create-tmpl` module is here to make creating repeatable scaffolding through templates painless, powerful and low-effort.  So low effort, in fact, you're more than likely to do it.

#### Design principles:

- Simple [configuration](Configuration) (or "no-configuration").
- Beautiful [command-line](#CLI) that's fast and fun to use.
- Elegant and extensible [API](#API) for integrating into other modules.

#### Patterns
- [Rule of Three](http://wiki.c2.com/?RuleOfThree) | [Things in Threes](http://wiki.c2.com/?ThingsInThrees)
- [Useful, Usable, Used](http://wiki.c2.com/?UsefulUsableUsed)


---


## 🌳 CLI

### Installation
To use the `tmpl` command-line across your machine install it globally:

```bash
yarn global add create-tmpl
```

then use `tmpl` from any folder:

```bash
$ tmpl <command> [options]
$ tmpl --help
```


---

### Local Module
To use the `tmpl` command locally within your scripts, add it to your module:

```bash
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

### Configuration
YAML...

---

### Commands
...

---

## 🌳 API
Concepts:
1. Composition
2. Filters
3. Transformers
4. Writers

...
