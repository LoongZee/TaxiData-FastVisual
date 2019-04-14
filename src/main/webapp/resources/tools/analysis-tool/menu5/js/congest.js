	var init_congest = function(){  

		/******* Urban Congestion Degree Analysis  *********/
	    
	    $('#congest-start').click(function () {	
    		var layer = $('#congestselect').val();
    		var rows = $('#congestrows').val();
    		var cols = $('#congestcols').val();
    		timebin = 3600;
	    	if(layer != "" && layer != undefined
	    			&&rows != "" && rows != undefined
	    			&&cols != "" && cols != undefined){
	    		if(document.getElementById('congest') == null){
	    			$('#map').append('<div id="congest"></div>');
	    			
	    			app.vref2.widget = new Citycongest('congest');
	    			
	    			app.vref2.widget.congest_callback=function(d,i){
	    				var hour = i;
	    				if(hour < 9){
	    					app.osm_rasterparams.chroma = parseInt(60/9*hour+40);
	    					app.osm_rasterparams.lightness = parseInt(60/9*hour+40);
	    				}
	    				else if(hour>=15){
	    					app.osm_rasterparams.chroma = parseInt(60/9*(24-hour)+40);
	    					app.osm_rasterparams.lightness = parseInt(60/9*(24-hour)+40);
	    				}
	    				else{
	    			        app.osm_rasterparams.chroma = 100;
	    			        app.osm_rasterparams.lightness = 100;
	    				}
	    				app.osm_raster.changed();
	    		    	app.congest.layer.setSource(app.congest.source[i]);
	    		    };
	    		    
	    		}
	    		
	    		app.vref2.widget.setBinSizeTxt('timebin:'+timebin);
	    		app.map.addLayer(app.congest.layer);
	    		initCitycongest(layer, timebin);
	    		
	    		var obj = document.getElementById('congest');
		    	var i =obj.className.indexOf('show');
		    	if( i < 0){
		    		obj.className += ' show';
		    	}
	    	}
	    	else {
	    		alert("Params error!");
	    	}
	    });
	    
	    $('#congest-stop').click(function () {	
    		if(document.getElementById('congest') != null){
    			var obj = document.getElementById('congest');
    	    	var i =obj.className.indexOf('show');
    	    	if( i > 0){
    	    		obj.className = obj.className.substring(0,i-1);
    	    	}
    		}
	    	app.map.removeLayer(app.congest.layer);
	    	
	        app.osm_rasterparams.chroma = 80;
	        app.osm_rasterparams.lightness = 80;
    		app.osm_raster.changed();
   		
	    });
	    
	    function initCitycongest(layer, timebin){
	        var NewData = {};
	        NewData.color = '#fd8d3c';
	        NewData.data = new Array();    		
	        for ( var i = 0; i<= 24; i++){
	            var obj =  {date : new Date((1370793600+i*timebin)*1000)};
	        	NewData.data.push(obj);
	        }
	        app.vref2.widget.setData(NewData,'congest');
	        app.vref2.widget.redraw();
	    }
	    /***************************************************/
	}