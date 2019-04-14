/** Global params*/
    var selectStatus = new Array('normal','editing');
    
    var app= {
      map: null,
      osm_rasterparams: {chroma: 80, lightness: 80},
      osm_raster: null,
      heatlayer: null,
      baseGroupLayer: null,
      overGroupLayer: null,
      controls:null,
      view: null,
      center: [116.37955,39.91608],
      projection4326:'EPSG:4326',
      projection3857:'EPSG:3857',
      lyrSwitcher:  null,
      editInfo: new Array(),
      status : selectStatus[0],
      congest: {layer: null, source: new Array(0)},
      vref: {},
      vref1: {},
      vref2: {},
      json:null
    };
    
    var fill = new ol.style.Fill({
 	   color: 'rgba(255,255,255,0.2)'
 	 });
    var stroke = new ol.style.Stroke({
       color: '#3399CC',
       width: 1.25
    });
    var styles = [
       new ol.style.Style({
       image: new ol.style.Circle({
         fill: fill,
         stroke: stroke,
         radius: 5
       }),
       fill: fill,
       stroke: stroke
       })
    ];
/** -------------------------------------------- */ 


/*************** Import JS OR CSS ****************/   	
    /* 已加载文件缓存列表,用于判断文件是否已加载过，若已加载则不再次加载*/
	var classcodes =[];
	window.Import={
	  /*加载一批文件，_files:文件路径数组,可包括js,css,less文件,succes:加载成功回调函数*/
	  LoadFileList:function(_files,succes){
	    var FileArray=[];
	    if(typeof _files==="object"){
	      FileArray=_files;
	    }else{
	      /*如果文件列表是字符串，则用,切分成数组*/
	      if(typeof _files==="string"){
	        FileArray=_files.split(",");
	      }
	    }
	    if(FileArray!=null && FileArray.length>0){
	      var LoadedCount=0;
	      for(var i=0;i< FileArray.length;i++){
	        loadFile(FileArray[i],function(){
	          LoadedCount++;
	          if(LoadedCount==FileArray.length){
	            succes();
	          }
	        })
	      }
	    }
	    /*加载JS文件,url:文件路径,success:加载成功回调函数*/
	    function loadFile(url, success) {
	      if (!FileIsExt(classcodes,url)) {
	        var ThisType=GetFileType(url);
	        var fileObj=null;
	        if(ThisType==".js"){
	          fileObj=document.createElement('script');
	          fileObj.src = url;
	        }else if(ThisType==".css"){
	          fileObj=document.createElement('link');
	          fileObj.href = url;
	          fileObj.type = "text/css";
	          fileObj.rel="stylesheet";
	        }else if(ThisType==".less"){
	          fileObj=document.createElement('link');
	          fileObj.href = url;
	          fileObj.type = "text/css";
	          fileObj.rel="stylesheet/less";
	        }
	        success = success || function(){};
	        fileObj.onload = fileObj.onreadystatechange = function() {
	          if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
	            success();
	            classcodes.push(url)
	          }
	        }
	        document.getElementsByTagName('head')[0].appendChild(fileObj);
	      }else{
	        success();
	      }
	    }
	    /*获取文件类型,后缀名，小写*/
	    function GetFileType(url){
	      if(url!=null && url.length>0){
	        return url.substr(url.lastIndexOf(".")).toLowerCase();
	      }
	      return "";
	    }
	    /*文件是否已加载*/
	    function FileIsExt(FileArray,_url){
	      if(FileArray!=null && FileArray.length>0){
	        var len =FileArray.length;
	        for (var i = 0; i < len; i++) {
	          if (FileArray[i] ==_url) {
	            return true;
	          }
	        }
	      }
	      return false;
	    }
	  }
	}
	
	function getFilesArray(tool){
		var all_css = tool.css.split("&");
		var all_js = tool.js.split("&");
		var fileCSSSrc = BASE_PATH + '/resources/tools/' + tool.name + "/css/";
		var fileJsSrc = BASE_PATH + '/resources/tools/' + tool.name + "/js/";
		
		var FilesArray = new Array();
		
		for (i in all_css){
			if(all_css[i] != ""){
				FilesArray.push(fileCSSSrc + all_css[i]);
			}
		}
		for (i in all_js){
			if(all_js[i] != ""){
				FilesArray.push(fileJsSrc + all_js[i]);
			}
		}
		return FilesArray;
	}
	
	function getsecondFilesArray(tool, menu){
		var all_css = menu.css.split("&");
		var all_js = menu.js.split("&");
		var fileCSSSrc = BASE_PATH + '/resources/tools/' + tool.name + "/" + menu.name + "/css/";
		var fileJsSrc = BASE_PATH + '/resources/tools/' + tool.name + "/" + menu.name + "/js/";
		
		var FilesArray = new Array();
		
		for (i in all_css){
			if(all_css[i] != ""){
				FilesArray.push(fileCSSSrc + all_css[i]);
			}
		}
		for (i in all_js){
			if(all_js[i] != ""){
				FilesArray.push(fileJsSrc + all_js[i]);
			}
		}
		return FilesArray;
	}
/** -------------------------------------------- */ 

