// test chart logic
function test() {
    const today = new Date("2026-06-12"); // Friday
    let dayOfWeek = today.getDay(); 
    let adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    console.log("Adjusted Day:", adjustedDay);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = [];
    for(let i=1; i<=adjustedDay; i++) {
        data.push({day: days[i-1], visits: 100 * i});
    }

    const chartWidth = 200;
    const chartHeight = 80;
    const maxVisits = 500;

    // Current code:
    const points = data.map((d, index) => {
        // Here, index goes 0 to 4. data.length - 1 = 4.
        // So index / 4 * 200 => 0, 50, 100, 150, 200
        const x = data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth;
        const y = chartHeight - (d.visits / (maxVisits * 1.2)) * chartHeight;
        return `${x},${y}`;
    }).join(" ");
    console.log("Current Points:", points);

    // If we want it to be a 7-day fixed grid:
    const fixedPoints = data.map((d, index) => {
        const x = (index / 6) * chartWidth;
        const y = chartHeight - (d.visits / (maxVisits * 1.2)) * chartHeight;
        return `${x},${y}`;
    }).join(" ");
    console.log("Fixed Points:", fixedPoints);
}
test();
