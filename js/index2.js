$(function() {
  var crs25831 = new L.Proj.CRS('EPSG:25831','+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
     {
          resolutions: [1100, 550, 275, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25]
     }
  );

  var initPoint = [41.6480, 2.7712];
  var initZoom = 11;
  var maxZoom = 11;
  var map = L.map('mapid',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});
  var map1 = L.map('mapid1',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});
  var map2 = L.map('mapid2',{crs: crs25831, attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});

  //var hash3 = new L.Hash(map2);
/*
  var servicio1 = 'http://geoserveis.icgc.cat/icc_ortoxpres/wms/service?';
  var layer1 = 'ox3dcat25c2016';
  var layer2 = 'ox3dtemporal2017';
*/
  var servicio1 = 'http://mapcache.icc.cat/map/bases/service?';
  var layer1 = 'orto';

/*
  var servicio1 = 'http://172.70.1.11/mapcache/?';
  var layer1 = 'costa2016_25831';
  var layer2 = 'costa2017_25831';
*/
  var servicio2 = 'http://shagrat.icc.cat/lizardtech/iserv/ows?';
  var layer2 = 'of25ctempcost201701';

  var myLayer1 = L.tileLayer.wms(servicio1, {
    layers: layer1,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>',
});

  var myLayer2 = L.tileLayer.wms(servicio2, {
    layers: layer2,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>',
});

  var myLayer3 = L.tileLayer.wms(servicio1, {
    layers: layer1,
    format: 'image/jpeg',
    transparent: true,
    attribution : 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>',
});

  var myLayer4 = L.tileLayer.wms(servicio2, {
    layers: layer2,
    format: 'image/jpeg',
    transparent: true,
    crs: crs25831,
    attribution : 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>',
});

  map.addLayer(myLayer1);
  map.addLayer(myLayer2);

  map1.addLayer(myLayer3);
  map2.addLayer(myLayer4);

  L.control.sideBySide(myLayer1, myLayer2).addTo(map);

  map1.sync(map2);
  map2.sync(map1);

  var hash = new L.Hash(map);
  var hash2 = new L.Hash(map1);

  //$('#mapid1').hide();
  //$('#mapid2').hide();
  //map.invalidateSize();

  $('#mapid').hide();
  //map1.invalidateSize();
  //map2.invalidateSize();

  $('.btn-sticky button').on('click',function(){
    $('.panel-sticky').show();
  });

  $('.btn-sync').on('click',function(){
    $('#mapid').hide();
    $('#mapid1').show();
    $('#mapid2').show();
    $('.panel-sticky').hide();
    map1.invalidateSize();
    map2.invalidateSize();
  });

  $('.btn-sidebyside').on('click',function(){
    $('#mapid').show();
    $('#mapid1').hide();
    $('#mapid2').hide();
    map.invalidateSize();
    $('.panel-sticky').hide();
  });

  $('.list-booksmarks').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    var center = hash.parseHash(selectedD);
    map.setView(center.center, center.zoom);
  });

  var features = bookmarks.features;

  function compare(a,b) {
    if (a.properties.NOM < b.properties.NOM)
      return -1;
    if (a.properties.NOM > b.properties.NOM)
      return 1;
    return 0;
  }

  features.sort(compare);

  var list = "";
  for(var i = 0, length = features.length; i < length; i++){
    var feature = features[i];
    list += "<option value='#11/"+feature.geometry.coordinates[1]+"/"+feature.geometry.coordinates[0]+"'>"+feature.properties.NOM+"</option>"
  }
  $('.list-booksmarks').append(list);

  $('.list-booksmarks').removeClass('hide');

  $('.list-booksmarks').selectpicker('refresh');

  $('.info-btn').on('click',function(){
    $('#infomodal').modal('show');
  });

  $('.enllaca').on('click',function(){
    var currentURL = window.location;
    $('#urlMap').val(currentURL);
    var iframecode = '<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+currentURL+'" ></iframe>';
    $('#iframeMap').html(iframecode);
    $('#enllacamodal').modal('show');
  });

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $("#share").jsSocials({
      showLabel: false,
      showCount: false,
      shares: ["email", "twitter", "facebook", "googleplus", "pinterest", "whatsapp"]
    });
  }else{
    $("#share").jsSocials({
      showLabel: false,
      showCount: false,
      shares: ["email", "twitter", "facebook", "googleplus", "pinterest"]
    });
  }



});
