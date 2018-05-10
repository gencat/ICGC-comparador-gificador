$(function() {

  var initPoint = [41.4359, 2.2403];
  var initZoom = 16;
  var maxZoom = 18;
  var map = L.map('mapid',{attributionControl: false, zoomControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});
  var map1 = L.map('mapid1',{attributionControl: false, zoomControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});
  var map2 = L.map('mapid2',{attributionControl: false, zoomControl: false, maxZoom: maxZoom, center: initPoint, zoom: initZoom});

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

  $('.panel-sticky').show();
  $('.btn-sync').addClass('actived');

  $('.btn-sticky button').on('click',function(){
    $('.panel-sticky').show();
  });

  $('.btn-sync').on('click',function(){
    $('#mapid').hide();
    $('#mapid1').show();
    $('#mapid2').show();
    //$('.panel-sticky').hide();
    $('.btn-sync').addClass('actived');
    $('.btn-sidebyside').removeClass('actived');
    map1.invalidateSize();
    map2.invalidateSize();
  });

  $('.btn-sidebyside').on('click',function(){
    $('#mapid').show();
    $('#mapid1').hide();
    $('#mapid2').hide();
    map.invalidateSize();
    $('.btn-sidebyside').addClass('actived');
    $('.btn-sync').removeClass('actived');
    //$('.panel-sticky').hide();
  });

  $('.topoMap').on('click',function(){
    var orto = ortos[0];
    $('#list-ortos1').selectpicker('val', orto.url+'@#_#@'+orto.layer);
    $('#list-ortos1').change();
  });

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $('#list-booksmarks').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    var center = hash.parseHash(selectedD);
    map.setView(center.center, center.zoom);
  });

  $('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');

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
    if(!selectedD){
      selectedD = $(this).find('option:selected').val()
    }
    var params = selectedD.split("@#_#@");
    myLayer1.setUrl(params[0]).setParams({layers: params[1]});
    myLayer3.setUrl(params[0]).setParams({layers: params[1]});
  });

  $('#list-ortos2').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selectedD = $(this).find('option').eq(clickedIndex).val();
    if(!selectedD){
      selectedD = $(this).find('option:selected').val()
    }
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
      if(SW.x === NE.x){
        SW = L.CRS.EPSG3857.project(map1.getBounds().getSouthWest());
        NE = L.CRS.EPSG3857.project(map1.getBounds().getNorthEast());
      }
      var bbox = SW.x+","+SW.y+","+NE.x+","+NE.y;
      $.ajax({
        url: "https://betaserver2.icgc.cat/wms2gif/",
        data: {
          email: email,
          bbox: bbox
        }
      }).always(function(results) {
        $('#gifmodal').modal('hide');
        //$('#alertmodal .alertmodal-body').html("Correu enviat");
        //$('#alertmodal').modal('show');
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

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
});
