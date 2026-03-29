// scripts/chart7-loyal.js
const Chart7Loyal = (() => {
  function init(selector, data) {
    const customers = data.customers;

    // Count how many are loyal customers
    const loyalCount = customers.filter(d => d["Customer Type"] === "Loyal Customer").length;

    // Create a simple KPI card
    const container = d3.select(selector)
      .append("div")
      .attr("class", "kpi-card")
      .style("text-align", "center")
      .style("padding", "20px");

    // Add the loyal customer count
    container.append("h2")
      .style("color", "#0066FF") // Secondary Blue - Pattern Library
      .style("font-size", "32px")
      .text(loyalCount);

    // Add the label
    container.append("p")
      .style("color", "#2E384D") // Dark Gray - Pattern Library
      .style("font-size", "16px")
      .text("Loyal Customers");
  }

  return { init };
})();