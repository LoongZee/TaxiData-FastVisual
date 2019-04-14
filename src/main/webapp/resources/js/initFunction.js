$(document).ready(function () {
        
/** Map width and height - window resize */
    var mapDiv = $('#map');
    mapDiv.height($(window).height());
    mapDiv.width($(window).width());

    $(window).resize(function () {
        mapDiv.height($(window).height());
        mapDiv.width($(window).width());
    });
/** -------------------------------------------- */
 
/** Initial map settings */
    
    app.osm_raster = new ol.source.Raster({
        sources: [new ol.source.OSM()],
        operation: function(pixels, data) {
          var hcl = rgb2hcl(pixels[0]);


          hcl[1] *= (data.chroma / 100);
          hcl[2] *= (data.lightness / 100);

          return hcl2rgb(hcl);
        },
        lib: {
          rgb2hcl: rgb2hcl,
          hcl2rgb: hcl2rgb,
          rgb2xyz: rgb2xyz,
          lab2xyz: lab2xyz,
          xyz2lab: xyz2lab,
          xyz2rgb: xyz2rgb,
          Xn: Xn,
          Yn: Yn,
          Zn: Zn,
          t0: t0,
          t1: t1,
          t2: t2,
          t3: t3,
          twoPi: twoPi
        }
      });
    
    app.osm_raster.on('beforeoperations', function(event) {
        var data = event.data;
        data.chroma = app.osm_rasterparams.chroma;
        data.lightness = app.osm_rasterparams.lightness;
      });
    
    
    app.heatlayer = new ol.layer.Heatmap({
        source: new ol.source.Vector()
      });
    
    app.baseGroupLayer = new ol.layer.Group({
        title: 'Base map',
        layers: [
            new ol.layer.Image({
                title: 'OSM',
                source: app.osm_raster
            })
        ]
    });
    
    app.overGroupLayer = new ol.layer.Group({
    	title: 'maps',
    });
    
    app.view = new ol.View({
    	zoom: 10,
        projection: app.projection3857,
        center: ol.proj.transform(app.center, app.projection4326, app.projection3857) //Beijing
    }) 
    	 
    app.editInfo[0] = new ol.layer.Vector({
    	source: new ol.source.Vector(),
		style: styles
    });
    
    for(var i = 0; i< 24; i++){
    	app.congest.source.push(    	
	    	new ol.source.ImageStatic({
	            url: 'resources/img/'+i+'c.png',
	            imageSize: [2610, 2580],
	            imageExtent: ol.proj.transformExtent([115.476701,39.443639,117.49700912457904,40.981164], app.projection4326, app.projection3857) ,
	            projection: app.view.getProjection()
	          })  
    	);
    }
    
    app.congest.layer = new ol.layer.Image({
    	title: 'congest',
    	opacity: 0.6,
        source: app.congest.source[0]
     });
    
    app.controls = ol.control.defaults({ attribution: false }).extend([
                        new ol.control.MousePosition({
                            undefinedHTML: 'None',
                            coordinateFormat: ol.coordinate.createStringXY(3),
                            projection: app.projection4326,
                            className: 'mouse-position'
                        })
                   ]);
    
    app.map = new ol.Map({
       target: 'map',
       layers: [app.baseGroupLayer,app.overGroupLayer],
       controls: app.controls,
       view:app.view
    });
    

    
/** -------------------------------------------- */


/** Create custom controls for layer control, editing and analysis */
    window.olFeatControls = {};
    app.customControls = window.olFeatControls;

    //Tools panel toggle control button
    app.customControls.PanelBtn = function(opt_options) {
        var options = opt_options || {};
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', 'panel-button');
        btn.className = 'panel-button';
        btn.innerHTML = '<span class="glyphicon glyphicon-chevron-down"></span>';

        ol.control.Control.call(this, {
            element: btn,
            target: options.target
        });
    };
    ol.inherits(app.customControls.PanelBtn, ol.control.Control);
    app.map.addControl(new app.customControls.PanelBtn());

    // Layer control, Edit, Analysis tools within panel
    app.customControls.ToolsPanel = function (opt_options) {
        var options = opt_options || {};
        var panel = document.createElement('div');
        panel.setAttribute('id', 'panel');
        panel.className = 'main-panel';

        var layercontrolBtn = document.createElement('button');
        layercontrolBtn.className = 'tool-btn';
        layercontrolBtn.setAttribute('type','button');
        layercontrolBtn.setAttribute('id','layer-control-tool');
        layercontrolBtn.innerHTML = 'Layer control';

        var editBtn = document.createElement('button');
        editBtn.className = 'tool-btn';
        editBtn.setAttribute('type','button');
        editBtn.setAttribute('id','edit-tool');
        editBtn.innerHTML = 'Editor';
    
        var analysisBtn = document.createElement('button');
        analysisBtn.className = 'tool-btn';
        analysisBtn.setAttribute('type','button');
        analysisBtn.setAttribute('id','analysis-tool');
        analysisBtn.innerHTML = 'Analysis';

        panel.appendChild(layercontrolBtn);
        panel.appendChild(editBtn);
        panel.appendChild(analysisBtn);

        ol.control.Control.call(this, {
            element: panel,
            target: options.target
        });
    };

    ol.inherits(app.customControls.ToolsPanel, ol.control.Control);
    app.map.addControl(new app.customControls.ToolsPanel());
/** -------------------------------------------- */


/** Tools panel toggle functionality */
    
    var panelTools = $('#panel');
    var panelButton = $('#panel-button');
    panelButton.click(function () {
        if (panelTools.css('top') === '-50px') {
            panelButton.animate({
                top: '50px'
            }, {duration: '500', queue: false});

            panelTools.animate({
                top: '0'
            }, {duration: '500', queue: false});
            panelButton.html('<span class="glyphicon glyphicon-chevron-up"></span>');
        } else {
            panelButton.animate({
                top: '0'
            }, {duration: '500', queue: false});

            panelTools.animate({
                top: '-50px'
            }, {duration: '500', queue: false});
            panelButton.html('<span class="glyphicon glyphicon-chevron-down"></span>');
        }
    });
/** -------------------------------------------- */

/******************* Read json  ******************/    
    get_JSON();
    function get_JSON() {
        $.ajax({
            type: "GET",
            url: BASE_PATH + "/resources/framework/tools_Info.json",
            dataType: "text",
            success: function (data) {
               app.json = eval("(" + data + ")");
            }
        });
     }
    
/** -------------------------------------------- */   
    
/*** Adding functionality to layer-control-tool **/
    //Layer control click event 
    $('#layer-control-tool').click(function(e) {
    	var obj = document.getElementById(app.json.tools[0].id);
    	if(obj == null){
    		if(app.json.tools[0].name == "layer-control-tool"){
	    		var tool = app.json.tools[0];
	    		var FilesArray = getFilesArray(tool);
	    		Import.LoadFileList(FilesArray,function(){
	    			app.lyrSwitcher = new ol.control.LayerSwitcher();
	    			app.map.addControl(app.lyrSwitcher);
	    			//add layer event
	    			$('.layer-switcher').on('click','#addlyr-btn',addlayer_Callback);
	    			//delete layer event
	    			$('.layer-switcher').on('click','#deletelyr-btn',deletelayer_callback);
	    			layershown();
	    		});
    		}
    	}
    	else {
        	layershown();
    	}
    	
    	function layershown(){
        	var cls = $('#layerswitcher-tool').attr('class');
        	var isShown = cls.indexOf('shown') > 0 ? true : false; 
        	if(!isShown){
                e = e || window.event;
                app.lyrSwitcher.showPanel();
                e.preventDefault();
        	}
        	else{
        		app.lyrSwitcher.hidePanel();
        	} 
    	}
    });
       
/** -------------------------------------------- */   
    
    
/********** Adding functionality to Editor *******/
    
    $('#edit-tool').click(function(e) {
    	var obj = document.getElementById(app.json.tools[1].id);
    	if(obj == null){
    		if(app.json.tools[1].name == "edit-tool"){
	    		var tool = app.json.tools[1];
	    		var FilesArray = getFilesArray(tool);
	    		Import.LoadFileList(FilesArray,function(){
	    			renderEditor(app.json.tools[1].id);
	    			//editor close event 
	    		    $('#editor-close').click(editorclose_Callback);
	    		    //editor start event 
	    		    $('#editor-start').click(editorstart_Callback);
	    		    //editor end event 
	    		    $('#editor-end').click(editorend_Callback);
	    		    //draw tool event 
	    		    $('#draw-tool').click(drawtool_Callback);
	    		    //modify tool event 
	    		    $('#modify-tool').click(modifytool_Callback);    
	    		    //delete tool event 
	    		    $('#delete-tool').click(deletetool_Callback);
	    		    
	    			obj = document.getElementById(app.json.tools[1].id);
	    	    	if(obj.className.indexOf('show') < 0){
	    	    		obj.className += ' show';
	    	    	}
	    		});
    		}
    	}
    	else {
        	if(obj.className.indexOf('show') < 0){
        		obj.className += ' show';
        	}
    	}
    }); 
/** -------------------------------------------- */     
    
/*********** Adding functionality to Analysis*****/
    
    $('#analysis-tool').click(function(e) {
    	if(app.status == selectStatus[0]) {
        	var obj = document.getElementById(app.json.tools[2].id);
        	if(obj == null){
        		if(app.json.tools[2].name == "analysis-tool"){
        			//renderanalysis();
        			var tool = app.json.tools[2];
    	    		var FilesArray = getFilesArray(tool);
    	    		Import.LoadFileList(FilesArray,function(){
    	    			//render Firstmenu
    	    			renderanalysis(tool.id);
    	    			//analysis close event 
    	    			$('#analysis-close').click(analysisclose_Callback);
                        //render Secondmenu
    	    			if(tool.secondMenuFlag == "true"){
    	    				menus = tool.secondMenu;
    	    				for(var i = 0; i < menus.length; i++){
    	    					(function (i) {
    	    				    $('.'+menus[i].id+'label').click({id: menus[i].id}, label_Callback);
    	    				    //get SecondMenu js and css
    	    				    var FilesArray = getsecondFilesArray(tool, menus[i]);
    	    				    Import.LoadFileList(FilesArray,function(){
    	    				    	eval("init_"+menus[i].id+"()");
    	    				    });
    	    					})(i);
    	    				}
    	    			}
            			obj = document.getElementById(tool.id);
    	    	    	if(obj.className.indexOf('show') < 0){
    	    	    		obj.className += ' show';
    	    	    	}
    	    		});
        		}
        	}
        	else {
            	if(obj.className.indexOf('show') < 0){
            		obj.className += ' show';
            	}	
        	}
    	}
    	else {
    		alert('You\'ve started editing , please stop it first!');
    	}
    });
    
/** -------------------------------------------- */ 
});