	var init_heatmap = function(){     
		/**************   Heatmap Analysis   ***********/
	    $('#heatmap-start').click(function () {
    		var layer = $('#heatmapselect').val();
    		var radius = $('#heatmapradius').val();
    		var blur = $('#heatmapblur').val();
    		if(layer != "" && layer != undefined
	    			&&radius != "" && radius != undefined
	    			&&blur != "" && blur != undefined){
    			app.map.removeLayer(app.heatlayer);
    			app.heatlayer.getSource().clear();
    			app.map.addLayer(app.heatlayer);
    			app.heatlayer.setBlur( parseInt(blur) );
    			app.heatlayer.setRadius( parseInt(radius) );
    			$.ajax({
    				url: "./HeatmaplQuery",
    				type: "POST",
    				data: {"layer":layer},
    				success: function(str) {
    					if(str.state == 'good'){
    						var poinum = str.pois.length;
    					    var max_nearPoi = str.max_nearPoi;
    					    var source = app.heatlayer.getSource();
    					    var wkt_c = new ol.format.WKT();
    					    for (var i = 0; i < poinum; i++){
    					    	var wkt_text = str.pois[i].geom;
    					    	var nearPoi = str.pois[i].nearPoi;
    					        var feat = wkt_c.readFeature(wkt_text, {
    					            dataProjection: app.projection4326,
    					            featureProjection: app.projection3857
    					          });
    				    		var r = parseFloat(nearPoi/max_nearPoi);
    				    		feat.set('weight', r);
    				    		source.addFeature(feat);
    					    }
    					}				
    				},
    				dataType:'json'
    			});
    		}
	    	else{
	    		alert("Params error!");
	    	}
	    });
	    
	    $('#heatmap-stop').click(function () {
			app.map.removeLayer(app.heatlayer);
			app.heatlayer.getSource().clear();
	    });
	    /***********************************************/
	}