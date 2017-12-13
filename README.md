# Comparador Costa

Tool to compare 2 WMS services. 

**Demo:** http://betaportal.icgc.cat/comparador-costa/index.html

## Installation
Copy the files within a folder on a web server

## Reuse and adaptation

### Change base layers to compare
In the index.js file modify the variables service (1 or 2), layer (1 or 2) and attribution (1 or 2).

Example
- service1: contains the URL of the WMS service that is displayed in the window on the left of the application
- layer1: name of the WMS service layer to be displayed
- attribution1: text of attribution of the layer.

### Search tool

The file listBookmarks.js contains a geojson of elements (points) that are those that appear as results in the search tool.

The search tool uses the "NOM" property to search the results.

When selecting a result, the map focuses on the coordinate of the point.

### Demo

More information at http://betaportal.icgc.cat/wordpress/visorcosta/

[![Compare side by side](http://betaportal.icgc.cat/wordpress/wp-content/uploads/2017/01/Comparador_costa_2.jpg)](http://betaportal.icgc.cat/comparador-costa/index.html)

[![Compare slider](http://betaportal.icgc.cat/wordpress/wp-content/uploads/2017/01/Comparador_costa_3.jpg)](http://betaportal.icgc.cat/comparador-costa/index.html)

## License

Copyright (c) 2017- Geostarters (MIT License)  
See LICENSE file for more info.