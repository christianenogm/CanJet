const Chart2Proportion = (() => {
  function init(selector, data) {
    const customers = data.customers;

    // count satisfied vs dissatisfied
    const counts = d3.rollup(
      customers,
      v => v.length,
      d => d.satisfaction
    );

    // convert to array of objects for D3 donut chart
    const entries = Array.from(counts, ([key, value]) => ({ key, value }));

    // dimensions for responsive SVG
    const width = 400, height = 400, radius = Math.min(width, height) / 2;

    // chart container
    const container = d3.select(selector)
      .append("div")
      .attr("class", "chart-container")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("align-items", "center")
      .style("gap", "10px");

    // Horizontal legend
    const legend = container.append("div")
      .style("display", "flex")
      .style("gap", "30px")
      .style("justify-content", "center")
      .style("margin-bottom", "10px");

    // Legend items
    entries.forEach(d => {
      const item = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "6px");

      item.append("div")
        .style("width", "18px")
        .style("height", "18px")
        .style("background-color", d.key === "satisfied" ? "#00C389" : "#D63649");

      item.append("span")
        .style("color", "#2E384D")
        .style("font-size", "14px")
        .text(d.key);
    });

    // SVG for donut chart
    const svg = container.append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("max-width", "400px")
      .style("height", "auto");

    // Group for chart
    const chartGroup = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(entries.map(d => d.key))
      .range(["#00C389", "#D63649"]);

    // Pie and arc generators -> Donut chart generators
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(80).outerRadius(radius);

    // Draw slices
    const slices = chartGroup.selectAll("g.slice")
      .data(pie(entries))
      .join("g")
      .attr("class", "tooltip-demo");
    
    // Draw paths
    slices.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.key))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px");

    // Tooltips for slices
    slices.append("title") // fallback native tooltip
      .text(d => `${d.data.key}: ${d.data.value}`);

    // Custom tooltip using foreignObject
    slices.append("foreignObject")
      .attr("x", -50)
      .attr("y", -50)
      .attr("width", 100)
      .attr("height", 50)
      .append("xhtml:div")
      .attr("class", "tooltip")
      .text(d => `${d.data.key}: ${d.data.value}`);
  }

  // Expose init function
  return { init };
})();