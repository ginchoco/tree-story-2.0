ScrollReveal().reveal('.heading');

// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 60

// The radius of the pieplot is approximately half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) * 7 / 16 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz1")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + (width - 100) / 2 + "," + (height - 100) / 2 + ")");

// Handmade legend
svg.append("circle").attr("cx",150).attr("cy",130).attr("r", 6).style("fill", "rgba(0, 177, 106, 1)")
svg.append("circle").attr("cx",150).attr("cy",160).attr("r", 6).style("fill", "rgba(246, 71, 71, 1)")
svg.append("circle").attr("cx",150).attr("cy",190).attr("r", 6).style("fill", "rgba(105, 105, 105 ,1)")
svg.append("text").attr("x", 170).attr("y", 130).text("healthy").style("font-size", "15px").style("fill", "rgba(0, 177, 106, 1)").attr("alignment-baseline","middle").attr("font-weight", 700)
svg.append("text").attr("x", 170).attr("y", 160).text("diseased").style("font-size", "15px").style("fill", "rgba(246, 71, 71, 1)").attr("alignment-baseline","middle").attr("font-weight", 700)
svg.append("text").attr("x", 170).attr("y", 190).text("dead").style("font-size", "15px").style("fill", "rgba(105, 105, 105 ,1)").attr("alignment-baseline","middle").attr("font-weight", 700)

// create data_sets
var data1 = {healthy: 12, diseased: 1, dead: 11}
var data2 = {healthy: 8, diseased: 1, dead: 15}
var data3 = {healthy: 21, diseased: 3, dead: 0}
var data4 = {healthy: 16, diseased: 8, dead: 0}
var data5 = {healthy: 19, diseased: 5, dead: 0}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(["healthy", "diseased", "dead"])
  .range(["rgba(0, 177, 106, 1)", "rgba(246, 71, 71, 1)", "rgba(105, 105, 105 ,1)"]);

// A function that create / update the plot for a given variable:
function update(data) {

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  var data_ready = pie(d3.entries(data))

  // map to data
  var u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

  // remove the group that is not present anymore
  u
    .exit()
    .remove()

}

// Initialize the plot with the first dataset
update(data1)



// // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // //            FINAL HEIGHT BOX PLOT     / // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // 


// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 40},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#my_dataviz2")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// // Read the data and compute summary statistics for each specie
// d3.csv("https://raw.githubusercontent.com/ilkercancicek/Group-Design-Practical/main/hybrid_walnut.csv", function(data) {

//   // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
//   var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
//     .key(function(d) { return d.Species;})
//     .rollup(function(d) {
//       q1 = d3.quantile(d.map(function(g) { return g.Final_Height;}).sort(d3.ascending),.25)
//       median = d3.quantile(d.map(function(g) { return g.Final_Height;}).sort(d3.ascending),.5)
//       q3 = d3.quantile(d.map(function(g) { return g.Final_Height;}).sort(d3.ascending),.75)
//       interQuantileRange = q3 - q1
//       min = q1 - 1.5 * interQuantileRange
//       max = q3 + 1.5 * interQuantileRange
//       return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
//     })
//     .entries(data)

//   // Show the X scale
//   var x = d3.scaleBand()
//     .range([ 0, width ])
//     .domain(["Bressanvido", "IRTA X-80", "MJ209", "NG23", "NG38"])
//     .paddingInner(1)
//     .paddingOuter(.5)
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x))

//   // Show the Y scale
//   var y = d3.scaleLinear()
//     .domain([0,625])
//     .range([height, 0])
//   svg.append("g").call(d3.axisLeft(y))

//   // Show the main vertical line
//   svg
//     .selectAll("vertLines")
//     .data(sumstat)
//     .enter()
//     .append("line")
//       .attr("x1", function(d){return(x(d.key))})
//       .attr("x2", function(d){return(x(d.key))})
//       .attr("y1", function(d){return(y(d.value.min))})
//       .attr("y2", function(d){return(y(d.value.max))})
//       .attr("stroke", "black")
//       .style("width", 40)

//   // rectangle for the main box
//   var boxWidth = 100
//   svg
//     .selectAll("boxes")
//     .data(sumstat)
//     .enter()
//     .append("rect")
//         .attr("x", function(d){return(x(d.key)-boxWidth/2)})
//         .attr("y", function(d){return(y(d.value.q3))})
//         .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
//         .attr("width", boxWidth )
//         .attr("stroke", "black")
//         .style("fill", "#69b3a2")

//   // Show the median
//   svg
//     .selectAll("medianLines")
//     .data(sumstat)
//     .enter()
//     .append("line")
//       .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
//       .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
//       .attr("y1", function(d){return(y(d.value.median))})
//       .attr("y2", function(d){return(y(d.value.median))})
//       .attr("stroke", "black")
//       .style("width", 80)

// // Add individual points with jitter
// var jitterWidth = 50
// svg
//   .selectAll("indPoints")
//   .data(data)
//   .enter()
//   .append("circle")
//     .attr("cx", function(d){return(x(d.Species) - jitterWidth/2 + Math.random()*jitterWidth )})
//     .attr("cy", function(d){return(y(d.Final_Height))})
//     .attr("r", 4)
//     .style("fill", "white")
//     .attr("stroke", "black")


// })
