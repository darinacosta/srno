var map;

require(["esri/map", 
         "esri/layers/FeatureLayer",
         "esri/layers/ArcGISTiledMapServiceLayer",
         "esri/tasks/QueryTask",
         "esri/tasks/query",
         "esri/symbols/SimpleFillSymbol",
         "esri/symbols/SimpleLineSymbol",
         "dojo/_base/Color",
         "esri/dijit/HomeButton",
         "esri/graphic",
         "helpers/tableBuilder",
         "helpers/iframeDetector",
         "localLib/jquery.tablesorter.min",
         "dojo/domReady!"], 

  function(Map, FeatureLayer, ArcGISTiledMapServiceLayer, QueryTask, Query, SimpleFillSymbol, SimpleLineSymbol, Color, HomeButton, Graphic, tableBuilder, iframeDetector) {

  var srnoJSON = "http://gis.nola.gov:6080/arcgis/rest/services/Staging/SelfReportedN/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson",
  

  map = new Map("map", {
    center: [-90.02, 29.97], // longitude, latitude
    zoom: 12
  }),

  basemap = new ArcGISTiledMapServiceLayer("http://gis.nola.gov:6080/arcgis/rest/services/Basemaps/BasemapNOLA3/MapServer");
  map.addLayer(basemap),

  home = new HomeButton({
    map: map
  }, "HomeButton");
  home.startup();

  console.log("Application running in iframe: " + iframeDetector.inIframe());

  tableBuilder.buildTableFromEsriFeatureService("#srno-table", srnoJSON, {
    "Organization_Name": "Name",
    "Boundaries": "Boundaries",
    "POC": "Contact",
    "Email": "Email"
  });

  //create symbol for selected features
  var selectionBoundary = new SimpleLineSymbol(
    SimpleLineSymbol.STYLE_SOLID,
    new Color([8, 227, 255]),
    3
  );
  
  srnoBoundaries = new FeatureLayer("http://gis.nola.gov:6080/arcgis/rest/services/Staging/SelfReportedN/MapServer/0", {
    outFields: ['Organization_Name', 'Unique_ID']
  });
  srnoBoundaries.setOpacity(.60);

  map.addLayer(srnoBoundaries);

  console.log(srnoBoundaries);

  queryTask = new QueryTask("http://gis.nola.gov:6080/arcgis/rest/services/Staging/SelfReportedN/MapServer/0");
  query = new Query();
  query.returnGeometry = true;

  selectFeature = function(id){
    query.where = "Unique_ID = " + id;
    srnoBoundaries.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(features){
      map.graphics.clear();
      var selectionGraphic = new Graphic(features[0].geometry, selectionBoundary); 
      map.graphics.add(selectionGraphic);
      var extent = features[0].geometry.getExtent().expand(1.5);
      map.setExtent(extent);
    });
  };

  scrollIntoView = function(element, container) {
    var $container = $(container),
    $element = $(element);
    $container.animate({
    scrollTop: $element.offset().top - $container.offset().top + $container.scrollTop()
    });
  };

  highlightRow = function(id){
    $(id).addClass('highlight').siblings().removeClass('highlight');
    scrollIntoView(id, '#srno-table-wrapper');
  };

  //EVENT HANDLERS
  $('#srno-table').on('click', 'tr', function(){
    var id = $(this)[0].id;
    console.log(id)
    highlightRow('#'+id);
    selectFeature(id);
  });

  srnoBoundaries.on('click', function(e){
    var id = e.graphic.attributes.Unique_ID;
    selectFeature(id);
    console.log($('#'+id));
    highlightRow('#'+id);
  })

  $('#HomeButton').on('click', function(){
    map.graphics.clear();
    $('.map-row').removeClass('highlight');
    $('#srno-table-wrapper').animate({
      scrollTop: $('#srno-table-wrapper').offset()
    });
  })
});