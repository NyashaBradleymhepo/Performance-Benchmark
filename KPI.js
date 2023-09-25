// Load data from data.csv
d3.csv("pbp.csv").then(function(data) {
    // Create a set to store unique team names
    const uniqueTeams = new Set();

    // Filter the data to get unique team names
    const uniqueTeamData = data.filter((d) => {
        if (!uniqueTeams.has(d.Team)) {
            uniqueTeams.add(d.Team);
            return true;
        }
        return false;
    });

    // Calculate and add the average tries per game for each unique team
    uniqueTeamData.forEach((team) => {
        const games = data.filter((d) => d.Team === team.Team);
        const totalTries = d3.sum(games, (d) => +d.Try); // Calculate the total tries for the team
        const totalGames = games.length; // Calculate the total number of games for the team
        team.AverageTriesPerGame = (totalTries / totalGames).toFixed(1); // Calculate the average tries per game
    });

    // Select the table body for the KPI table
    const tbody = d3.select("#KPI-table tbody"); // Use the id of the KPI table

    // Bind data to table rows
    const rows = tbody.selectAll("tr")
        .data(uniqueTeamData)
        .enter()
        .append("tr");

    // Add team names (from "Team" column) to the first column
    rows.append("td")
        .text(d => d.Team);

    // Add average tries per game (from "AverageTriesPerGame" column) to the second column
    rows.append("td")
        .text(d => d.AverageTriesPerGame);

    // Select all team name cells in the table
    const teamNameCells = d3.selectAll("tbody tr td:first-child");

    // Add hover event listeners to show custom tooltips
    teamNameCells.on("mouseover", function (event, d) {
        showTooltip(`Average Tries Per Game: ${d.AverageTriesPerGame}`);
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
