[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/philcockfield/create-tmpl.svg?branch=master)](https://travis-ci.org/philcockfield/create-tmpl)
![Header](https://user-images.githubusercontent.com/185555/51378810-daa55200-1b72-11e9-9658-275929147ee9.png)

Succinct, composable, template stamper...🤖...🤖...🤖  
Think of it as your scaffolding superpower.

<p>&nbsp;</p>

### Introduction
Compose directories and files together with [glob](https://en.wikipedia.org/wiki/Glob_(programming)) patterns into a powerful `tmpl` that can be copied anywhere...to the file-system, to memory, wherever.

Add simple `processor` functions to the pipeline to precisely customize each file as it is written, taking variable arguments (via the [API](#API)) or values entered by the user (via the [command-line](#CLI)).

#### Interfaces

- Simple, flexible programmatic control via the [API](#API)
- or rich command-line interaction via the [CLI](#CLI).

### Philosophy
The [best programmers are lazy](http://threevirtues.com). If you do anything [more than three times](http://wiki.c2.com/?ThreeStrikesAndYouAutomate), it might be a **good idea to [automate](http://wiki.c2.com/?AutomationIsOurFriend) it** 🤖

The `create-tmpl` module is here to make creating repeatable scaffolding through templates painless, powerful and low-effort.  So low effort, in fact, you're more than likely to do it.

#### Design principles

- Simple [configuration](Configuration) (or "no-configuration").
- Beautiful [command-line](#CLI) that's fast and fun to use.
- Elegant and extensible [API](#API) for integrating into other modules.

#### Maxims
- [Rule of Three](http://wiki.c2.com/?RuleOfThree) | [Three Strikes And You Automate](http://wiki.c2.com/?ThreeStrikesAndYouAutomate) | [Things in Threes](http://wiki.c2.com/?ThingsInThrees)
- [Useful, Usable, Used](http://wiki.c2.com/?UsefulUsableUsed)


<p>&nbsp;</p>  

---

<p>&nbsp;</p>



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
YAML...TDB

---

### Commands
...TDB

<p>&nbsp;</p>  

---

<p>&nbsp;</p>

## 🌳 API
Working with a `Template` moves through three steps:
1. Template composition (add)
2. Filters and processors
3. Execution

Templates are immutable, meaning any calls to the `.add`, `.filter`, `.process` methods return a new instance of the `Template`.  Conceptually similar to [rxjs](https://github.com/ReactiveX/rxjs).


#### Composition (add)

```ts
type Foo = {}
const Foo:IFoo = 123
```



<p>&nbsp;</p>  

---

<p>&nbsp;</p>

## TODO
- [ ] processor (pre-canned)
  - [ ] writeFile
- [ ] CLI

