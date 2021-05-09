// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60}
const width = 460 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// unfortunate global variables. Should never leave this file
// DON'T IMPORT THIS FILE AS A SCRIPT TAG ANYWHERE 
// WILL CAUSE NAMESPACE CLASH
let svg;
let data;

const x = d3.scaleBand()
        .range([ 0, width ])
        .padding(1);
const y = d3.scaleLinear()
        .range([height, 0])
// slightly annoying global variables
// if someone smarter than me could think of a solution would be nice
let xAxis;
let yAxis;

export const init = (selector, in_data) => {
    svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    yAxis = svg.append("g")
        .attr("class", "myYaxis")

    data = in_data

    setup_events("lol-button") 
    render("Total_Increment") // could be more generic. Relies on specific heading names
}

const setup_events = (class_name) => {
    const buttons = document.getElementsByClassName(class_name)
    // grabs all elements with the class name
    // adds an onclick event to render correctly
    // bases onclick parameter on button id
    Array.from(buttons).forEach(button => {
        console.log(button)
        button.addEventListener("click", () => render(button.id))
    });
}

// A function that create / update the plot for a given variable:
const render = (selectedVar) => {
    // Update axes
    x.domain(data.map(d => d.Species))
    y.domain([0, d3.max(data, d =>  d[selectedVar] ) ])
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    yAxis.transition().duration(1000).call(d3.axisLeft(y))

    const lines = svg.selectAll(".line")
         .data(data)
        

    lines.enter()
        .append("line")
        .attr("class", "line")
        .merge(lines)
        .transition()
        .duration(1000)
           .attr("x1", d => x(d.Species) )
           .attr("x2", d =>  x(d.Species) )
           .attr("y1", y(0))
           .attr("y2", d => y(d[selectedVar]))
           .attr("stroke", "grey")
   
    // variable ball: map data to circle
    const ball = svg.selectAll("circle")
         .data(data) 
    
    ball.enter()
        .append("circle")
        .merge(ball)
        .transition()
        .duration(1000)
           .attr("cx", d =>  x(d.Species) )
           .attr("cy", d =>  y(d[selectedVar]) )
           .attr("r", 8)
           .attr("fill", "#69b3a2");
}

