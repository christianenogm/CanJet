// script/chart9-nodelay.js
const Chart9NoDelay = (() => {
  function init(selector, data) {
    const customers = data.customers;

    // Count how many have no delay
    const noDelayCount = customers.filter(d => d["Total Departure and Arrival Delay in Minutes"] === 0).length;

    // Create a simple KPI card
    const container = d3.select(selector)
      .append("div")
      .attr("class", "kpi-card")
      .style("text-align", "left")
      .style("padding", "20px")
      .style("font-size", "16px")
      .text("On-time flights");

    // Add the count
    container.append("h2")
      .style("color", "#00C389") // Success Teal - Pattern Library
      .style("font-size", "32px")
      .text(noDelayCount);

    // Add the label
    container.append("p")
      .style("color", "#2E384D") // Dark Gray - Pattern Library
      .style("font-size", "16px")
      .text("customers without delays");
  }

  return { init };
})();