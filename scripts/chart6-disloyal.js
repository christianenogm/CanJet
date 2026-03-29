// scripts/chart6-disloyal.js - Line chart with zoom functionality
const Chart6Disloyal = (() => {
    function init(selector, data) {
        const customers = data.customers;

        // Filter disloyal customers and group by age
        const disloyalCustomers = customers.filter(d => d["Customer Type"] === "disloyal Customer");
        
        const ageGroups = d3.rollup(
            disloyalCustomers,
            v => v.length,
            d => Math.floor(d.Age / 10) * 10
        );

        const lineData = Array.from(ageGroups, ([age, count]) => ({ age, count }))
            .sort((a, b) => a.age - b.age);

        // Set up dimensions
        const margin = { top: 40, right: 30, bottom: 50, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create container
        const container = d3.select(selector)
            .append("div")
            .attr("class", "chart-container");

        // Add title and controls
        container.append("h3")
            .attr("class", "chart-title")
            .text("Disloyal Customers by Age Group");

        const controls = container.append("div")
            .attr("class", "zoom-controls");

        // Create SVG
        const svgElement = container.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
        
        const svg = svgElement.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Base scales and copies used during zooming
        const xScaleBase = d3.scaleLinear()
            .domain(d3.extent(lineData, d => d.age))
            .range([0, width]);

        const yScaleBase = d3.scaleLinear()
            .domain([0, d3.max(lineData, d => d.count)])
            .range([height, 0])
            .nice();

        let xScaleCurrent = xScaleBase.copy();
        let yScaleCurrent = yScaleBase.copy();

        const createLine = (xScale, yScale) => d3.line()
            .x(d => xScale(d.age))
            .y(d => yScale(d.count))
            .curve(d3.curveMonotoneX);

        // Axes
        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScaleCurrent).ticks(5));

        const yAxis = svg.append("g")
            .call(d3.axisLeft(yScaleCurrent));

        // Axis labels
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .text("Age Group");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 15)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .text("Number of Customers");

        // Add line with transition
        const linePath = svg.append("path")
            .datum(lineData)
            .attr("class", "line")
            .attr("d", createLine(xScaleCurrent, yScaleCurrent)(lineData))
            .attr("fill", "none")
            .attr("stroke", "#D63649")
            .attr("stroke-width", 3);

        const pathLength = linePath.node().getTotalLength();
        linePath
            .style("stroke-dasharray", `${pathLength} ${pathLength}`)
            .style("stroke-dashoffset", pathLength)
            .transition()
            .duration(2000)
            .style("stroke-dashoffset", 0);

        // Add points
        const points = svg.selectAll(".point")
            .data(lineData)
            .enter()
            .append("circle")
            .attr("class", "point")
            .attr("cx", d => xScaleCurrent(d.age))
            .attr("cy", d => yScaleCurrent(d.count))
            .attr("r", 0)
            .attr("fill", "#D63649");

        points.transition()
            .duration(800)
            .delay((d, i) => i * 200)
            .attr("r", 6);

        // Add value labels
        points.append("title")
            .text(d => `Age: ${d.age}, Count: ${d.count}`);

        function updateChart() {
            xAxis.call(d3.axisBottom(xScaleCurrent));
            yAxis.call(d3.axisLeft(yScaleCurrent));

            linePath.attr("d", createLine(xScaleCurrent, yScaleCurrent)(lineData));

            points
                .attr("cx", d => xScaleCurrent(d.age))
                .attr("cy", d => yScaleCurrent(d.count));
        }

        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        svgElement.call(zoom);

        function zoomed(event) {
            xScaleCurrent = event.transform.rescaleX(xScaleBase);
            yScaleCurrent = event.transform.rescaleY(yScaleBase);
            updateChart();
        }

        function zoomIn() {
            svgElement.transition().duration(300).call(zoom.scaleBy, 2);
        }

        function zoomOut() {
            svgElement.transition().duration(300).call(zoom.scaleBy, 0.5);
        }

        function resetZoom() {
            xScaleCurrent = xScaleBase.copy();
            yScaleCurrent = yScaleBase.copy();
            svgElement.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
            updateChart();
        }

        // Add button event listeners after functions are defined
        controls.append("button")
            .attr("class", "zoom-btn")
            .text("Zoom In")
            .on("click", zoomIn);

        controls.append("button")
            .attr("class", "zoom-btn")
            .text("Zoom Out")
            .on("click", zoomOut);

        controls.append("button")
            .attr("class", "zoom-btn")
            .text("Reset Zoom")
            .on("click", resetZoom);
    }

    return { init };
})();