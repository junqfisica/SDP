# WebClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Install angular locally

  `npm install @angular/cli`
  
  More of [how to install angular](https://www.npmjs.com/package/@angular/cli)

## Project dependency

This project uses: 

[Bootstrap](https://getbootstrap.com/) 

[ngx-bootstrap](https://valor-software.com/ngx-bootstrap/#/documentation#getting-started)

[ng2-file-upload](https://github.com/valor-software/ng2-file-upload)

[ng2-google-chart](https://www.devrandom.it/software/ng2-google-charts/)


### Installing dependencies
`sudo npm install --save bootstrap@4 jquery@3.4.0 font-awesome`

`sudo npm install ngx-bootstrap --save`

`sudo npm i ng2-file-upload --save`

`sudo npm i npm i --save ng2-google-charts`

You can skip the next step if you cloned the project. The file `angular.json` should be ok.

After installing go to `angular.json` file and add at styles and scripts the .css and .js files:

	"styles": [
	  "./node_modules/bootstrap/dist/css/bootstrap.min.css",
	  "node_modules/font-awesome/css/font-awesome.min.css"
	],
	"scripts": [
	  "./node_modules/jquery/dist/jquery.min.js",
	  "./node_modules/bootstrap/dist/js/bootstrap.min.js"
	],

### Fixing dependencies vulnerability

Check vulnerability:

`sudo npm audit` 

Run fix to update the packages. This will update the package.json and package-lock.json files.

`sudo npm audit fix`

Afer fix you must force angular to actually update the packages:

`sudo ng update @angular/cli --force`

`sudo ng update @angular/compiler-cli --force`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
