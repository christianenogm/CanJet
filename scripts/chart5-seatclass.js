// scripts/chart5-seatclass.js - Pie chart with interactive legend
const Chart5SeatClass = (() => {
    function init(selector, data) {
        const customers = data.customers;

        // Count by seat class
        const classCounts = d3.rollup(
            customers,
            v => v.length,
            d => d.Class
        );

        const classData = Array.from(classCounts, ([key, value]) => ({ 
            class: key, 
            value 
        }));

        // Set up dimensions
        const width = 400, height = 400, radius = Math.min(width, height) / 2;

        // Create container
        const container = d3.select(selector)
            .append("div")
            .attr("class", "chart-container")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("align-items", "center");

        // Add title
        container.append("h3")
            .attr("class", "chart-title")
            .text("Passengers by Seat Class");

        // Color scale
        const colorScale = d3.scaleOrdinal()
            .domain(classData.map(d => d.class))
            .range(["#0066FF", "#00C389", "#FF6B00"]);

        // Create SVG
        const svg = container.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("max-width", "400px");

        const chartGroup = svg.append("g")
            .attr("transform", `translate(${width/2}, ${height/2})`);

        // Pie generator
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Create slices with transition
        const slices = chartGroup.selectAll(".slice")
            .data(pie(classData))
            .enter()
            .append("g")
            .attr("class", "slice");

        const paths = slices.append("path")
            .attr("d", arc)
            .attr("fill", d => colorScale(d.data.class))
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .style("opacity", 0.8)
            .transition()
            .duration(1000)
            .delay((d, i) => i * 200)
            .style("opacity", 1);

        // Add labels
        const labels = slices.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#fff")
            .style("font-weight", "bold")
            .text(d => d.data.value)
            .style("opacity", 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 200 + 400)
            .style("opacity", 1);

        // Interactive legend
        const legend = container.append("div")
            .attr("class", "legend")
            .style("display", "flex")
            .style("gap", "20px")
            .style("margin-top", "20px");

        const legendItems = legend.selectAll(".legend-item")
            .data(classData)
            .enter()
            .append("div")
            .attr("class", "legend-item")
            .style("display", "flex")
            .style("align-items", "center")
            .style("gap", "8px")
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                const slice = slices.filter(slice => slice.data.class === d.class);
                paths.style("opacity", 0.3);
                slice.select("path").style("opacity", 1);
            })
            .on("mouseout", function() {
                paths.style("opacity", 0.8);
            });

        legendItems.append("div")
            .style("width", "15px")
            .style("height", "15px")
            .style("background-color", d => colorScale(d.class))
            .style("border-radius", "50%");

        legendItems.append("span")
            .style("font-size", "14px")
            .text(d => `${d.class}: ${d.value}`);
    }

    return { init };
})();