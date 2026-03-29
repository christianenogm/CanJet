// scripts/chart1-distance.js - Bar chart for flight distance distribution
const Chart1Distance = (() => {
    function init(selector, data) {
        const customers = data.customers;

        // Create flight distance bins
        const distanceBins = d3.bin()
            .domain([0, 4000])
            .thresholds(10)
            .value(d => d["Flight Distance"]);

        const bins = distanceBins(customers);

        // Set up dimensions
        const margin = { top: 40, right: 30, bottom: 80, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(selector)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add title
        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .text("Flight Distance Distribution");

        // Scales
        const xScale = d3.scaleBand()
            .domain(bins.map(d => `${d.x0}-${d.x1}`))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0])
            .nice();

        // Axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-35)")
            .style("text-anchor", "end")
            .attr("dx", "-0.5em")
            .attr("dy", "0.5em");

        svg.append("g")
            .call(yAxis);

        // Axis labels
        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 15)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .text("Number of Customers");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .text("Flight Distance (km)");

        // Bars with transition
        svg.selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(`${d.x0}-${d.x1}`))
            .attr("width", xScale.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .attr("fill", "#0066FF")
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("y", d => yScale(d.length))
            .attr("height", d => height - yScale(d.length));

        // Add value labels
        svg.selectAll(".bar-label")
            .data(bins)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", d => xScale(`${d.x0}-${d.x1}`) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.length) - 5)
            .attr("text-anchor", "middle")
            .text(d => d.length)
            .style("opacity", 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100 + 400)
            .style("opacity", 1);
    }

    return { init };
})();