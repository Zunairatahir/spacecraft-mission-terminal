const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
/* ===== MISSION DATA ===== */
const mission = {
    status:   "READY",
    location: "PAD-39A",
    fuelPct:  100
};
const GREEN      = "#33FF66";
const GREEN_BRT  = "#0DFF9C";
const GREEN_DIM  = "#1A2E1A";
const AMBER      = "#FF9933";
const GLOW       = "rgba(51,255,102,0.55)";
let frame = 0;
let cursorOn = true;
let sweepY = 0;
function fuelColor(pct){
    if(pct > 50) return GREEN_BRT;
    if(pct > 20) return AMBER;
    return "#FF3333";
}
function drawPanelFrame(){
    ctx.strokeStyle = GREEN_DIM;
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, canvas.width-28, canvas.height-28);
    // corner ticks
    const ticks = [[14,14],[canvas.width-14,14],[14,canvas.height-14],[canvas.width-14,canvas.height-14]];
    ctx.strokeStyle = GREEN_BRT;
    ticks.forEach(([x,y])=>{
        ctx.beginPath();
        const dx = x < canvas.width/2 ? 10 : -10;
        const dy = y < canvas.height/2 ? 10 : -10;
        ctx.moveTo(x, y); ctx.lineTo(x+dx, y);
        ctx.moveTo(x, y); ctx.lineTo(x, y+dy);
        ctx.stroke();
    });
}
function drawHeader(){
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.fillStyle = GREEN_BRT;
    ctx.shadowColor = GLOW;
    ctx.shadowBlur = 8;
    ctx.fillText("MISSION TERMINAL", 38, 56);
    ctx.shadowBlur = 0;
    // blinking block cursor
    if(cursorOn){
        ctx.fillStyle = GREEN_BRT;
        ctx.fillRect(330, 40, 12, 18);
    }
    ctx.strokeStyle = GREEN_DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(38, 70);
    ctx.lineTo(canvas.width-38, 70);
    ctx.stroke();

    ctx.font = "13px 'Courier New', monospace";
    ctx.fillStyle = GREEN;
    ctx.fillText("CALLSIGN: ARGO-7   //   TELEMETRY LINK: ACTIVE", 38, 90);
}
function drawRow(label, value, y, color){
    ctx.font = "15px 'Courier New', monospace";
    ctx.fillStyle = GREEN;
    ctx.fillText(label, 38, y);
    ctx.font = "bold 17px 'Courier New', monospace";
    ctx.fillStyle = color || GREEN_BRT;
    ctx.shadowColor = GLOW;
    ctx.shadowBlur = 6;
    ctx.fillText(value, 230, y);
    ctx.shadowBlur = 0;
}
function drawFuelBar(pct, y){
    const barX = 38, barW = canvas.width - 76, barH = 26;
    const segments = 24;
    const segGap = 3;
    const segW = (barW - segGap*(segments-1)) / segments;
    const filledSegments = Math.round((pct/100) * segments);
    const color = fuelColor(pct);
    // outer frame
    ctx.strokeStyle = GREEN_DIM;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barX-4, y-4, barW+8, barH+8);
    for(let i=0; i<segments; i++){
        const sx = barX + i*(segW+segGap);
        if(i < filledSegments){
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 6;
            ctx.fillRect(sx, y, segW, barH);
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = GREEN_DIM;
            ctx.fillRect(sx, y, segW, barH);
        }
    }
}
function drawScanline(){
    ctx.fillStyle = "rgba(51,255,102,0.05)";
    ctx.fillRect(14, sweepY, canvas.width-28, 3);

    sweepY += 1.6;
    if(sweepY > canvas.height-14) sweepY = 14;
}
function drawFooter(){
    ctx.font = "12px 'Courier New', monospace";
    ctx.fillStyle = GREEN_DIM;
    ctx.fillText("ALL SYSTEMS NOMINAL", 38, canvas.height - 26);
    ctx.textAlign = "right";
    ctx.fillText("SOL " + (1 + Math.floor(frame/600)).toString().padStart(3,"0"), canvas.width - 38, canvas.height - 26);
    ctx.textAlign = "left";
}
function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // base CRT tint
    ctx.fillStyle = "#0A0E0A";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawPanelFrame();
    drawScanline();
    drawHeader();
    drawRow("STATUS:",   mission.status,   140);
    drawRow("LOCATION:", mission.location, 175);
    drawRow("FUEL:",     mission.fuelPct + "%", 210, fuelColor(mission.fuelPct));
    drawFuelBar(mission.fuelPct, 235);
    drawFooter();
    frame++;
    if(frame % 35 === 0) cursorOn = !cursorOn;
    requestAnimationFrame(render);
}
render();
