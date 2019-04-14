	var init_time = function(){		

		/**************   Time Axis Analysis   *********/
	    $('#time-start').click(function () {
	    	if($('#timeselect').val() != "" && $('#timeselect').val() != undefined
	    			&&$('#granularity').val() != "" && $('#granularity').val() != undefined){
	    		var layer = $('#timeselect').val();
	    		var timebin = $('#granularity').val();
	    		if(document.getElementById('time') == null){
	    			$('#map').append('<div id="time"></div>');
	    			
	    			app.vref.widget = new Timeseries('time');
	    			
	    			app.vref.widget.brush_callback = function(start,end){
	    				update_callback(layer, timebin, start, end, new Array(0));  				
	    		    }; 

	    		    app.vref.widget.update_display_callback=function(start,end){
	    		    	update_callback(layer, timebin, start, end, new Array(0));
	    		    };
	    		}
	    		app.vref.widget.setBinSizeTxt(timebin);
	    		initTimeseries(layer, timebin,  new Array(0));
	    		var obj = document.getElementById('time');
		    	var i =obj.className.indexOf('show');
		    	if( i < 0){
		    		obj.className += ' show';
		    	}
	    	}
	    	else{
	    		alert("Params error!");
	    	}
	    	
	    });
	    
	    $('#time-stop').click(function () {
    		if(document.getElementById('time') != null){
    			var obj = document.getElementById('time');
    	    	var i =obj.className.indexOf('show');
    	    	if( i > 0){
    	    		obj.className = obj.className.substring(0,i-1);
    	    	}
    		}
    		
	        app.osm_rasterparams.chroma = 80;
	        app.osm_rasterparams.lightness = 80;
    		app.osm_raster.changed();
   		
    		var url = './LoadPoi';
            var lyr=getLyr($('#timeselect').val());
            var source = lyr.getSource();
            source.setImageLoadFunction(function(image, src) {
          	  image.getImage().src = TransformBBOX(src)+'&z='+app.view.getZoom();
              });
            source.setUrl(url);
            source.updateParams({LAYERS: $('#timeselect').val()});
            source.refresh();
            
	    });
	    /***************************************************/
	}