// scripts/chart3-category.js - Stacked bar chart by customer type and travel type
const Chart3Category = (() => {
    function init(selector, data) {
        const customers = data.customers;

        // Group data by Customer Type and Type of Travel
        const grouped = d3.rollup(
            customers,
            v => v.length,
            d => d["Customer Type"],
            d => d["Type of Travel"]
        );

        // Convert to array format for stacked bar chart
        const categories = Array.from(new Set(customers.map(d => d["Type of Travel"])));
        const customerTypes = Array.from(new Set(customers.map(d => d["Customer Type"])));

        const stackData = categories.map(category => {
            const obj = { category };
            customerTypes.forEach(type => {
                obj[type] = grouped.get(type)?.get(category) || 0;
            });
            return obj;
        });

        // Set up dimensions
        const margin = { top: 40, right: 30, bottom: 50, left: 60 };
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
            .text("Customers by Type and Travel");

        // Scales
        const xScale = d3.scaleBand()
            .domain(categories)
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(stackData, d => 
                customerTypes.reduce((sum, type) => sum + (d[type] || 0), 0)
            )])
            .range([height, 0])
            .nice();

        const colorScale = d3.scaleOrdinal()
            .domain(customerTypes)
            .range(["#0066FF", "#00C389"]);

        // Stack generator
        const stack = d3.stack().keys(customerTypes);
        const stackedData = stack(stackData);

        // Create groups for each stack layer
        const layer = svg.selectAll(".layer")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "layer")
            .attr("fill", d => colorScale(d.key));

        // Add bars with transition
        layer.selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.data.category))
            .attr("width", xScale.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("y", d => yScale(d[1]))
            .attr("height", d => yScale(d[0]) - yScale(d[1]));

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Legend
        const legend = svg.selectAll(".legend")
            .data(customerTypes)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width - 100}, ${i * 20})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", d => colorScale(d));

        legend.append("text")
            .attr("x", 25)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(d => d);
    }

    return { init };
})();