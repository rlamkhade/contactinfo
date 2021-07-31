# Angular

This is a project contains CRUD operation on contact information of a person with fields First Name, Last Name, Email, Phone Number and Status.
Angular 8 version is used to create this operation.

TO create a backend-less application by mocking a REST API angular's angular-in-memory-web-api module is used.

The angular-in-memory-web-api module provides an in memory data store where you can create and fetch data and simulates a real REST API back-end. It intercepts Angular HttpClient requests that would otherwise go to the remote server and redirects them to an in-memory data store that you control.

## Get started

### Clone the repo

```shell
git clone https://github.com/rlamkhade/contactinfo.git
cd contactinfo
```

### Install npm packages

Install the `npm` packages described in the `package.json` and verify that it works:

```shell
npm install
```


#### npm scripts

These are the most useful commands defined in `package.json`:

* `npm start` - runs the TypeScript compiler, asset copier, and a server at the same time, all three in "watch mode".
* `npm run build` - runs the TypeScript compiler and asset copier once.
* `npm run build:watch` - runs the TypeScript compiler and asset copier in "watch mode"; when changes occur to source files, they will be recompiled or copied into `dist/`.
* `npm run lint` - runs `tslint` on the project files.
* `npm run serve` - runs `lite-server`.

