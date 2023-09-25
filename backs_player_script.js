// Load data from data2.csv (assuming it contains player data)
d3.csv("data.csv").then(function(data) {

     // Filter data for forwards
     const forwardsData = data.filter(d => d.Position === "Backs");

    // Remove duplicate players and calculate the average Power Ranking for each unique player
    const playerAverages = d3.group(data, d => d.Player);
    const uniqueData = Array.from(playerAverages.values()).map(playerData => {
        const averageRanking = d3.mean(playerData, d => +d["Player Ranking"]);
        const firstData = playerData[0]; // Take the first data entry for each unique player
        firstData.AverageRanking = parseFloat(averageRanking.toPrecision(2)); // Round to 3 significant figures
        return firstData;
    });

    // Sort the data by "AverageRanking" in descending order to determine the positions
    uniqueData.sort((a, b) => b.AverageRanking - a.AverageRanking);

    // Remove players with the same ranking value
    const top10UniqueData = uniqueData.slice(0, 25);

    // Add a "Position" field to the data
    uniqueData.forEach((d, i) => {
        d.Position = i + 1;
    });

    // Select the table body for the player table
    const tbody = d3.select("#player-table tbody"); // Use the id of the player table

    // Bind data to player table rows
    const rows = tbody.selectAll("tr")
        .data(top10UniqueData)
        .enter()
        .append("tr");

    // Add positions to the first column of the player table
    rows.append("td")
        .text(d => d.Position) // Use the "Position" field

    // Add player names (from "Player" column) to the second column of the player table
    rows.append("td")
        .text(d => d.Player) // Use the "Player" column
        .classed("player-name-cell", true); // Add a class for styling

    // Add average power rankings (from "AverageRanking" column) to the third column of the player table
    rows.append("td")
        .text(d => d.AverageRanking); // Use the "AverageRanking" column

    // Select all player name cells in the player table
    const playerNameCells = d3.selectAll("#player-table tbody tr .player-name-cell"); // Use the id of the player table

    // Add hover event listeners to show custom tooltips
    playerNameCells.on("mouseover", function (event, d) {
        showTooltip(d.tooltip_text);
    })
    .on("mouseout", function () {
        hideTooltip();
    });
});

// Define a function to show custom tooltips (you can keep this function as-is)
function showTooltip(text) {
    const tooltip = d3.select("body")
        .append("div")
        .classed("tooltip", true)
        .text(text);

    // Calculate the position based on the player name cell's position
    const playerNameCell = d3.select(this);
    const cellRect = playerNameCell.node().getBoundingClientRect();

    // Position the tooltip to the right of the player name cell with a slight offset
    tooltip.style("left", `${cellRect.right + 1}px`)
        .style("top", cellRect.top + "px");
}

// Define a function to hide the tooltip (you can keep this function as-is)
function hideTooltip() {
    d3.selectAll(".tooltip").remove();
}
