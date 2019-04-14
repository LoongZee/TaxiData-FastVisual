	var init_updown =function (){
		/***********   pick-up/drop-off analysis   *********/
	    $('#updown-start').click(function () {	    	
	    	if($('#updownselect').val() != "" && $('#updownselect').val() != undefined
	    			&&$('#updowngran').val() != "" && $('#updowngran').val() != undefined){
	    		var layer = $('#updownselect').val();
	    		var timebin = $('#updowngran').val();
	    		if ($('#updownswitch').is(':checked')){
	    			if(document.getElementById('time') == null){
		    			$('#map').append('<div id="time"></div>');
		    			app.vref.widget = new Timeseries('time');
		    			
		    			app.vref.widget.brush_callback = function(start,end){
		    				update_callback(layer, timebin, start, end, app.vref1.widget.selection);  				
		    		    };
		    		    app.vref.widget.update_display_callback=function(start,end){
		    		    	update_callback(layer, timebin, start, end, app.vref1.widget.selection);
		    		    };
		    		}
		    		app.vref.widget.setBinSizeTxt(timebin);
		    		initTimeseries(layer, timebin, new Array(0));
		    		
		    		var obj = document.getElementById('time');
			    	var i =obj.className.indexOf('show');
			    	if( i < 0){
			    		obj.className += ' show';
			    	}
	    		} 
	    		
	    		if(document.getElementById('catalog') == null){
	    			$('#map').append('<div id="catalog"></div>');
	    		    app.vref1.widget = new GroupedBarChart('catalog',false);
	    		    
	    			app.vref1.widget.setSelection(new Array(0));
	    		    app.vref1.widget.setClickCallback(function(d){
	    				if (typeof d != "undefined") {
	    					
	    				    var idx = app.vref1.widget.selection.indexOf(d.addr);
	    				    if (idx == -1){ //add unselected cat to selection
	    				    	app.vref1.widget.selection.push(d.addr);
	    				    }
	    				    else{
	    				    	app.vref1.widget.selection.splice(idx,1);
	    				    }
	    				    var startend = app.vref.widget.getstartend();
	    				    update_callback(layer, timebin, startend[0], startend[1], app.vref1.widget.selection);
	    				    
	    				    d3.event.stopPropagation();
	    				}
	    				app.vref1.widget.redraw();
	    		    });
	    		    
	    		    initGroupedBarChart(layer, 1370793600, 1370880000);
	    		    
		    		var obj = document.getElementById('catalog');
			    	var i =obj.className.indexOf('show');
			    	if( i < 0){
			    		obj.className += ' show';
			    	}
	    		}
	
	    	}
	    	else{
	    		alert("Params error!");
	    	}
	    });
	    	    
	    $('#updown-stop').click(function () {
    		if(document.getElementById('time') != null){
    			var obj = document.getElementById('time');
    	    	var i =obj.className.indexOf('show');
    	    	if( i > 0){
    	    		obj.className = obj.className.substring(0,i-1);
    	    	}
    		}
    		
    		if(document.getElementById('catalog') != null){
    			var obj = document.getElementById('catalog');
    	    	var i =obj.className.indexOf('show');
    	    	if( i > 0){
    	    		obj.className = obj.className.substring(0,i-1);
    	    	}
    		}
    		
	        app.osm_rasterparams.chroma = 80;
	        app.osm_rasterparams.lightness = 80;
    		app.osm_raster.changed();
   		
    		var url = './LoadPoi';
            var lyr=getLyr($('#updownselect').val());
            var source = lyr.getSource();
            source.setImageLoadFunction(function(image, src) {
          	  image.getImage().src = TransformBBOX(src)+'&z='+app.view.getZoom();
              });
            source.setUrl(url);
            source.updateParams({LAYERS: $('#updownselect').val()});
            source.refresh();
	    });
	    /***************************************************/
	}