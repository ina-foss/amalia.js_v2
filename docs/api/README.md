[Amalia](README.md) › [Globals](globals.md)

# Amalia

# Amalia

Amalia is a extensible and versatile HTML5 multimedia player that allows you to view any type of metadata along with your video or audio streams. 
It follows the responsive design guidelines. Although initially developed as a tool to visualize the metadata extracted automatically by our algorithms (you can see some prototypes online), we believe it can be useful more broadly.
Amalia is composed of three main parts :
- the core player
- the unified metadata format
- the visualization plugins

## Quick start

The easiest way to integrate the amalia player in your application is to use the fully packaged version.
All the third party libraries are provided along with the player code in one simple file for javascript and css parts.

If you start your HTML page from scratch, add the following lines in the <header> section of your HTML page :

```html
    <script type="text/javascript"  src="amalia.min.js" type="module"></script>
```
      
In the <body> section of your HTML page, you can add <amalia> element to instantiate the player. 
In our example,we add control bar plugin and we choose to limit the global height of the player.

```html
    <div style="height: 350px;">
        <amalia-player player-id="p1" config='{"player":{"src":"https://www.w3schools.com/html/mov_bbb.mp4"}}'>
                <amalia-control-bar player-id="p1"></amalia-control-bar>
        </amalia-player>
    </div>
```
Player source is only mandatory parameter. You can use any media format that is compatible with the targeted browsers of your application. 
Typically, for videos, you have to encode your files with h.264 and use mp4 container.
For a complete list of initialization parameters of amalia.js, see the documentation below.

## Install amalia player with angular
In start you need to install amalia player dependency,see the [documentation](#npm-configuration)] below.

Add the following lines in the your angular.json config, for use amalia assets in your application :

```json
      ...
            "assets": [
              ...
              {
                "glob": "amalia.min.js",
                "input": "node_modules/@ina/amalia/",
                "output": "./assets/"
              },
              {
                "glob": "**/*",
                "input": "node_modules/@ina/amalia/assets",
                "output": "./assets"
              }
            ]
      ...
```

Add the following lines in the <header> section of your HTML page :

```html
    <script src="assets/amalia.min.js" type="module"></script>
```

Allow your application to use custom html tag, add the following under @NgModule({})in 'app.module.ts' :

```js
import {CUSTOM_ELEMENTS_SCHEMA} from `@angular/core`;
```

and then
```json
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
```
Follow amalia usage samples .

## Install via package manager (Npm)
Before install amalia player with Npm, you need to configure enterprise repository manager.

### Set local repository
   
```sh
   npm set strict-ssl false
   npm config set @ina:registry https://repo.sas.ina/repository/npm-snapshots
```

### Install  Amalia player

```sh
npm install @ina/amalia --save
```
