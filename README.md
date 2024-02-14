# Amalia

Amalia is an extensible and versatile HTML5 multimedia player (open source) that allows you to view any type of metadata along with your video or audio streams. 
It follows the responsive design guidelines. Although initially developed as a tool to visualize the metadata extracted automatically by our algorithms (you can see some prototypes online), we believe it can be useful more broadly.
Amalia is composed of three main parts :
- the core player
- the unified metadata format
- the visualization plugins

## Development

Run `npm start` for a dev server. Navigate to `http://localhost:4000/`.
The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
> Before build this script [build icon](#build-icon).

### Build icon

We use SVG Sprites With Fragment Identifiers for optimization the rendering of the icons. 
For build SVG Sprites we use only [svg-sprite](#https://github.com/jkphl/svg-sprite) module.
Run `npm run build-icon`.

### Running Test with coverage report

Run `npm run build-test`.


### Run examples

Run `npm run start-examples` start static server for view examples.  

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

In side docker ` docker run --rm -ti -v $PWD:/usr/src:rw -w /usr/src  --entrypoint='' trion/ng-cli-karma npm run build-test`

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Debugging with webstrome / phpstrome
- In first you need to install chrome extension and right click the chrome extension and clic to inspect.
- Crate launcher angular cli and launch in debug mode.

### Install Chrome extension
 
[Doc](https://chrome.google.com/webstore/detail/jetbrains-ide-support/hmhgeddbohgjknpmjagkdomcpobmllji)

### Create launcher
[Doc](https://blog.jetbrains.com/webstorm/2017/01/debugging-angular-apps/)


## NPM configuration

### Config repo ina

```shell
npm set strict-ssl false
npm config set @ina:registry https://repo.sas.ina/repository/npm-snapshots
npm login --registry=https://repo.sas.ina/repository/npm-snapshots --scope=@ina
```
### Publish to npm
For publishing you need to login in local repository [config](#npm-configuration)
Run `npm run publish-local-repo` this script use package-public.json config file for publishing to the repository.
> Before publish you need to [build project](#build) 
### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


### Change log

We'll keep track of each release in the [CHANGELOG.md](./CHANGELOG.md)

# Versioning

Font Awesome will be maintained under the Semantic Versioning guidelines as much as possible. Releases will be numbered
with the following format:

`<major>.<minor>.<patch>`

# Version

Les versions des dépendances utilisées


* angular : V 9 
* rxjs : V 6.5.5 
* jasmine : V 3.4.0 
* eslint : V 5.15.0 
* karma : V 5.0.2 
* typescript : V 3.7.5 
* node : V 14 
* hls.js : V 1.4.12







