// scripts/chart4-delay.js - Scatter plot with brush functionality
const Chart4Delay = (() => {
    let brush;
    let filteredData = null;

    function init(selector, data) {
        const customers = data.customers;
        filteredData = customers;

        // Set up dimensions
        const margin = { top: 40, right: 30, bottom: 50, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create container
        const container = d3.select(selector)
            .append("div")
            .attr("class", "chart-container");

        // Add title
        container.append("h3")
            .attr("class", "chart-title")
            .text("Departure vs Arrival Delay");

        // Add brush info
        const brushInfo = container.append("div")
            .style("margin-bottom", "10px")
            .style("font-size", "12px")
            .style("color", "#666");

        // Create SVG
        const svg = container.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(customers, d => d["Departure Delay in Minutes"])])
            .range([0, width])
            .nice();

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(customers, d => d["Arrival Delay in Minutes"])])
            .range([height, 0])
            .nice();

        const colorScale = d3.scaleOrdinal()
            .domain(["satisfied", "neutral or dissatisfied"])
            .range(["#00C389", "#D63649"]);

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Axis labels
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .text("Departure Delay (minutes)");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 15)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .text("Arrival Delay (minutes)");

        // Brush
        brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("brush", brushed)
            .on("end", brushEnded);

        svg.append("g")
            .attr("class", "brush")
            .call(brush);

        // Draw initial points
        updatePoints(svg, customers, xScale, yScale, colorScale);

        function brushed(event) {
            if (!event.selection) return;
            const [[x0, y0], [x1, y1]] = event.selection;
            
            filteredData = customers.filter(d => 
                xScale(d["Departure Delay in Minutes"]) >= x0 &&
                xScale(d["Departure Delay in Minutes"]) <= x1 &&
                yScale(d["Arrival Delay in Minutes"]) >= y1 &&
                yScale(d["Arrival Delay in Minutes"]) <= y0
            );

            brushInfo.text(`Selected: ${filteredData.length} customers`);
        }

        function brushEnded(event) {
            if (!event.selection) {
                filteredData = customers;
                brushInfo.text("");
            }
        }

        function updatePoints(svg, data, xScale, yScale, colorScale) {
            const points = svg.selectAll(".point")
                .data(data, d => d.id);

            points.enter()
                .append("circle")
                .attr("class", "point")
                .attr("cx", d => xScale(d["Departure Delay in Minutes"]))
                .attr("cy", d => yScale(d["Arrival Delay in Minutes"]))
                .attr("r", 4)
                .attr("fill", d => colorScale(d.satisfaction))
                .attr("opacity", 0.7)
                .transition()
                .duration(800)
                .attr("r", 6);
        }
    }

    return { init };
})();