/***** map raster brightness function*************/   
    /**
     * Color manipulation functions below are adapted from
     * https://github.com/d3/d3-color.
     */
    var Xn = 0.950470;
    var Yn = 1;
    var Zn = 1.088830;
    var t0 = 4 / 29;
    var t1 = 6 / 29;
    var t2 = 3 * t1 * t1;
    var t3 = t1 * t1 * t1;
    var twoPi = 2 * Math.PI;

    /**
     * Convert an RGB pixel into an HCL pixel.
     * @param {Array.<number>} pixel A pixel in RGB space.
     * @return {Array.<number>} A pixel in HCL space.
     */
    function rgb2hcl(pixel) {
      var red = rgb2xyz(pixel[0]);
      var green = rgb2xyz(pixel[1]);
      var blue = rgb2xyz(pixel[2]);

      var x = xyz2lab(
          (0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / Xn);
      var y = xyz2lab(
          (0.2126729 * red + 0.7151522 * green + 0.0721750 * blue) / Yn);
      var z = xyz2lab(
          (0.0193339 * red + 0.1191920 * green + 0.9503041 * blue) / Zn);

      var l = 116 * y - 16;
      var a = 500 * (x - y);
      var b = 200 * (y - z);

      var c = Math.sqrt(a * a + b * b);
      var h = Math.atan2(b, a);
      if (h < 0) {
        h += twoPi;
      }

      pixel[0] = h;
      pixel[1] = c;
      pixel[2] = l;

      return pixel;
    }


    /**
     * Convert an HCL pixel into an RGB pixel.
     * @param {Array.<number>} pixel A pixel in HCL space.
     * @return {Array.<number>} A pixel in RGB space.
     */
    function hcl2rgb(pixel) {
      var h = pixel[0];
      var c = pixel[1];
      var l = pixel[2];

      var a = Math.cos(h) * c;
      var b = Math.sin(h) * c;

      var y = (l + 16) / 116;
      var x = isNaN(a) ? y : y + a / 500;
      var z = isNaN(b) ? y : y - b / 200;

      y = Yn * lab2xyz(y);
      x = Xn * lab2xyz(x);
      z = Zn * lab2xyz(z);

      pixel[0] = xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
      pixel[1] = xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
      pixel[2] = xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

      return pixel;
    }

    function xyz2lab(t) {
      return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
    }

    function lab2xyz(t) {
      return t > t1 ? t * t * t : t2 * (t - t0);
    }

    function rgb2xyz(x) {
      return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function xyz2rgb(x) {
      return 255 * (x <= 0.0031308 ?
          12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }
/** -------------------------------------------- */ 
	
/*** TransformBBOX from 3857 to 4326 *************/   	
    function TransformBBOX(src){
    	if (src.indexOf("?") != -1) {
    		var str = src.substr(1);
    		strs = str.split("&");
    		for(var i = 0; i < strs.length; i ++) {     
			     var name = strs[i].split("=")[0];
			     if(name =='BBOX'){ 
			    	 var extent = ol.proj.transformExtent( unescape(strs[i].split("=")[1]).split(","), app.projection3857, app.projection4326);
			    	 src = src.replace(strs[i],'BBOX='+extent.join(","));
			     }
		      }
		   }
    	return src;
    }
/** -------------------------------------------- */ 	
	
/************** getLyr FUNCTION ******************/    
    function getLyr(lyrname){
    	var lyr=null;
    	var lyrs = app.overGroupLayer.getLayers();
    	for(var i = 0;i < lyrs.getLength();i++ ){
    		if(lyrs.item(i).get('title') == lyrname){
    			lyr=lyrs.item(i);
  	              break;
    		}
    	}
    	return lyr;
    }
/** -------------------------------------------- */ 
    
    
/********* refreshEditorLyr FUNCTION *************/
    function refreshEditorLyr(){
    	var select = document.getElementById('editorselect');
    	if(select != null){
        	select.innerHTML = '';
        	var lyrs = app.overGroupLayer.getLayers();
        	for(var i = 0;i < lyrs.getLength();i++ ){
            	var option = document.createElement('option');
            	option.setAttribute('value',lyrs.item(i).get('title'));
            	option.innerHTML = lyrs.item(i).get('title');
            	select.appendChild(option);
        	}
    	}
    }
 /** -------------------------------------------- */ 
    
 /******* refreshanalysisLyr FUNCTION *************/   
    function refreshanalysisLyr(){
    	addoption('queryselect');
    	addoption('heatmapselect');
    	addoption('timeselect');
    	addoption('updownselect');
    	addoption('congestselect');

    	function addoption(selectname){
    		var select = document.getElementById(selectname);
    		if(select != null){
            	select.innerHTML = '';
            	var lyrs = app.overGroupLayer.getLayers();
            	for(var i = 0;i < lyrs.getLength();i++ ){
                	var option = document.createElement('option');
                	option.setAttribute('value',lyrs.item(i).get('title'));
                	option.innerHTML = lyrs.item(i).get('title');
                	select.appendChild(option);
            	}
            }
    	}
    }
/** -------------------------------------------- */ 

/******* clearInteraction FUNCTION ***************/       
    function clearInteraction(){
    	var Interactions = app.map.getInteractions()
    	for(var i = 0;i < Interactions.getLength();i++ ){
    		if(Interactions.item(i).get('tool') != null ||
    				Interactions.item(i).get('tool') != undefined){
    			app.map.removeInteraction(Interactions.item(i));
    		}
    	}
    }
 /** -------------------------------------------- */ 