# *casket*

***casket* is an HTTP server** that supports `GET`, `POST` and `DELETE` requests. It can respond in HTML, JSON and plain text format, **the HTML-version being a file management UI**.

![casket serving a directory](demo.png)

[![npm version](https://img.shields.io/npm/v/casket.svg)](https://www.npmjs.com/package/casket)
[![dependency status](https://img.shields.io/david/derhuerst/casket.svg)](https://david-dm.org/derhuerst/casket)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/casket.svg)](https://david-dm.org/derhuerst/casket#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/casket.svg)


## Installing

```shell
npm install -g casket
```


## Usage

```
Usage:
	casket [--name my-little-server] [--dir ~/path/to/dir]

Options:
    --name     -n  The name of the server, as shown in the GUI.
    --dir      -d  The directory to serve, default is the current directory.
    --readonly -r  Do not allow deletion of files & uploads.
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/casket/issues).
