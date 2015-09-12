# casket

***casket* is an HTTP server** that supports `GET`, `POST` and `DELETE` requests. It can respond in HTML, JSON and plain text format, the HTML-version being a minimalistic file management UI. It is perfect for small home-server setups and offline collaboration, kind of like a very, very small Dropbox.

*casket* is written in CoffeeScript and embraces [prototypal programming](http://davidwalsh.name/javascript-objects-deconstruction#simpler-object-object), making it easily extendable. ***casket* is [MIT-licensed](LICENSE).**

[![npm version](https://img.shields.io/npm/v/casket.svg)](https://www.npmjs.com/package/casket)
[![dependency status](https://img.shields.io/david/derhuerst/casket.svg)](https://david-dm.org/derhuerst/casket)



## Install (globally)

```shell
npm install -g casket
```

You can now start *casket* whereever you want.



## Usage

```shell
casket   # run casket in "live mode"
```

or

```shell
casketd   # run casket in the background
```


### `casket`

```
casket [-n <name>] [-d <directory>] [-p <port>]

Options:
  -n, --name  How the casket server will call itself. Default: casket
  -d, --dir   What casket server will serve. Default: ./public
  -p, --port  Where the casket server will listen. Default: 8000%
```


### `casketd`

```
casketd start <name> [-d <directory>] [-p <port>]
casketd stop <name>

Arguments:
  name        How the casket server will call itself.

Options:
  -d, --dir   What casket server will serve. Default: ./public
  -p, --port  Where the casket server will listen. Default: 8000
```



## Documentation

coming soon!



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/casket/issues).
