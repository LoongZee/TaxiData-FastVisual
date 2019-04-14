	function renderanalysis(id){
    	 var analysisstr =  '<div id="'+id+'" class="panel">'+
						  	  '<div id="analysis-heading"class="panel-heading">'+
						            '<button type="button" id="analysis-close" class="close" >&times;</button>'+
						  		  '<h3 class="panel-title">'+
						  			  'Analysis'+
						  		  '</h3>'+
						  	  '</div>'+
						  	  '<div id="analysis-body" class="panel-body">'+
						  	      '<ul>'+
						  	          '<li class="analysis-top">'+
						  	          	'<label class="querylabel">Geo Bounding Box Query</label>'+
						  	          		'<ul class="querycontent">'+
						  	          		    '<li>'+
						  	          		      '<label>layer : </label>'+
						  	          			  '<select id="queryselect" class="form-control analysisinput"></select>'+
						  	          			'</li>'+
						  	          			'<li>'+
						  					      '<button id="query-Circle" class="btn analysisbtn">Circle</button>'+
						  					      '<button id="query-Rectangle" class="btn analysisbtn">Rect</button>'+
						  					      '<button id="query-Polygon" class="btn analysisbtn">Polygon</button>'+
						  					      '<button id="query-Clear" class="btn analysisbtn">Clear</button>'+
						  	          			'</li>'+	
						  	          		'</ul>'+
						  	          '</li>'+
						  	          '<li class="analysis-group">'+
						  	          	'<label class="heatmaplabel">Heatmap Analysis</label>'+
						  	          		'<ul class="heatmapcontent">'+
						  	          		    '<li>'+
						  	          		      '<label>Layer : </label>'+
						  	          			  '<select id="heatmapselect" class="form-control analysisinput"></select>'+ 
						  	          			'</li>'+
						  	          		    '<li>'+
						  	          		      '<label>radius size : </label>'+
						  	          			  '<input id="heatmapradius" type="range" min="1" max="50" step="1" value="5"  class="form-control analysisrange"></input>'+ 
						  	          			'</li>'+
						  	          		    '<li>'+
						  	          		      '<label>blur size : </label>'+
						  	          			  '<input id="heatmapblur" type="range" min="1" max="50" step="1" value="5"  class="form-control analysisrange"></input>'+ 
						  	          			'</li>'+	          			
						  	          			'<li>'+
						  					      '<button id="heatmap-start" class="btn analysisbtn">Start</button>'+
						  					      '<button id="heatmap-stop" class="btn analysisbtn">Stop</button>'+
						  	          			'</li>'+	
						  	          		'</ul>'+
						  	          '</li>'+	          
						  	          '<li class="analysis-group">'+
						  	          	'<label class="timelabel">Time Axis Analysis</label>'+
						  	          		'<ul class="timecontent">'+
						  	          		    '<li>'+
						  	          		      '<label>Layer : </label>'+
						  	          			  '<select id="timeselect" class="form-control analysisinput"></select>'+ 
						  	          			'</li>'+
						  	          		    '<li>'+
						  	          		      '<label>Time granularity : </label>'+
						  	          			  '<input type="text" id="granularity" class="form-control analysisinput"></input>'+ 
						  	          			'</li>'+	  	          			
						  	          			'<li>'+
						  					      '<button id="time-start" class="btn analysisbtn">Start</button>'+
						  					      '<button id="time-stop" class="btn analysisbtn">Stop</button>'+
						  	          			'</li>'+	
						  	          		'</ul>'+
						  	           '</li>'+
						  	           '<li class="analysis-group">'+
						  	          	 '<label class="updownlabel">Pick-up/Drop-off Analysis</label>'+
						  	          		'<ul class="updowncontent">'+
						  	          		    '<li>'+
						  	          		      '<label>Layer : </label>'+
						  	          			  '<select id="updownselect" class="form-control analysisinput"></select>'+ 
						  	          			'</li>'+
						  	          		    '<li>'+
						  	          		      '<label>Time Granularity : </label>'+
						  	          			  '<input type="text" id="updowngran" class="form-control analysisinput"></input>'+ 
						  	          			'</li>'+
						  	          			'<li>'+
						  	          			  '<label>Time Axis : </label>'+
						                            '<input id="updownswitch" type="checkbox" checked />'+
						  	          			'</li>'+
						  	          			'<li>'+
						  					      '<button id="updown-start" class="btn analysisbtn">Start</button>'+
						  					      '<button id="updown-stop" class="btn analysisbtn">Stop</button>'+
						  	          			'</li>'+	
						  	          		'</ul>'+
						  	           '</li>'+	 
						  	           '<li class="analysis-group">'+
						  	          	 '<label class="congestlabel">Urban Congestion Degree Analysis</label>'+
						  	          		'<ul class="congestcontent">'+
						  	          		    '<li>'+
						  	          		      '<label>Layer : </label>'+
						  	          			  '<select id="congestselect" class="form-control analysisinput"></select>'+ 
						  	          			'</li>'+
						  	          		    '<li>'+
						  	          		      '<label>Rows : </label>'+
						  	          			  '<input type="text" id="congestrows" class="form-control analysisinput"></input>'+ 
						  	          			'</li>'+
						  	          			'<li>'+
						  	          			  '<label>Cols : </label>'+
						                            '<input type="text" id="congestcols" class="form-control analysisinput"></input>'+ 
						  	          			'</li>'+
						  	          			'<li>'+
						  					      '<button id="congest-start" class="btn analysisbtn">Start</button>'+
						  					      '<button id="congest-stop" class="btn analysisbtn">Stop</button>'+
						  	          			'</li>'+
						  	          		'</ul>'+
						  	           '</li>'+     
						  	      '</ul>'+
						  	   '</div>'+
						     '</div>';
		$('#map').append(analysisstr);
		
		$("#analysis").draggable({
		    handle: "#analysis-heading"
		});
		
		refreshanalysisLyr();
		
		$("#updownswitch").bootstrapSwitch(); 
		
	    document.getElementById('heatmapradius').addEventListener('input', function() {
			app.heatlayer.setBlur(parseInt($('#heatmapradius').val(), 10));
		});
	    document.getElementById('heatmapblur').addEventListener('input', function() {
			app.heatlayer.setRadius(parseInt($('#heatmapblur').val(), 10));
		});
	    
	}

	analysisclose_Callback = function(e) {
		var obj = document.getElementById('analysis');
		var i =obj.className.indexOf('show');
		if( i > 0){
			obj.className = obj.className.substring(0,i-1);
		}
	}
    
	var label_Callback= function(e) {
		var id = e.data.id;
		var obj = document.getElementsByClassName(id+'content')[0];
		var i =obj.className.indexOf('show');
		if( i > 0){
			obj.className = obj.className.substring(0,i-1);
		}
		else{
			refreshanalysisLyr();
			obj.className += ' show';
		}
	}
	
	function initTimeseries(layer, timebin, info){
		var length = info.length;
		var state = '';
		for (var i = 0; i < length; i++){
			state += (info[i]+',');
		}
		state = state.substring(0 , state.length-1);
		if(state == ''){
			state = '-1';
		}
		$.ajax({
			url: "./TimeBin",
			type: "POST",
			data: {"layer":layer ,"timebin":timebin ,"state":state},
			success: function(str) {
				if(str.state == 'good'){
	    		    var NewData = {};
	    		    NewData.color = 'steelblue';
	    		    NewData.data = new Array();
	    		    var length = str.timebins.length; 
	    		    for(var i = 0; i < length; i++){
	    		    	var obj = {date : new Date(parseInt(str.timebins[i].time) * 1000), value : parseInt(str.timebins[i].num)};
	    		    	NewData.data.push(obj);
	    		    }
	    		    app.vref.widget.setData(NewData,'time');
	    		    app.vref.widget.redraw();
				} 				
			},
			dataType:'json'
		});
    }
    
    
    function update_callback(layer, timebin, start, end, info){
		var start,end,hour = -1;
		if(start == 0 && end == 0){
			start = 1370793600;
			end = 1370880000;
			hour = 12;
		}
		else {
			hour = (start.getHours() + end.getHours())/2;
			start = Date.parse(start)/1000;
			end = Date.parse(end)/1000;
		}
        
		var length = info.length;
		var state = '';
		for (var i = 0; i < length; i++){
			state += (info[i]+',');
		}
		state = state.substring(0 , state.length-1);
		if(state == ''){
			state = '-1';
		}
		
		console.log(layer+' '+timebin+' '+start+' '+end+' '+state+' '+hour);
		
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
		
		var obj = document.getElementById('time');
		if(obj != null){
	    	var i =obj.className.indexOf('show');
	    	if( i > 0){
	    		initTimeseries(layer, timebin, info);
	    	}			
		}

		var obj = document.getElementById('catalog');
		if(obj != null){
	    	var i =obj.className.indexOf('show');
	    	if( i > 0){
	    		initGroupedBarChart(layer, start, end);
	    	}
		}
		
		var url = BASE_PATH + '/TimeDisplay';
        var lyr=getLyr(layer);
        var source = lyr.getSource();
        source.setImageLoadFunction(function(image, src) {
      	  image.getImage().src = TransformBBOX(src)+'&z='+app.view.getZoom()+'&start='+start+'&end='+end+'&state='+state;
          });
        source.setUrl(url);
        source.updateParams({LAYERS: $('#timeselect').val()});
        source.refresh();	  
    }
    
    function initGroupedBarChart(layer, start, end){
		$.ajax({
			url: "./BarChart",
			type: "POST",
			data: {"layer":layer,"start":start,"end":end},
			success: function(str) {
				if(str.state == 'good'){
					var catalogData = new Array();
	    		    var length = str.data.length; 
	    		    for(var i = 0; i < length; i++){
	    		    	var obj = {addr : parseInt(i), cat : str.data[i].status, value : parseInt(str.data[i].num)};
	    		    	catalogData.push(obj);
	    		    }
	    		    app.vref1.widget.setData(catalogData,'catalog','steelblue')
	    		    app.vref1.widget.redraw();
				}		
			},
			dataType:'json'
		});
    }