// Load data from data.csv
d3.csv("data.csv").then(function(data) {
    // Remove duplicate teams and calculate the average Power Ranking for each unique team
    const teamAverages = d3.group(data, d => d.Team);
    const uniqueData = Array.from(teamAverages.values()).map(teamData => {
        const averageRanking = d3.mean(teamData, d => +d["Power Ranking"]);
        const firstData = teamData[0]; // Take the first data entry for each unique team
        firstData.AverageRanking = parseFloat(averageRanking.toPrecision(2)); // Round to 3 significant figures
        return firstData;
    });

    // Sort the data by "AverageRanking" in descending order to determine the positions
    uniqueData.sort((a, b) => b.AverageRanking - a.AverageRanking);

    // Add a "Position" field to the data
    uniqueData.forEach((d, i) => {
        d.Position = i + 1;
    });

    // Select the table body
    const tbody = d3.select("tbody");

    // Bind data to table rows
    const rows = tbody.selectAll("tr")
        .data(uniqueData)
        .enter()
        .append("tr");

    // Add positions to the first column
    rows.append("td")
        .text(d => d.Position) // Use the "Position" field

    // Add team names (from "Team" column) to the second column
    rows.append("td")
        .text(d => d.Team) // Use the "Team" column
        .classed("team-name-cell", true); // Add a class for styling

    // Add average power rankings (from "AverageRanking" column) to the third column
    rows.append("td")
        .text(d => d.AverageRanking); // Use the "AverageRanking" column

    // Select all team name cells in the table
    const teamNameCells = d3.selectAll("tbody tr .team-name-cell");

    // Add hover event listeners to show custom tooltips
    teamNameCells.on("mouseover", function (event, d) {
        showTooltip(d.tooltip_text);
    })
    .on("mouseout", function () {
        hideTooltip();
    });
});

// Define a function to show custom tooltips
function showTooltip(text) {
    const tooltip = d3.select("body")
        .append("div")
        .classed("tooltip", true)
        .text(text);

    // Calculate the position based on the team name cell's position
    const teamNameCell = d3.select(this);
    const cellRect = teamNameCell.node().getBoundingClientRect();

    // Position the tooltip to the right of the team name cell with a slight offset
    tooltip.style("left", `${cellRect.right + 1}px`)
        .style("top", cellRect.top + "px");
}

// Define a function to hide the tooltip
function hideTooltip() {
    d3.selectAll(".tooltip").remove();
}
