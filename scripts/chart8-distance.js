// script/chart8-distance.js
const Chart8Distance = (() => {
  function init(selector, data) {
    const customers = data.customers;

    // Sum the total flight distance
    const totalDistance = d3.sum(customers, d => d["Flight Distance"]);

    // Create a simple KPI card
    const container = d3.select(selector)
      .append("div")
      .attr("class", "kpi-card")
      .style("text-align", "left")
      .style("padding", "20px")
      .text("Total Flight Distance");

    // Add the total distance
    container.append("h2")
      .style("color", "#ED1C24") // Primary Red - Pattern Library
      .style("font-size", "32px")
      .text(totalDistance.toLocaleString());

    // Add the label
    container.append("p")
      .style("color", "#2E384D") // Dark Gray - Pattern Library
      .style("font-size", "16px")
      .text("km");
  }

  return { init };
})();