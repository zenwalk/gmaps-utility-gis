

var svc, map, res, iw, ovs = [], results;
var ovOptions = {
  polylineOptions: {
    strokeColor: '#FF0000',
    strokeWeight: 4
  },
  polygonOptions: {
    fillColor: '#FFFF99',
    fillOpacity: 0.5,
    strokeWeight: 2,
    strokeColor: '#FF0000'
  }
};
function init() {
  var myOptions = {
    zoom: 16,
    center: new google.maps.LatLng(35.227, -80.843),
    mapTypeId: 'cbm',
    mapTypeControlOptions: {
      mapTypeIds: ['cbm', 'coc']
    },
    draggableCursor: 'pointer',
    streetViewControl: true
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var cbmType = new gmaps.ags.MapType('http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer', {
    name: 'Community'
  });
  map.mapTypes.set('cbm', cbmType);
  var url = 'http://maps.ci.charlotte.nc.us/arcgis/rest/services/GET/BaseMapWM/MapServer';
  svc = new gmaps.ags.MapService(url);
  var agsType = new gmaps.ags.MapType([new gmaps.ags.TileLayer(svc)], {
    name: 'Charlotte'
  });
  map.mapTypes.set('coc', agsType);
  google.maps.event.addListener(map, 'click', identify);
}

function identify(evt) {

  clearOverlays();
  if (res) 
    res.length = 0;
  svc.identify({
    geometry: evt.latLng,
    tolerance: 3,
    //layerIds: [2, 3, 4],
    layerOption: 'top',
    bounds: map.getBounds(),
    width: map.getDiv().offsetWidth,
    height: map.getDiv().offsetHeight,
    overlayOptions: ovOptions
  }, function(results, err) {
    if (err) {
      alert(err.message + err.details.join('\n'));
    } else {
      addResultToMap(results, evt.latLng);
    }
  });
}

function clearOverlays() {
  if (ovs) {
    for (var i = 0; i < ovs.length; i++) {
      ovs[i].setMap(null);
    }
    ovs.length = 0;
  }
}

function addResultToMap(idresults, latlng) {
  results = idresults.results;
  
  var count = results.length;
  var label = "", content = "";
  content = "<strong>Total features returned: " + count + "</strong>";
  for (var j = 0; j < count; j++) {
    var attributes = results[j].feature.attributes;
    content += "<table>";
    for (var x in attributes) {
      
      if (attributes.hasOwnProperty(x)) {
        if (x=='OBJECTID') continue;
        var val = attributes[x] || '';
        if (val =='Null') continue;
        content +='<tr><td style="background-color:#E5ECF9">'+x+'</td><td>'+ val +'</td></tr>';
      }
    }
    content += "</table>";
  }
  
  
  var container = document.createElement('div');
  container.style.height='200px';
  container.style.overflow='auto';
  
  container.innerHTML = content;
  // =======END  TAB UI ================ 
  if (!iw) {
    iw = new google.maps.InfoWindow({
      content: container,
      position: latlng
    });
  } else {
    iw.setContent(container);
    iw.setPosition(latlng);
  }
  iw.open(map);
  
}

function showFeature(index) {
  window.status = 'showFeature';
  clearOverlays();
  var idResult = results[index];
  var f = idResult.feature;
  if (f.geometry) {
    for (var i = 0; i < f.geometry.length; i++) {
      ovs.push(f.geometry[i]);
      f.geometry[i].setMap(map);
    }
  }
}

window.onload = init;
