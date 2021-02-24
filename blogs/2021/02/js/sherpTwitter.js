async function drawScatter() {

    // 1. Access data
  
    const fulldataset = await d3.csv("./../../data/SHERP_tweeter_data_clean.csv", d3.autoType);
    const dataset = fulldataset.filter(d => d.followers_count < 40000);
    const femaledata = dataset.filter(d => d.gender == 'f');
    const maledata = dataset.filter(d => d.gender == 'm');
  
    // set data constants
    const nameAccessor = d => d.display_name;
    const handleAccessor = d => d.name;
    const yAccessor = d => d.followers_count;
    const xAccessor = d => d.following_count;
    const colorAccessor = d => d.gender;
  
    // 2. Create chart dimensions
  
    const width = d3.min([
      window.innerWidth * 0.9,
      window.innerHeight * 0.9,
    ])
    let dimensions = {
      width: width,
      height: width,
      margin: {
        top: 5,
        right: 20,
        bottom: 60,
        left: 60,
      },
      histogramMargin: 10,
      histogramHeight: 40,
    }
    dimensions.boundedWidth = dimensions.width
      - dimensions.margin.left
      - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom
  
    // 3. Draw canvas
  
    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);
  
    const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)
  
    const boundsBackground = bounds.append("rect")
        .attr("class", "bounds-background")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", 0)
        .attr("height", dimensions.boundedHeight)
  
    // 4. Create scales
  
    const twitterExtent = d3.extent([
      ...dataset.map(xAccessor),
      ...dataset.map(yAccessor),
    ])

    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()
  
    const yScale = d3.scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0])
      .nice()
  
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // 5. Draw data
  
    const dotsGroup = bounds.append("g")
    const dots = dotsGroup.selectAll(".dot")
      .data(dataset)
      .join("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 3)
        .style("fill", d => {
          if (d.gender == 'm') {
            return 'steelblue'
          } else if (d.gender == 'f') {
            return 'coral'
          } else {
            return false;
          }
        })

    // 6. Draw peripherals
  
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)
      .ticks(4)
  
    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
  
    const xAxisLabel = xAxis.append("text")
        .attr("class", "x-axis-label")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 30)
        .html("No. Following")
  
    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
      .ticks(4)
  
    const yAxis = bounds.append("g")
        .call(yAxisGenerator)
  
    const yAxisLabel = yAxis.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -dimensions.boundedHeight / 2)
        .attr("y", -dimensions.margin.left + 12)
        .html("No. of Followers")
  
    // 7. Set up interactions
  
    let voronoi = d3.Delaunay.from(
        dataset,
        d => xScale(xAccessor(d)),
        d => yScale(yAccessor(d))
      ).voronoi([
        0,
        0,
        dimensions.boundedWidth,
        dimensions.boundedHeight
      ]);
  
    const mesh = bounds
        .selectAll(".voronoi")
        .data(dataset)
        .join("path")
        .attr("fill", "transparent")
        .attr("stroke", "transparent")
        .attr("class", "voronoi")
        .attr("d", (d, i) => voronoi.renderCell(i));
  
    mesh.on("mouseenter", onVoronoiMouseEnter)
      .on("mouseleave", onVoronoiMouseLeave)
  
    const tooltip = d3.select("#tooltip")
    const hoverElementsGroup = bounds.append("g")
        .attr("opacity", 0)
  
    const dayDot = hoverElementsGroup.append("circle")
        .attr("class", "tooltip-dot")
        .raise()
  
    function onVoronoiMouseEnter(event, d) {
        d3.select(this).attr('r', 10);
  
        hoverElementsGroup.style("opacity", 1)
        const x = xScale(xAccessor(d))
        const y = yScale(yAccessor(d))
        dayDot.attr("cx", d => x)
            .attr("cy", d => y)
            .attr("r", 7)
    
        tooltip.select("#name")
            .text(nameAccessor(d))
    
        tooltip.select("#followers")
            .text(yAccessor(d) + " followers");

        tooltip.select("#following")
              .text(xAccessor(d) + " following");

        tooltip.select("#handle")
              .text("@" + handleAccessor(d));
    
        // const tooltipX = d3.pointer(event);
        // const tooltipY = d3.pointer(event) - 4;
      const tooltipX = xScale(xAccessor(d))
        + dimensions.margin.left 
      const tooltipY = yScale(yAccessor(d))
        + dimensions.margin.top
        + 70;
  
      tooltip.style("transform", `translate(`
        + `calc( -50% + ${tooltipX}px),`
        + `calc(-100% + ${tooltipY}px)`
        + `)`)
  
      tooltip.style("opacity", 1)
    }
  
    function onVoronoiMouseLeave(event, d) {
      hoverElementsGroup.style("opacity", 0)
      tooltip.style("opacity", 0)
    }
  }
  drawScatter()