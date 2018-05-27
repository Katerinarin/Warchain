var svg, projection, arcs, points;

ACC.supplychain = {
		initD3Map : function(mapContainer) { 																	//map initialization
		  svg = d3.select(mapContainer),
		    width = svg.attr("width"),
		    height = svg.attr("height");

		  projection = d3.geoMercator()
		    .scale(width / (2 * Math.PI)) 																		//creating map projection
		    .translate([width / 2, height / 1.5]);

		  var path = d3.geoPath() 																				//add projection on the map
		    .projection(projection);

		  d3.json("/Warchainstorefront/_ui/responsive/common/js/d3data/world-50m.json", function(error, world) { //loading country borders
		    if (error) throw error;

		    svg.insert("path") 																					//adding filled countries map
		      .datum(topojson.feature(world, world.objects.land))
		      .attr("class", "land")
		      .attr("d", path);

		    svg.insert("path")																					//adding countries borders
		      .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
		        return a !== b;
		      }))
		      .attr("class", "boundary")
		      .attr("d", path);
		  });
		},
		
		waitForMapInitToPerformAction: function(action) { 														//function wait for map upload, it is recursive and recalls itself
			if ($(".land").length) {																			// in period 300 milliseconds and only then begins action
				action();
			} else {
				setTimeout(function(){ACC.supplychain.waitForMapInitToPerformAction(action);}, 300);
			}
		},
		
		clearMapFromSupplyChains: function(){ 																	//function of clearing arcs and points
			svg.selectAll(".supply-chain")
			  .transition()
			  .duration(500)
			  .style("opacity", 0)
			  .remove();
		},
		
		drawArc: function(arcOrigin, arcDestination, firstArc, lastArc) { 										//arc drawing function
			var coordinates = [
			  projection(arcOrigin),
		      projection(arcDestination)
		    ];
			
			var line = arcs.append("path")
			  .datum(coordinates)
			  .attr("d", function(c) {
				var d = {
				  source: c[0],
				  target: c[1]
				};
				var dx = d.target[0] - d.source[0],
				  dy = d.target[1] - d.source[1],
				  dr = Math.sqrt(dx * dx + dy * dy);
				  horizontalShape = (dx < 0) ? "0 " : "1 ";
				return "M" + d.source[0] + "," + d.source[1] + "A" + dr + "," + dr +
				  " 0 0," + horizontalShape + d.target[0] + "," + d.target[1];
			  })
			  .style("stroke", "steelblue")
			  .style("stroke-width", 5)
			  .style("fill", "none")
			  .transition()
			  .duration(3000)
			  .attrTween("stroke-dasharray", function() {
				var len = this.getTotalLength();
				return function(t) {
				  return (d3.interpolateString("0," + len, len + ",0"))(t)
				};
			  })
			  .on('end', function(d) {
				var c = coordinates[1];
				points.append('circle')
				  .attr('cx', c[0])
				  .attr('cy', c[1])
				  .attr('r', 0)
				  .style('fill', lastArc ? 'green' : 'red')
				  .style('fill-opacity', '0.7')
				  .transition()
				  .duration(1000)
				  .attr('r', 20)
				  .on('end', function(d) {
					d3.select(this)
					  .transition()
					  .duration(1000)
					  .attr('r', 8)
					  .style('fill-opacity', '1');
				  });
			  });
			
			if (firstArc) { 																			//check if it is the first arc, then adding a point at the start
			  var c = coordinates[0];
			  points.append('circle')
				  .attr('cx', c[0])
				  .attr('cy', c[1])
				  .attr('r', 0)
				  .style('fill', lastArc ? 'green' : 'green')
				  .style('fill-opacity', '0.7')
				  .transition()
				  .duration(1000)
				  .attr('r', 20)
				  .on('end', function(d) {
					d3.select(this)
					  .transition()
					  .duration(1000)
					  .attr('r', 8)
					  .style('fill-opacity', '1');
				  });
			}
		},

		chainLoop: function(i, supplyChain, delay) { 												//function of all chainloop drawing 
			setTimeout(function () {
			  if (i < supplyChain.length) {
				  ACC.supplychain.drawArc(supplyChain[i-1], supplyChain[i], (i == 1) ? true : false, (i+1 == supplyChain.length) ? true : false);
				i++;
				ACC.supplychain.chainLoop(i, supplyChain, delay);
			  }
		   }, (i == 1) ? 0 : delay)
		}
}

$(document).ready(function(){
/*	if ($("#svg-map-container").length) {
		ACC.supplychain.initD3Map("#svg-map-container");
		var supplyChain = [[-43.2, -22.9], [37, 55], [125.8, 39], [-74, 40]]; //Возможно передать в функцию
		ACC.supplychain.waitForMapInitToPerformAction(function(){
			arcs = svg.append('g').attr("class", "supply-chain arcs");
			points = svg.append('g').attr("class", "supply-chain points");
			
			ACC.supplychain.chainLoop(1, supplyChain, 3000);
		});
	}*/
});
