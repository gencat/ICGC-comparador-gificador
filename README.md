# Comparador VISOR DE L'EVOLUCIÓ DEL TERRITORI

Tool to compare 2 WMS services. 

**Demo:** https://betaportal.icgc.cat/comparador-gificador/

## Installation
Copy the files within a folder on a web server

## Reuse and adaptation

### List of layers

The file listBookmarks.js contains a array of elements (ortos) that are used to fill in the layers drop-down.   

### Search tool

The file listBookmarks.js contains a array of elements (bookmarks) that are those that appear as results in the search tool.

The search tool uses the "NOM" property to search the results.

When selecting a result, the map focuses on the coordinate of the point.

### Create GIF

The "Generar GIF" button makes a call to the service https://github.com/gencat/ICGC-wms2gif

### Demo

More information at http://betaportal.icgc.cat/wordpress/comparadorgif/

[![Comparador](https://betaportal.icgc.cat/wordpress/wp-content/uploads/2018/03/Generador-dimatges-animades_1.png)](https://betaportal.icgc.cat/comparador-gificador/)

Example Gif

[![Example gif](https://github.com/gencat/ICGC-wms2gif/blob/master/generated/0.gif?raw=true)](https://betaportal.icgc.cat/comparador-gificador/)

## License

Copyright (c) 2017- Geostarters (MIT License)  
See LICENSE file for more info.
