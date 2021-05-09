// set the dimensions and margins of the graph
const width = 450
const height = 450
const margin = 60

const radius = Math.min(width, height) * 7 / 16 - margin

// unfortunate global variables. Should never leave this file
// DON'T IMPORT THIS FILE AS A SCRIPT TAG ANYWHERE 
// WILL CAUSE NAMESPACE CLASH
let svg;
let data;
let colour;

export const init = (selector, in_data) => {
    svg = d3.select(selector)
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

    colour = d3.scaleOrdinal()
        .domain(["healthy", "diseased", "dead"])
        .range(["rgba(0, 177, 106, 1)", "rgba(246, 71, 71, 1)", "rgba(105, 105, 105 ,1)"]);


    data = in_data

    setup_events("pie_button") 
    render(0) // could be more generic. Relies on specific heading names
}

const setup_events = (class_name) => {
    const buttons = document.getElementsByClassName(class_name)
    // grabs all elements with the class name
    // adds an onclick event to render correctly
    // bases onclick parameter on button id
    Array.from(buttons).forEach(button => {
        console.log(button)
        button.addEventListener("click", () => render(+button.id))
    });
}

// A function that create / update the plot for a given variable:
const render = (ind) => {
    const pie = d3.pie()
        .value(d => d[1])
        .sort((a, b) => d3.ascending(a[0], b[0]) ) // This make sure that group order remains the same in the pie chart
    
    const data_ready = pie(Object.entries(data[ind]))

    // map to data
    const path = svg.selectAll("path")
        .data(data_ready)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    path.enter()
        .append('path')
        .merge(path)
        .transition()
        .duration(1000)
        .attr('d', d3.arc()
                     .innerRadius(0)
                     .outerRadius(radius) )
        .attr('fill', d => colour(d.data[0]))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)

  // remove the group that is not present anymore
  path.exit().remove()
}

