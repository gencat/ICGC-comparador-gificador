# Comparador VISOR DE L'EVOLUCIÓ DEL TERRITORI

Tool to compare 2 WMS services. 

**Demo:** http://betaportal.icgc.cat/geogif/index.html

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

The "Generar GIF" button makes a call to the service https://github.com/OpenICGC/wms2gif

### Demo

More information at http://betaportal.icgc.cat/wordpress/geogif/

[![Comparador](http://betaportal.icgc.cat/wordpress/wp-content/uploads/2014/01/Comparador-històric-del-territori.png)](http://betaportal.icgc.cat/geogif/index.html)

Example Gif

[![Example gif](https://github.com/OpenICGC/wms2gif/blob/master/generated/0.gif?raw=true)](http://betaportal.icgc.cat/geogif/index.html)

## License

Copyright (c) 2017- Geostarters (MIT License)  
See LICENSE file for more info.