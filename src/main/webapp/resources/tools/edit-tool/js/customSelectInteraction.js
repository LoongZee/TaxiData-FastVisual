/******* customSelectInteraction  ***************/       
    //自定义控件
    app.customSelectInteraction = function() {
      //交互控件
      this.selectInteraction = new ol.interaction.Select({
    	layers: [app.editInfo[0]]
      });
      
      var this_=this;
      
      //响应事件回调函数
      ol.interaction.Interaction.call(this, {
        handleEvent: function(evt) {
          this_.handleEvent_1(evt);
          
          return true;
        }
      });
    };
    
    //自定义选择交互控件继承于ol.interaction.Interaction
    ol.inherits(app.customSelectInteraction, ol.interaction.Interaction);
    
    app.customSelectInteraction.prototype.handleEvent_1 = function(evt){
    	if(app.status == selectStatus[1] && evt.type == "singleclick"){
            console.log('editing');
      		var view = evt.map.getView();
            var viewResolution = view.getResolution();
            var lyr=getLyr($('#editorselect').val());
            var source = lyr.getSource();
            var url = source.getGetFeatureInfoUrl(
              evt.coordinate, viewResolution, view.getProjection(),
              {'INFO_FORMAT': 'application/json'});
            var this_ = this;
            if (url) {
              $.ajax(url,{
            	  type: 'POST',
            	  dataType: 'json',
            	  processData: false,
            	  contentType: 'text/xml',
            	  success:function(geojsonObject)
            	  {
            		  var feats = geojsonObject.features;
            		  if(feats.length == 1){
            			  var f = (new ol.format.GeoJSON({
            				  geometryName: feats[0].geometry_name,
            				  featureProjection:ol.proj.get(app.projection3857) 
            				  })).readFeatures(geojsonObject);
            			  app.editInfo[0].getSource().clear();
            			  app.editInfo[0].getSource().addFeatures(f);
            			  app.editInfo[1]=feats[0].geometry.type;
            			  
            			  var filter = 'NOT IN(';
            			  for(var i in feats){
            				  filter += ("'"+feats[i].id+"',");
            			  }
            			  filter = filter.substring(0,filter.length-1)+(')');
            			  updateFilter(lyr,'cql',filter);
            		  }
            		  setTimeout(function(){ol.interaction.Select.handleEvent.call(this_.selectInteraction, evt);},100);
            	  },
                  error:function(res){
                	  alert('error!');
                  }
              });
            }
    	}    	
    }; 

    //setmap FUNCTION
    app.customSelectInteraction.prototype.setMap = function(map) {
      this.selectInteraction.setMap(map);
    };
    
    //getFeatures FUNCTION
    app.customSelectInteraction.prototype.getFeatures = function(){
      return this.selectInteraction.getFeatures();
    }
    //on FUNCTION
    app.customSelectInteraction.prototype.on = function(type, listener, opt_this){
      return this.selectInteraction.on(type,listener,opt_this);
    }
    
/** -------------------------------------------- */ 