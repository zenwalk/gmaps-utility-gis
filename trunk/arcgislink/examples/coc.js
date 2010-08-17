

var locator, map, marker, iw, res;
var sp83 = gmaps.ags.Util.registerSR(2264, 'PROJCS["NAD_1983_StatePlane_North_Carolina_FIPS_3200_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",2000000.002616666],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-79.0],PARAMETER["Standard_Parallel_1",34.33333333333334],PARAMETER["Standard_Parallel_2",36.16666666666666],PARAMETER["Latitude_Of_Origin",33.75],UNIT["Foot_US",0.3048006096012192]]');
var map, locator, iw;
function init() {
  var myOptions = {
    zoom: 16,
    center: new google.maps.LatLng(35.227, -80.843),
    mapTypeId: 'cbm',
    mapTypeControlOptions: {
      mapTypeIds: ['cbm', google.maps.MapTypeId.ROADMAP, 'coc']
    },
    streetViewControl: true
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var cbmType = new gmaps.ags.MapType('http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer', {
    name: 'Community'
  });
  map.mapTypes.set('cbm', cbmType);
  var cocType = new gmaps.ags.MapType('http://maps.ci.charlotte.nc.us/arcgis/rest/services/GET/BaseMapWM/MapServer', {
    name: 'Charlotte'
  });
  map.mapTypes.set('coc', cocType);
  var url = 'http://maps.ci.charlotte.nc.us/arcgis/rest/services/GET/MATLocator/GeocodeServer';
  locator = new gmaps.ags.GeocodeService(url);
  geocoder = new google.maps.Geocoder();
  
  google.maps.event.addListener(map, 'click', function(evt) {
    reverseGeocode(evt.latLng);
  });
  iw = new google.maps.InfoWindow({
    maxWidth: 180
  });
  
}

function reverseGeocode(latlng) {
  if (latlng) {
    var params = {
      location: latlng,
      distance: 100
    }
    var latlngHtml = "<b>Latlng</b>: (" + latlng.toUrlValue() + ")<br/>";
    var allHtml = "";
    locator.reverseGeocode(params, function(result) {
      var chtml = '<b>City</b>: ';
      if (result.address) {
        chtml += result.address['Street'];
        
      } else {
        chtml += ' not found';
      }
      if (allHtml) {
        showResults(latlng, latlngHtml + allHtml + '<br/>' + chtml);
      } else {
        allHtml = chtml;
      }
    });
    geocoder.geocode({
      'latLng': latlng
    }, function(results, status) {
      var ghtml = '<b>Google</b>: ';
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          ghtml += results[0]['formatted_address'];
        } else {
          ghtml += "No results found";
        }
      } else {
        ghtml += 'Geocoder failed due to:' + status;
      }
      if (allHtml) {
        showResults(latlng, latlngHtml + allHtml + '<br/>' + ghtml);
      } else {
        allHtml = ghtml;
      }
    });
  }
}



function showResults(latlng, html) {
  if (!marker) {
    marker = new google.maps.Marker({
      position: latlng,
      draggable: true,
      map: map
    });
    
    google.maps.event.addListener(marker, 'dragend', function(evt) {
      reverseGeocode(evt.latLng);
    });
    google.maps.event.addListener(marker, 'dragstart', function(evt) {
      iw.close();
    });
  } else {
    marker.setPosition(latlng);
    marker.setMap(map);
  }
  if (!iw) {
    iw = new google.maps.InfoWindow({
      maxWidth: 180,
      content: html,
      position: latlng
    });
  } else {
    iw.setContent(html);
    iw.setPosition(latlng);
    
  }
  iw.open(map);
}

function clearOverlays() {
  marker.setMap(null);
}

window.onload = init;







