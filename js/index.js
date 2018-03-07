$(function() {
  /*
  var crs25831 = new L.Proj.CRS('EPSG:25831','+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
     {
          resolutions: [1100, 550, 275, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25]
     }
  );
  */

  var initPoint = [41.5328, 2.0810];
  var initZoom = 15;
  var maxZoom = 18;
  var map = L.map('mapid',{attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});
  var map1 = L.map('mapid1',{attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});
  var map2 = L.map('mapid2',{attributionControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});

  var urlWmsHistoric = "http://geoserveis.icgc.cat/icc_ortohistorica/wms/service?";

  var servicio2 = 'http://geoserveis.icgc.cat/icc_mapesbase/wms/service?';
  var layer2 = 'orto5m';
  var attribution2 = 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>';

  var servicio1 = 'http://geoserveis.icgc.cat/icc_ortohistorica/wms/service?';
  var layer1 = 'ovaa10m';
  var attribution1 = 'Mapa &copy; <a href="http://www.icgc.cat">Institut Cartogràfic i Geològic de Catalunya</a>';

  var myLayer1 = L.tileLayer.wms(servicio1, {
    layers: layer1,
    format: 'image/jpeg',
    transparent: true,
    attribution : attribution1,
});

  var myLayer2 = L.tileLayer.wms(servicio2, {
    layers: layer2,
    format: 'image/jpeg',
    transparent: true,
    attribution : attribution2,
});

  var myLayer3 = L.tileLayer.wms(servicio1, {
    layers: layer1,
    format: 'image/jpeg',
    transparent: true,
    attribution : attribution1,
});

  var myLayer4 = L.tileLayer.wms(servicio2, {
    layers: layer2,
    format: 'image/jpeg',
    transparent: true,
    attribution : attribution2,
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

  $('#mapid').hide();

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

  $('#list-booksmarks').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    console.debug(selectedD);
    var center = hash.parseHash(selectedD);
    map.setView(center.center, center.zoom);
  });

  var features = bookmarks;

  function compare(a,b) {
    if (a.MUNICIPI < b.MUNICIPI)
      return -1;
    if (a.MUNICIPI > b.MUNICIPI)
      return 1;
    return 0;
  }

  features.sort(compare);

  var list = "";
  for(var i = 0, length = features.length; i < length; i++){
    var feature = features[i];
    list += "<option value='#15/"+feature.LAT+"/"+feature.LON+"'>"+feature.MUNICIPI+"</option>"
  }
  $('#list-booksmarks').append(list);

  $('#list-booksmarks').removeClass('hide');

  $('#list-booksmarks').selectpicker('refresh');


  $('#list-ortos1').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    console.log(selectedD);
    var params = selectedD.split("@#_#@");
    myLayer1.setUrl(params[0]).setParams({layers: params[1]});
    myLayer3.setUrl(params[0]).setParams({layers: params[1]});
  });

  $('#list-ortos2').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    console.log(selectedD);
    var params = selectedD.split("@#_#@");
    myLayer2.setUrl(params[0]).setParams({layers: params[1]});
    myLayer4.setUrl(params[0]).setParams({layers: params[1]});
  });

  var list2 = "";
  for(var i = 0, length = ortos.length; i < length; i++){
    var orto = ortos[i];
    list2 += "<option value='"+orto.url+"@#_#@"+orto.layer+"'>"+orto.label+"</option>"
  }

  $('#list-ortos1').append(list2);
  $('#list-ortos1').removeClass('hide');
  $('#list-ortos1').selectpicker('refresh');
  $('#list-ortos1').selectpicker('val', servicio1+'@#_#@'+layer1);

  $('#list-ortos2').append(list2);
  $('#list-ortos2').removeClass('hide');
  $('#list-ortos2').selectpicker('refresh');
  $('#list-ortos2').selectpicker('val', servicio2+'@#_#@'+layer2);


  $('.info-btn').on('click',function(){
    $('#infomodal').modal('show');
  });

  $('#btn-gif').on('click',function(){
    $('#gifmodal').modal('show');
  });
  
  $('#btn-send-gif').on('click',function(){
    var email = $('#email').val().trim();
    if(!isEmail(email)){
      $('#alertmodal .alertmodal-body').html("Correu no valid");
      $('#alertmodal').modal('show');
    }else{
      var SW = L.CRS.EPSG3857.project(map.getBounds().getSouthWest());
      var NE = L.CRS.EPSG3857.project(map.getBounds().getNorthEast());
      var bbox = SW.x+","+SW.y+","+NE.x+","+NE.y;
      $.ajax({
        url: "http://betaserver2.icgc.cat/wms2gif/",
        data: {
          email: email,
          bbox: bbox
        }
      }).done(function(results) {
        $('#gifmodal').modal('hide');
        $('#alertmodal .alertmodal-body').html("Correu enviat");
        $('#alertmodal').modal('show');
        /*
        console.log(results);
        if(results.ok){
          $('#gifmodal').modal('hide');
          $('#alertmodal .alertmodal-body').html("Correu enviat");
          $('#alertmodal').modal('show');  
        }
        */
      });
    }
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

  $(document).hotkeys('alt+ctrl+j', 'alt+ctrl+m', function(){
    $('#alertmodal .alertmodal-body').html("Aquesta és l'última aplicació publicada amb Jaume Miranda com a director de l'Institut Cartogràfic i Geològic de Catalunya<br><br><i>tempus fugit</i>");
    $('#alertmodal').modal('show');
  });

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
});
