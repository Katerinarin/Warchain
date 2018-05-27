var svg, projection, arcs, points;
var mapInitialized = false;

function initD3Map(mapContainer) {
	svg = d3.select(mapContainer),
    width = svg.attr("width"),
    height = svg.attr("height");

  projection = d3.geoMercator()
    .scale(width / (2 * Math.PI))
    .translate([width / 2, height / 1.5]);

  var path = d3.geoPath()
    .projection(projection);

  d3.json("/Warchainstorefront/_ui/responsive/common/js/d3data/world-50m.json", function(error, world) {
    if (error) throw error;

    svg.insert("path")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    svg.insert("path")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
        return a !== b;
      }))
      .attr("class", "boundary")
      .attr("d", path);
	  
	mapInitialized = true;
  });
}

function waitForMapInitToPerformAction(action) {
	if (mapInitialized) {
		action();
	} else {
		setTimeout(function(){waitForMapInitToPerformAction(action);}, 300);
	}
}

function clearMapFromSupplyChains(){
	svg.selectAll(".supply-chain")
	  .transition()
	  .duration(500)
	  .style("opacity", 0)
	  .remove();
}

function drawArc(arcOrigin, arcDestination, firstArc, lastArc) {
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
	
	if (firstArc) {
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
}

function chainLoop(i, numberOfElements, delay) {
	setTimeout(function () {
	  if (i < numberOfElements) {
		drawArc(supplyChain[i-1], supplyChain[i], (i == 1) ? true : false, (i+1 == numberOfElements) ? true : false);
		i++;
		chainLoop(i, numberOfElements, delay);
	  }
   }, (i == 1) ? 0 : delay)
}

if ($("#svg-map-container").length) {
	initD3Map("#svg-map-container");
	var supplyChain = [[-43.2, -22.9], [37, 55], [125.8, 39], [-74, 40]]; //Возможно передать в функцию
	waitForMapInitToPerformAction(function(){
		arcs = svg.append('g').attr("class", "supply-chain arcs");
		points = svg.append('g').attr("class", "supply-chain points");
		
		chainLoop(1, supplyChain.length, 3000);
	});
}