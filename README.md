[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/philcockfield/create-tmpl.svg?branch=master)](https://travis-ci.org/philcockfield/create-tmpl)
![Header](https://user-images.githubusercontent.com/185555/51378810-daa55200-1b72-11e9-9658-275929147ee9.png)

Succinct, composable, template stamping pipeline.  
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
- [Rule of Three](http://wiki.c2.com/?RuleOfThree) | [Three Strikes And You Automate](http://wiki.c2.com/?ThreeStrikesAndYouAutomate)
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
Working with a `Template` moves through three stages:
1. Template [composition](#Composition (add source files))
2. [Filters](#Filtering) and [processors](#Processors)
3. Execution

Templates are immutable, meaning any calls to the `.add`, `.filter`, `.process` methods return a new instance of the `Template` (conceptually similar to [rxjs](https://github.com/ReactiveX/rxjs)).

<p>&nbsp;</p>  

### Composition (add source files)
A template is composed of one or more file locations consisting of a directory and an optional [glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern (default is `**`, everything).  

Template files that are added later with the same paths will override earlier paths.  Use this capability to create base template folders and then compose together more specialised templates that incrementally expand and alter the base set of files.

```typescript
import { tmpl } from 'create-tmpl'

const template = tmpl
  .create()
  .add({ dir: './templates/one' })
  .add({ dir: './templates/two', pattern: '**/*.md' });
```

To see the resulting files that make up the template:

```typescript
const files = await template.files();
```


<p>&nbsp;</p>

### Filtering
Create a subset of the template using filters:

```typescript
const markdown = template.filter((file) => file.path.endsWith('.md'));
const files = await markdown.files(); // Nowe only markdown files.
```

<p>&nbsp;</p>

### Processors
A pipeline of processors provide the mechanism for transforming templates and saving them to the file-system, or wherever you need to send the execution result.  Processors are conceptually equivalent to [express middleware](https://expressjs.com/en/guide/using-middleware.html):

```typescript
import { tmpl, path, fs } from 'create-tmpl'

const template = tmpl
  .create()
  .add({ dir: './tmpl-1' })
  .add({ dir: './tmpl-2' })

  .process((req, res) => {
    // Transform the text content of files (naive example).
    res
      .replaceText(/__GREETING__/g, 'Hello')
      .next(); // Signal to move to next processor.
  })

  .process(async (req, res) => {
    // Save the file to disk.
    const dir = path.resolve('./output')
    await fs.ensureDir(dir);
    await fs.writeFile(path.join(dir, req.path), req.buffer);

    // Signal the operation is complete (no more processor will run).
    res.complete(); 
  });
```

<p>&nbsp;</p>

### Execution
We now have a configured template that will transform text files and save them to disk when executed.  
Let's execute it:

```typescript
await template.execute()
```


---

<p>&nbsp;</p>

## TODO
- [ ] processor (pre-canned)
  - [ ] writeFile
- [ ] CLI
- pass variables to processors.

- Docs
  - examples with varibles