define([], function(){
  
  var buildTableFromEsriFeatureService = function(id, json, attributes){
    var tableString;
    console.log(attributes);

    $.getJSON(json, function(data){
    
      buildTableHeader = function(){
        tableString = '<thead><tr>';
        
        $.each(attributes, function(key, value){
          tableString = tableString + '<th><div>' + value + ' <span class="glyphicon glyphicon-sort"></span></div></th>';
        });

        tableString = tableString + '</tr></thead>';
      },

      buildTableBody = function(){
        tableString = tableString + '<tbody>';
        
        $.each(data.features, function(dataKey, dataValue){
          tableString = tableString + '<tr class="map-row" id="'+ data.features[dataKey].attributes["Unique_ID"] +'">';
          $.each(attributes, function(attKey, attValue){
            tableString = tableString + '<td>' + data.features[dataKey].attributes[attKey] + '</td>';
          });
          tableString = tableString + '</tr>'
        });

        tableString = tableString + '</tr></tbody>'
      },

      init = (function(){
        buildTableHeader();
        buildTableBody();
        $(id).html(tableString);
        $(id).tablesorter();
      })();

    });
  };
    return {buildTableFromEsriFeatureService: buildTableFromEsriFeatureService}

})