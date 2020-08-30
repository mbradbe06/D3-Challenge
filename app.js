// @TODO: YOUR CODE HERE!
const svgWidth = 1000;
const svgHeight = 700;

const margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(censusData => {
    console.log(censusData)

    //Format the Healthcare and Poverty rates to integer
    censusData.forEach( data => {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

    //Create scale functions
    const xScale = d3.scaleLinear()
                     .domain([8,d3.max(censusData, d => d.poverty)])
                    //  .domain(d3.extent(censusData, d => d.poverty))
                     .range([0,chartWidth]);
                
    const yScale = d3.scaleLinear()
                     .domain([4,d3.max(censusData, d=> d.healthcare)])
                    //  .domain(d3.extent(censusData, d => d.healthcare))
                     .range([chartHeight,0]);
    
    //Create Axis functions
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    //Append axes to chart
    chartGroup.append('g')
              .attr('transform',`translate(0,${chartHeight})`)
              .call(xAxis);
    
    chartGroup.append('g')
              .call(yAxis);
    
    //Create circles
    const circles = chartGroup.selectAll('circle')
                              .data(censusData)
                              .enter()
                              .append('circle')
                              .attr('cx', d => xScale(d.poverty))
                              .attr('cy', d => yScale(d.healthcare))
                              .attr('r', '15')
                              .attr('opacity','0.8')
                              .classed('stateCircle',true);
    
    //Create circle labels with State abbreviations
    const labels = chartGroup.selectAll(null)
                              .data(censusData)
                              .enter()
                              .append('text')
                              .attr('x', d => xScale(d.poverty))
                              .attr('y', d => yScale(d.healthcare-0.1))
                              .attr('font-size','10px')
                              .text(d => d.abbr)
                              .classed('stateText',true);
    
    //Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "2em")
    .attr("class", "aText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 15})`)
    .attr("class", "aText")
    .text("In Poverty (%)");

    //remove initial x and y ticks to tidy up axes origin
    d3.selectAll(".tick").filter(d => d === 4).remove();
    const removex = d3.select(".tick").select("text").remove();
    console.log(removex)
    

  }).catch(function (error) {
  console.log(error);
});