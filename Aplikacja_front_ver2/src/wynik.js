document.addEventListener("DOMContentLoaded", function() {
    const statsContainer = document.getElementById('statsContainer');
    const params = new URLSearchParams(window.location.search);
    const stats = JSON.parse(params.get('stats'));

    // Funkcja aktualizująca wyświetlanie statystyk
    function updateStatsDisplay() {
        let statsText = '';
        for (let i = 0; i < stats.length; i++) {
            statsText += `Stat${i+1}: ${stats[i].toFixed(1)} | `;
        }
        //statsContainer.textContent = statsText.slice(0, -2); // usuń ostatni separator

        // Aktualizacja wartości pasków postępu
        updateProgressBars();

        drawChart();
    }

    // Funkcja aktualizująca wartości pasków postępu
    function updateProgressBars() {
        const resultDiv = document.querySelector('.result');
        for (let i = 0; i < stats.length; i++) {
            const stat = stats[i];
            let leftValue, rightValue;
        
            if (stat > 0) {
                leftValue = 50 + (stat * 10);
                rightValue = 50 - (stat * 10);
            } else if (stat < 0) {
                leftValue = 50 - (-stat * 10);
                rightValue = 50 + (-stat * 10);
            } else {
                leftValue = 50;
                rightValue = 50;
            }
        
            let leftIconSrc, rightIconSrc;
            if (i === 0) {
                leftIconSrc = 'images/icon1.png';
                rightIconSrc = 'images/icon2.png';
            } else if (i === 1) {
                leftIconSrc = 'images/icon3.png';
                rightIconSrc = 'images/icon4.png';
            } else if (i === 2) {
                leftIconSrc = 'images/icon5.png';
                rightIconSrc = 'images/icon6.png';
            } else if (i === 3) {
                leftIconSrc = 'images/icon7.png';
                rightIconSrc = 'images/icon8.png';
            } else if (i === 4) {
                leftIconSrc = 'images/icon9.png';
                rightIconSrc = 'images/icon10.png';
            }

            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.innerHTML = `
                <div class="icon leftIcon"><img src="${leftIconSrc}" alt=""></div>
                <div class="progress"></div>
                <div class="remaining"></div>
                <div class="icon rightIcon"><img src="${rightIconSrc}" alt=""></div>
                <div class="value">${leftValue.toFixed(0)} / ${rightValue.toFixed(0)}</div>
            `;
            resultDiv.appendChild(bar);
            const progress = bar.querySelector('.progress');
            const remaining = bar.querySelector('.remaining');
            progress.style.width = `${leftValue}%`;
            remaining.style.width = `${rightValue}%`;
        }
    }

    function drawChart() {
        const chartArea = document.querySelector('.chartArea');
    
        // Wymiary obszaru wykresu
        const width = 400;
        const height = 400;
    
        // Tworzenie elementu SVG
        const svg = d3.select(chartArea)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    
        // Ustawienie środków osi x i y
        const centerX = width / 2;
        const centerY = height / 2;
    
        // Rysowanie tła dla ćwiartek wykresu
        svg.append("rect")
            .attr("x", centerX)
            .attr("y", 0)
            .attr("width", centerX)
            .attr("height", centerY)
            .style("fill", "navy");
    
        svg.append("text")
            .attr("x", centerX + centerX / 2)
            .attr("y", centerY / 2)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("ideologie konserwatywne");
    
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", centerX)
            .attr("height", centerY)
            .style("fill", "red");
    
        svg.append("text")
            .attr("x", centerX / 2)
            .attr("y", centerY / 2)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("ideologie socjalistyczne");
    
        svg.append("rect")
            .attr("x", 0)
            .attr("y", centerY)
            .attr("width", centerX)
            .attr("height", centerY)
            .style("fill", "green");
    
        svg.append("text")
            .attr("x", centerX / 2)
            .attr("y", centerY + centerY / 2)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("ideologie socjalliberalne");
    
        svg.append("rect")
            .attr("x", centerX)
            .attr("y", centerY)
            .attr("width", centerX)
            .attr("height", centerY)
            .style("fill", "blue");
    
        svg.append("text")
            .attr("x", centerX + centerX / 2)
            .attr("y", centerY + centerY / 2)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("ideologie libertariańskie");
    
        // Rysowanie siatki dla osi x
        svg.selectAll(".xGrid")
            .data(d3.range(-5, 6, 1)) // Tworzenie zakresu od -5 do 5
            .enter()
            .append("line")
            .attr("class", "xGrid")
            .attr("x1", d => centerX + d * 40) // Odległość między liniami siatki
            .attr("y1", 0)
            .attr("x2", d => centerX + d * 40)
            .attr("y2", height)
            .attr("stroke", "lightgray")
            .attr("stroke-dasharray", "2"); // Ustawienie kreskowanej linii
    
        // Rysowanie siatki dla osi y
        svg.selectAll(".yGrid")
            .data(d3.range(-5, 6, 1)) // Tworzenie zakresu od -5 do 5
            .enter()
            .append("line")
            .attr("class", "yGrid")
            .attr("x1", 0)
            .attr("y1", d => centerY + d * 40) // Odległość między liniami siatki
            .attr("x2", width)
            .attr("y2", d => centerY + d * 40)
            .attr("stroke", "lightgray")
            .attr("stroke-dasharray", "2"); // Ustawienie kreskowanej linii
    
        // Rysowanie osi x
        svg.append("line")
            .attr("x1", 0)
            .attr("y1", centerY)
            .attr("x2", width)
            .attr("y2", centerY)
            .attr("stroke", "white");
    
        // Rysowanie osi y
        svg.append("line")
            .attr("x1", centerX)
            .attr("y1", 0)
            .attr("x2", centerX)
            .attr("y2", height)
            .attr("stroke", "white");
    
        // Dodanie podpisów osi X
        svg.append("text")
            .attr("x", width - 5)
            .attr("y", centerY + 10)
            .attr("text-anchor", "end")
            .style("fill", "white")
            .text("wolny rynek");
    
        svg.append("text")
            .attr("x", 5)
            .attr("y", centerY + 10)
            .attr("text-anchor", "start")
            .style("fill", "white")
            .text("etatyzm");
    
        // Dodanie podpisów osi Y
        svg.append("text")
            .attr("x", centerX - 5)
            .attr("y", 10)
            .attr("text-anchor", "end")
            .style("fill", "white")
            .text("konserwatyzm");
    
        svg.append("text")
            .attr("x", centerX - 5)
            .attr("y", height - 5)
            .attr("text-anchor", "end")
            .style("fill", "white")
            .text("liberalizm");
    
        // Rysowanie punktu na wykresie
        const x = centerX + stats[0] * 40; // Skalowanie wartości stats[0] do zakresu wykresu
        const y = centerY - stats[1] * 40; // Odwrócenie kierunku Y i skalowanie wartości stats[1] do zakresu wykresu
        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 5)
            .style("stroke", "yellow")
            .style("fill", "red");
    
        // Dodanie etykiety dla punktu
        svg.append("text")
            .attr("x", x + 5)
            .attr("y", y - 5)
            .style("fill", "white")
            .text("TY");
    }
    
    
    
    
    
    
    

    updateStatsDisplay();
});
