/*global $,d3 */

function Citycongest(name, mar){
    var id = '#'+name;

    this.data = {};

    //code
    this.margin = null;
    if (mar==undefined){
    	this.margin = {top: 30, right: 40, bottom: 30, left: 50};
    }

    this.width = $(id).width() - this.margin.left - this.margin.right;
    this.height = $(id).height()- this.margin.top - this.margin.bottom;
    
    this.congest_callback = null;
    
    this.x = d3.time.scale()
        .range([0, this.width]);
   
    
    this.xAxis = d3.svg.axis().scale(this.x)
        .orient("bottom");
        
   
    var that = this;

    this.svg = d3.select(id).append("svg")
        .attr("width", that.width + that.margin.left + that.margin.right)
        .attr("height", that.height + that.margin.top + that.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + that.margin.left + "," 
              + that.margin.top + ")");

    //add svg stuffs
    this.svg.append("text")
        .attr("x", 5)
        .attr("y", 5)
        .text("");
 

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (that.height) + ")")
        .call(this.xAxis);

}

Citycongest.prototype.setBinSizeTxt=function(timeinh){
   
	this.svg.append("text")
	.attr("x", 0)
        .attr("y", -10)
	.text(timeinh+"s");  
};

Citycongest.prototype.setData=function(line,key){
    this.data[key] = line; 
    this.updateRanges();
};

Citycongest.prototype.keys=function(){
    return Object.keys(this.data);
}

Citycongest.prototype.removeData=function(key){
    delete this.data[key];
    this.updateRanges();
};

Citycongest.prototype.updateRanges=function(){
    var that = this;
    var data = Object.keys(that.data).reduce(function(previous,current){ 
        return previous.concat(that.data[current].data);
    },  []);
    
    //set domain
    var xext = d3.extent(data, function(d) { return d.date; });
    var yext = d3.extent(data, function(d) { return d.value; });

    var xdom = this.x.domain();
    if(xdom[0].getTime()==0 && xdom[1].getTime()==1){ 
        //set x to xext for init only
        this.x.domain(xext);
    }
    
};

Citycongest.prototype.redraw=function(){
    //update the axis
    this.svg.select("g.x.axis").call(this.xAxis);

    //Remove lines
    this.svg.selectAll("path.line").data([]).exit().remove();
    //Remove points

    var that = this;
    //Draw Lines
    Object.keys(that.data).forEach(function(l){ 
        var line = that.data[l];
        that.drawrect(line.data, line.color); 
    });    
};

Citycongest.prototype.drawrect=function(data,color){
	//添加矩形元素
	var that = this;
	
	var rects = this.svg.selectAll(".MyRect")
		.data(data.slice(0,data.length-1))
		.enter()
		.append("rect")
		.attr("class","MyRect")
		.attr("transform","translate(" + that.margin.left + "," + that.margin.top + ")")
		.attr("x", function(d,i){
			return that.x(d.date)-50;
		} )
		.attr("y",function(d){
			return -30;
		})
		.attr("width", 37)
		.attr("height", function(d){
			return that.height ;
		})
		.attr("fill","steelblue")		//填充颜色不要写在CSS里
		.on("mouseover",function(d,i){
			d3.select(this)
				.attr("fill","#fd8d3c");
			that.congest_callback(d,i);
		})
		.on("mouseout",function(d,i){
			d3.select(this)
				.transition()
		        .duration(500)
				.attr("fill","steelblue");
		});

};
