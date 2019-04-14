    
    //addWMSLayer function
    function addWMSLayer(layerName){
    	var newLayer;
    	if(layerName == 'route'){
            newLayer = new ol.layer.Tile({
            	title: layerName,
                source: new ol.source.TileWMS({
                  url: 'http://localhost:8080/geoserver/Beijing/wms',
                  params: {'FORMAT': 'image/png', 
                           'VERSION': '1.1.1',
                            tiled: true,
                            STYLES: '',
                            LAYERS: 'Beijing:'+layerName,
                  },
                  cacheSize: 0
                })
            });    	
            var lyrs = app.overGroupLayer.getLayers();
            lyrs.push(newLayer);
            app.overGroupLayer.setLayers(lyrs);
    	}
    	else if(layerName == 'bj_20130610'){
            newLayer = new ol.layer.Image({
            	title: layerName,
                source: new ol.source.ImageWMS({
                  url: 'http://localhost:8080/NewKeShe/poi',
                  params: {'FORMAT': 'image/png', 
                           'VERSION': '1.1.1',
                            LAYERS: layerName
                  },
    	          imageLoadFunction:function(image, src) {
    	        	  image.getImage().src = TransformBBOX(src)+'&z='+app.view.getZoom();
    	        	  
    	          }
                }) 
            });
            var lyrs = app.overGroupLayer.getLayers();
            lyrs.push(newLayer);
            app.overGroupLayer.setLayers(lyrs);        
    	}
    	else if(layerName == 'bj_updown20130610'){
            newLayer = new ol.layer.Image({
            	title: layerName,
                source: new ol.source.ImageWMS({
                  url: './LoadPoi',
                  params: {'FORMAT': 'image/png', 
                           'VERSION': '1.1.1',
                            LAYERS: layerName
                  },
    	          imageLoadFunction:function(image, src) {
    	        	  image.getImage().src = TransformBBOX(src)+'&z='+app.view.getZoom();
    	          }
                }) 
            });
            var lyrs = app.overGroupLayer.getLayers();
            lyrs.push(newLayer);
            app.overGroupLayer.setLayers(lyrs);        
    	}
    }
    
    //Add layer callback function
    function addlayer_Callback() {
    	var lyrname = $('#layer-input').val();
    	if(getLyr(lyrname) == null) {
    		if(lyrname !=undefined && lyrname != '') {
        		addWMSLayer(lyrname);
        		app.lyrSwitcher.refreshPanel();
        		refreshEditorLyr();
        		refreshanalysisLyr();
        	}
        	else {
        		alert('Please enter the layer name correctly!');
        	}
    	}
    	else {
    		alert('You have added the layer named \''+lyrname+'\'');
    	}
    }
    
    //delete layer callback function
    function deletelayer_callback() {
    	var selected = $('#selectLyrname').val();
    	if(selected != undefined && selected != '') {
    		 var lyrs = app.overGroupLayer.getLayers();
    		 lyrs.remove(getLyr(selected));
    		 app.overGroupLayer.setLayers(lyrs);
    		 app.lyrSwitcher.refreshPanel();
    		 refreshEditorLyr();
    		 refreshanalysisLyr();
    	}
    	else {
    		alert('error , no layers!');
    	}
    }