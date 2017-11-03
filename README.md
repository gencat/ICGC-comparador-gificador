# Comparador Costa

Herramienta para comparar 2 servicios WMS. 

## Instalación
Copiar los archivos dentro de una carpeta en un servidor web

## Reutilización y adaptación

### Cambiar las capas bases para comparar
En el archivo index.js modificar las variables servicio(1 ó 2), layer(1 ó 2) y attribution(1 ó 2).

Ejemplo
- servicio1: contiene la URL del servicio WMS que se mostrá en la ventana de la izquierda de la aplicación
- layer1: nombre de la capa del servicio WMS que se quiere mostrar
- attribution1: texto de atribución de la capa.

### Herramienta de búsqueda

El archivo listBookmarks.js contiene un geojson de elementos (puntos) que son los que aparecen como resultados en la herramienta de búsqueda. 

La herramienta de búsqueda utiliza la propiedad "NOM" para buscar los resultados. 

Al seleccionar un resultado el mapa se centra en la coordenada del punto.   

## License

Copyright (c) 2017- Geostarters (BEERWARE License)  
See LICENSE file for more info.