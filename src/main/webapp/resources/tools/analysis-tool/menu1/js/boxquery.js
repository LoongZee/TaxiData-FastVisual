	var init_query = function(){
	    /**************   Geo Bounding Box Query   *********/
	    
	    $('#query-Circle').click(function () {
	    	if($('#queryselect').val() != "" && $('#queryselect').val() != undefined){
		    	clearInteraction();
		    	app.map.addLayer(app.editInfo[0]);
		    	app.editInfo[0].getSource().clear();
		        var draw = new ol.interaction.Draw({
		            type: 'Circle',
		            source: app.editInfo[0].getSource(),
		    		style: styles
		        });
		        draw.set('tool','draw');
		        app.map.addInteraction(draw);
		        
		        draw.on('drawstart', function (e) {
		        	app.editInfo[0].getSource().clear();
		        });

		        draw.on('drawend', function (e) {
		    		var wkt_c = new ol.format.WKT();
		    		var wkt_text = wkt_c.writeGeometry(ol.geom.Polygon.fromCircle(e.feature.getGeometry()).transform(app.projection3857,app.projection4326));
		            BoxQuery(wkt_text);
		        });	    		
	    	}
	    	else {
	    		alert('Please select layer!')
	    	}
	    });
	    
	    $('#query-Rectangle').click(function () {
	    	if($('#queryselect').val() != "" && $('#queryselect').val() != undefined){
		    	clearInteraction();
		    	app.map.addLayer(app.editInfo[0]);
		    	app.editInfo[0].getSource().clear();
		        var draw = new ol.interaction.Draw({
		        	type: 'LineString',
		            source: app.editInfo[0].getSource(),
		            maxPoints: 2,
		            geometryFunction: function(coordinates, geometry){
		                if(!geometry){
		                    geometry = new ol.geom.Polygon(null);
		                }
		                var start = coordinates[0];
		                var end = coordinates[1];
		                geometry.setCoordinates([
		                    [start, [start[0], end[1]], end, [end[0], start[1]], start]
		                ]);
		                return geometry;
		            },
		    		style: styles	        
		        });
		        
		        draw.set('tool','draw');
		        app.map.addInteraction(draw);
	
		        draw.on('drawstart', function (e) {
		        	app.editInfo[0].getSource().clear();
		        });
		        
		        draw.on('drawend', function (e) {
		    		var wkt_c = new ol.format.WKT();
		    		var wkt_text = wkt_c.writeGeometry(e.feature.getGeometry().clone().transform(app.projection3857,app.projection4326));
		    		BoxQuery(wkt_text);
		        });
		    }
	    	else {
	    		alert('Please select layer!')
	    	}	        
	    });
	    
	    $('#query-Polygon').click(function () {
	    	if($('#queryselect').val() != "" && $('#queryselect').val() != undefined){
		    	clearInteraction();
		    	app.map.addLayer(app.editInfo[0]);
		    	app.editInfo[0].getSource().clear();
		        var draw = new ol.interaction.Draw({
		            type: 'Polygon',
		            source: app.editInfo[0].getSource(),
		    		style: styles
		        });
		        draw.set('tool','draw');
		        app.map.addInteraction(draw);
	
		        draw.on('drawstart', function (e) {
		        	app.editInfo[0].getSource().clear();
		        });
		        
		        draw.on('drawend', function (e) {
		    		var wkt_c = new ol.format.WKT();
		    		var wkt_text = wkt_c.writeGeometry(e.feature.getGeometry().clone().transform(app.projection3857,app.projection4326));
		    		BoxQuery(wkt_text);
		        });
		    }
	    	else {
	    		alert('Please select layer!')
	    	}		        
	    });
	    
	    $('#query-Clear').click(function () {
	    	clearInteraction();
	    	app.map.removeLayer(app.editInfo[0]);
	    	app.editInfo[0].getSource().clear();
	    });
	    
	    
	    function BoxQuery(wkt_text){
			$.ajax({
				url: "./SpatialQuery",
				type: "POST",
				data: {"layer":$('#queryselect').val() ,"geom":wkt_text},
				success: function(str) {
					if(str.state == 'good'){
						var poinum = str.pois.length;
					    var max_nearPoi = str.max_nearPoi;
					    var wkt_c = new ol.format.WKT();
					    for (var i = 0; i < poinum; i++){
					    	var wkt_text = str.pois[i].geom;
					    	var nearPoi = str.pois[i].nearPoi;
					        var feat = wkt_c.readFeature(wkt_text, {
					            dataProjection: app.projection4326,
					            featureProjection: app.projection3857
					          });
				    		var r = 20.0*nearPoi/max_nearPoi;    		
				    		r = (r < 3)?3 : r;
					        var style = new ol.style.Style({
			                    image: new ol.style.Circle({
			                        radius: r,
			                        fill: new ol.style.Fill({
			                            color: 'rgba(255, 97, 0, 0.6)',
			                        })
			                    })
			                });
					        feat.setStyle(style);
					        app.editInfo[0].getSource().addFeature(feat);
					    }						
					}				
				},
				dataType:'json'
			});
	    }
	    
	    /***********************************************/
	}