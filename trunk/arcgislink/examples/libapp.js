
function log(s) {
  var d = document.getElementById('log');
  d.innerHTML = d.innerHTML + s + "</br>";
}

function showInfo(svc) {
  log('description:' + svc.description);
  log('layers:');
  var layers = svc.getLayers();
  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    log('  layer' + layer.id + ':' + layer.name + ' (' + layer.url);
  }
  var tables = svc.getTables();
  if (tables) {
    log('tables:');
    for (var i = 0; i < tables.length; i++) {
      var layer = tables[i];
      log('table' + layer.id + ':' + layer.name + ' (' + layer.url);
    }
  }
}

function loadSvc() {
  document.getElementById('log').innerHTML = '';
  var sel = document.getElementById('services');
  var url = sel.options[sel.selectedIndex].text;
  var svc = new gmaps.ags.MapService(url);
  google.maps.event.addListener(svc, 'load', function() {
    showInfo(svc);
  });
}

function init(){
  var url = 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer';
  gmaps.ags.Util.getJSON(url, {}, 'callback', function(json) {
    var j = json;
    alert(j.serviceDescription);
  });
}

//window['loadSvc'] = loadSvc;
window.onload = init;
