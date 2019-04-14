 	function renderEditor(id){
		var editorstr='<div id="'+id+'" class="panel">'+
						  '<div class="panel-heading">'+
					          '<button type="button" id="editor-close" class="close" >&times;</button>'+
							  '<h3 class="panel-title">'+
								  'Editor'+
							  '</h3>'+
						  '</div>'+
						  '<div id="editor-body"class="panel-body">'+
						      '<div id="editor-1">'+
							      '<select id="editorselect" class="form-control editorinput"></select> '+
							      '<button id="editor-start" class="btn editorbtn">Start</button>'+
							      '<button id="editor-end" class="btn editorbtn">Stop</button>'+
							  '</div>'+
							  '<div id="editor-2">'+
							      '<button id="draw-tool" class="btn modify-tool" disabled="disabled"><span class="glyphicon glyphicon-plus"></span></button>'+
							      '<button id="modify-tool" class="btn modify-tool" disabled="disabled"><span class="glyphicon glyphicon-pencil"></span></button>'+
							      '<button id="delete-tool"class="btn modify-tool" disabled="disabled"><span class="glyphicon glyphicon-minus"></span></button>'+
							  '</div>'+
						  '</div>'+
				      '</div>';
	
		$('#map').append(editorstr);
		
		$("#editor").draggable({
		    handle: ".panel-heading"
		});
		
		refreshEditorLyr();	    
    }
 	
    //Filter function
    function updateFilter(lyr,filterType,filter){
        var filterParams = {
          'FILTER': null,
          'CQL_FILTER': null,
          'FEATUREID': null,
          "time": Date.now()
        };
        if (filter.replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "") {
          if (filterType == "cql") {
            filterParams["CQL_FILTER"] = filter;
          }
          if (filterType == "ogc") {
            filterParams["FILTER"] = filter;
          }
          if (filterType == "fid")
            filterParams["FEATUREID"] = filter;
          }
        lyr.getSource().updateParams(filterParams);
    }
    
    //transact function
    function transact(transType, feat) {
        var formatWFS = new ol.format.WFS();

        var formatGML = new ol.format.GML({
            featureNS: 'http://www.longzehao.com', // Your namespace
            featureType: $('#editorselect').val(),
            srsName: app.projection3857
        });
        
        switch (transType) {
            case 'insert':
                node = formatWFS.writeTransaction([feat], null, null, formatGML);
                break;
            case 'update':
                node = formatWFS.writeTransaction(null, [feat], null, formatGML);
                break;
            case 'delete':
                node = formatWFS.writeTransaction(null, null, [feat], formatGML);
                break;
        }
        
        s = new XMLSerializer();
        str = s.serializeToString(node);
        
        console.log(str);
        $.ajax('http://localhost:8080/geoserver/wfs',{
            type: 'POST',
            dataType: 'xml',
            processData: false,
            contentType: 'text/xml',
            data: str
        }).done();

    }
    
 	//editor-close callback function
 	function editorclose_Callback() {
    	var obj = document.getElementById('editor');
    	var i =obj.className.indexOf('show');
    	if( i > 0){
    		obj.className = obj.className.substring(0,i-1);
    	}
    }
 	
 	//editor-start callback function
 	function editorstart_Callback() {
    	if(app.status == selectStatus[0]) {
    		clearInteraction();
    		app.map.addLayer(app.editInfo[0]);
    		var selectlyr = $('#editorselect').val();
    		if(selectlyr != '' && selectlyr != undefined){
    			app.status = selectStatus[1];
    			
    			$('#layer-input').attr('disabled','disabled');
    			$('#addlyr-btn').attr('disabled','disabled');
    			$('#selectLyrname').attr('disabled','disabled');
    			$('#deletelyr-btn').attr('disabled','disabled');
    			
    			$('#editorselect').attr('disabled','disabled');
    			$('#editor-start').attr('disabled','disabled');
    			$('#editor-end').removeAttr('disabled');
    			$('#draw-tool').removeAttr('disabled');
    			$('#modify-tool').removeAttr('disabled');
    			$('#delete-tool').removeAttr('disabled');

    			url='http://localhost:8080/geoserver/wfs?version=1.0.0&request=DescribeFeatureType&outputFormat=application/json&typeName=Beijing:route';
			    $.ajax(url,{
               	  type: 'POST',
               	  dataType: 'json',
               	  processData: false,
               	  contentType: 'text/xml',
               	  success:function(geojsonObject)
               	  {
               		 var properties=geojsonObject.featureTypes[0].properties;
               		 for(var i = 0; i < properties.length; i++ ){
               			if(properties[i].name == 'the_geom'){
               				app.editInfo[1] = properties[i].localType;
               				break;
               			}
               		 }
               	  },
                  error:function(res){
               	     alert('error!');
                  }
                });
    		}
    		else {
    			alert('You shouldn select a layer');
    		}
    	}
    	else {
    		alert('You\'ve started editing , please stop it first!');
    	}
    }
 	
 	//editor-end callback function 	
 	function editorend_Callback() {
    	if(app.status == selectStatus[1]){
    		clearInteraction();
    		app.editInfo[0].getSource().clear();
    		app.map.removeLayer(app.editInfo[0]);
    		
    		var lyr = getLyr($('#editorselect').val());
    		updateFilter(lyr ,'cql' ,'');
    		
			$('#layer-input').removeAttr('disabled');
			$('#addlyr-btn').removeAttr('disabled');
			$('#selectLyrname').removeAttr('disabled');
			$('#deletelyr-btn').removeAttr('disabled');
			
			$('#editorselect').removeAttr('disabled');
			$('#editor-start').removeAttr('disabled');
			$('#editor-end').attr('disabled','disabled');
			$('#draw-tool').attr('disabled','disabled');
			$('#modify-tool').attr('disabled','disabled');
			$('#delete-tool').attr('disabled','disabled');	
			app.status = selectStatus[0];
    	}
    	else {
    		alert('Please start editting , then you can stop it!');
    	}
    }
 	
 	//draw-tool callback function 	
 	function drawtool_Callback() {
    	clearInteraction();
        var draw = new ol.interaction.Draw({
            source: app.editInfo[0].getSource(),
            type: app.editInfo[1],
            geometryName: 'the_geom',
    		style: styles
        });
        draw.set('tool','draw');
        app.map.addInteraction(draw);

        draw.on('drawend', function (e) {
            transact('insert', e.feature);
        });
    }
 	
 	//modify-tool callback function 
 	function modifytool_Callback() {
    	clearInteraction();
        var select = new app.customSelectInteraction();
        select.set('tool','select');
        var modify = new ol.interaction.Modify({
            features: select.getFeatures()
        });
        modify.set('tool','modify');
        app.map.addInteraction(select);
        app.map.addInteraction(modify);
       
        modify.on('modifyend', function (e) {
            transact('update',e.features.getArray()[0]);
        });
    }
 	
 	//delete-tool callback function 
 	function deletetool_Callback() {
    	clearInteraction();
        var select = new app.customSelectInteraction();
        select.set('tool','select');
        app.map.addInteraction(select);
        select.on('select', function (e) {
            if(select.getFeatures().getArray().length == 0) {
                console.log('null');
            } 
            else {
            	transact('delete', e.target.getFeatures().getArray()[0]);
                var f = app.editInfo[0].getSource().getFeatureById(e.target.getFeatures().getArray()[0].getId());
                app.editInfo[0].getSource().removeFeature(f);
                e.target.getFeatures().clear();
            }
        });
 	}

 	
 	
 	