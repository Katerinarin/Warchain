	var	 w = 364,
         h = 200;

    var useGreatCircles = true;

    d3.loadData = function() {
        var loadedCallback = null;
        var toload = {};
        var data = {};
        var loaded = function(name, d) {
          delete toload[name];
          data[name] = d;
          return notifyIfAll();
        };
        var notifyIfAll = function() {
          if ((loadedCallback != null) && d3.keys(toload).length === 0) {
            loadedCallback(data);
          }
        };
        var loader = {
          json: function(name, url) {
            toload[name] = url;
            d3.json(url, function(d) {
              return loaded(name, d);
            });
            return loader;
          },
          csv: function(name, url) {
            toload[name] = url;
            d3.csv(url, function(d) {
              return loaded(name, d);
            });
            return loader;
          },
          onload: function(callback) {
            loadedCallback = callback;
            notifyIfAll();
          }
        };
        return loader;
      };



    var projection = d3.geo.mercator()
        .translate([w/2,h/2])
        .scale(364);
   
/*

 var projection = d3.geo.albers()
        .origin([-500, 300])
        .scale(100);  
  var projection = d3.geo.azimuthal()
        .origin([80, 400])
        .scale(200);

*/

    var path = d3.geo.path()
        .projection(projection);

    var arc = d3.geo.greatArc().precision(3) //3);

    var svg = d3.select("#d3map").append("svg")
        .attr("width", w)
        .attr("height", h);

    var countries = svg.append("g").attr("id", "countries");
    var centroids = svg.append("g").attr("id", "centroids");
    var arcs = svg.append("g").attr("id", "arcs");

    svg.append("text")
      .attr("id", "loading")
      .attr("x", 5)
      .attr("y", 17)
      .attr("font-size", "9pt")
      .attr("font-family", "arial")
      .text("Loading...");

    d3.loadData()
      .json('countries', '/Warchainstorefront/_ui/responsive/common/js/d3data/world-countries.json')
      .csv('nodes', '/Warchainstorefront/_ui/responsive/common/js/d3data/refugee-nodes.csv')
      .csv('flows', '/Warchainstorefront/_ui/responsive/common/js/d3data/refugee-flows.csv')
      .onload(function(data) {

        d3.select("#loading").attr("visibility", "hidden");

        var nodeDataByCode = {}, links = [];
        var year = '2008';
        var maxMagnitude =
          d3.max(data.flows, function(d) { return parseFloat(d[year])});
        var magnitudeFormat = d3.format(",.0f");

        var arcWidth = d3.scale.linear().domain([1, maxMagnitude]).range([.1, 2]);
        var minColor = '#f0f0f0', maxColor = '#008fd3';
        var arcColor = d3.scale.log().domain([1, maxMagnitude]).range([minColor, maxColor]);
        var arcOpacity = d3.scale.log().domain([1, maxMagnitude]).range([0.3, 1]);

        countries.selectAll("path")
          .data(data.countries.features)
        .enter().append("path")
          .attr("d", path);





        function nodeCoords(node) { 
          var lon = parseFloat(node.Lon), lat = parseFloat(node.Lat);
          if (isNaN(lon) || isNaN(lat)) return null;
          return [lon, lat]; 
        }

        data.nodes.forEach(function(node) {
          node.coords = nodeCoords(node);
          node.projection = node.coords ? projection(node.coords) : undefined;
          nodeDataByCode[node.Code] = node;
        });

        //data.flows = data.flows.filter(function(d) { return (d.Origin == 'IDN' && d.Dest == 'USA') ||  (d.Origin == 'LBR'  &&  d.Dest == 'NZL' );  });

        data.flows.forEach(function(flow) {
          var o = nodeDataByCode[flow.Origin], co = o.coords, po = o.projection;
          var d = nodeDataByCode[flow.Dest], cd = d.coords, pd = d.projection;
          var magnitude = parseFloat(flow[year]);
          if (co  &&  cd  &&  !isNaN(magnitude)) {
            links.push({
              source: co, target: cd,
              magnitude: magnitude,
              origin:o, dest:d,
              originp: po, destp:pd 
            });
          }
        });


        centroids.selectAll("circle")
          .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
        .enter().append("circle")
          .attr("cx", function(d) { return d.projection[0] } )
          .attr("cy", function(d) { return d.projection[1] } )
          .attr("r", 2)
          .attr("fill", "#000")
          .attr("opacity", 1)
          ;



        var strokeFun = function(d) { return arcColor(d.magnitude); };

        function splitPath(path) {
          var avgd = 0, i, d;
          var c, pc, dx, dy;
          var points = path.split("L");
          if (points.length < 2) return path;
          var newpath = [ points[0] ];
          var coords = points.map(function(d, i) {
            return d.substr(i > 0 ? 0 : 1).split(","); // remove M and split
          });

          // calc avg dist between points
          for (i = 1; i < coords.length; i++) {
            pc = coords[i-1]; c = coords[i];
            dx = c[0] - pc[0]; dy = c[1] - pc[1];
            d = Math.sqrt(dx*dx + dy*dy);
            c.push(d);  // push dist as last elem of c
            avgd += d;
          }
          avgd /= coords.length - 1;

          // for points with long dist from prev use M instead of L
          for (i = 1; i < coords.length; i++) {
            c = coords[i];
            newpath.push((c[2] > 5 * avgd ? "M" : "L") + points[i]);
          }
          return newpath.join("");
        }

        var gradientNameFun = function(d) { return "grd"+d.origin.Code+d.dest.Code; };
        var gradientRefNameFun = function(d) { return "url(#"+gradientNameFun(d)+")"; };

        var defs = svg.append("svg:defs");



        var gradient = defs.selectAll("linearGradient")
          .data(links)
        .enter()
          .append("svg:linearGradient")
            .attr("id", gradientNameFun)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", function(d) { 
              return d.originp[0]; })
            .attr("y1", function(d) { return d.originp[1]; })
            .attr("x2", function(d) { return d.destp[0]; })
            .attr("y2", function(d) { return d.destp[1]; })
            ;

        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", minColor)
            .attr("stop-opacity", .0);
        gradient.append("svg:stop")
            .attr("offset", "80%")
            .attr("stop-color", strokeFun)
            .attr("stop-opacity", 1.0);
        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", strokeFun)
            .attr("stop-opacity", 1.0);



        var arcNodes = arcs.selectAll("path")
          .data(links)
        .enter().append("path")
          //.attr("visibility", function(d) { return d.magnitude > 500 ? "visible" : "hidden"})
          .attr("stroke", gradientRefNameFun)
          //.attr("stroke", "red")
          //.attr("opacity", function(d) { return arcOpacity(d.magnitude); })
          //.attr("stroke", strokeFun)
          .attr("stroke-linecap", "round")
          .attr("stroke-width", function(d) { return arcWidth(d.magnitude); })
          .attr("d", function(d) { 
            if (useGreatCircles)
              return splitPath(path(arc(d)));
            else 
              return path({
                type: "LineString",
                coordinates: [d.source, d.target]
              });
          })
          .sort(function(a, b) {
            var a = a.magnitude, b = b.magnitude;
            if (isNaN(a)) if (isNaN(b)) return 0; else return -1; if (isNaN(b)) return 1;
            return d3.ascending(a, b); 
          });
        arcNodes.on("mouseover", function(d) { 
          d3.select(this)
            .attr("stroke", "red")
            .attr("marker-end", "url(#arrowHead)");
        })
        arcNodes.on("mouseout", function(d) {
            d3.select(this)
              .attr("marker-end", "none")
              .attr("stroke", gradientRefNameFun); })
        ;


        arcNodes.append("svg:title")
          .text(function(d) {
            return d.origin.Name+" -> "+d.dest.Name+"\n"+
                   "Refugees in " +year+": " +magnitudeFormat(d.magnitude); 
        })
        ;

        /*
        setTimeout(function() {
          arcs.selectAll("path").attr("marker-end", "url(#arrowHead)");
        }, 0);
        */

      });
    

