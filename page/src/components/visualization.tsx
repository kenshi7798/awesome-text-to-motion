"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ItemData } from './types';

interface VisualizationProps {
    data: ItemData[];
}

interface MonthlyData {
    year: number;
    month: number;
    published: number;
    unpublished: number;
    total: number;
}

interface ConferenceData {
    name: string;
    count: number;
    percentage: number;
}

const Visualization: React.FC<VisualizationProps> = ({ data }) => {
    const barChartRef = useRef<HTMLDivElement>(null);
    const pieChartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Process monthly data
        const monthlyData: MonthlyData[] = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        // Generate monthly data for the past 48 months
        for (let i = 47; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - 1 - i, 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            const monthPapers = data.filter(paper => 
                paper.year === year && paper.month === month
            );

            const published = monthPapers.filter(paper => 
                paper.submission && paper.submission.trim() !== ''
            ).length;

            const unpublished = monthPapers.length - published;

            monthlyData.push({
                year,
                month,
                published,
                unpublished,
                total: monthPapers.length
            });
        }

        // Process conference/journal data
        const conferenceMap = new Map<string, number>();
        data.forEach(paper => {
            if (paper.submission && paper.submission.trim() !== '') {
                const conference = paper.submission.trim();
                conferenceMap.set(conference, (conferenceMap.get(conference) || 0) + 1);
            }
        });

        // Process conference data and group small counts as "Other"
        const allConferences = Array.from(conferenceMap.entries())
            .map(([name, count]) => ({
                name,
                count,
                percentage: (count / Array.from(conferenceMap.values()).reduce((a, b) => a + b, 0)) * 100
            }))
            .sort((a, b) => b.count - a.count);

        // Group conferences with count < 5 as "Other"
        const topConferences = allConferences.filter(c => c.count >= 5);
        const smallConferences = allConferences.filter(c => c.count < 5);
        
        const conferenceData: ConferenceData[] = [...topConferences];
        
        if (smallConferences.length > 0) {
            const otherCount = smallConferences.reduce((sum, c) => sum + c.count, 0);
            const otherPercentage = smallConferences.reduce((sum, c) => sum + c.percentage, 0);
            conferenceData.push({
                name: "Other",
                count: otherCount,
                percentage: otherPercentage
            });
        }

        // Draw bar chart
        if (barChartRef.current) {
            drawBarChart(monthlyData, barChartRef.current);
        }

        // Draw pie chart
        if (pieChartRef.current) {
            drawPieChart(conferenceData, pieChartRef.current);
        }
    }, [data]);

    const drawBarChart = (data: MonthlyData[], container: HTMLDivElement) => {
        // Clear container
        d3.select(container).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 40, left: 60 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X-axis scale (months)
        const x = d3.scaleBand()
            .domain(data.map(d => `${d.year}-${d.month.toString().padStart(2, '0')}`))
            .range([0, width])
            .padding(0.1);

        // Y-axis scale (paper count)
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.total) || 0])
            .range([height, 0]);

        // Add bars
        const barGroups = svg.selectAll(".bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", (d: MonthlyData) => `translate(${x(`${d.year}-${d.month.toString().padStart(2, '0')}`)},0)`);

        // Published part (dark color) - at the bottom
        barGroups.append("rect")
            .attr("class", "bar-published")
            .attr("x", 0)
            .attr("y", (d: MonthlyData) => y(d.published))
            .attr("width", x.bandwidth())
            .attr("height", (d: MonthlyData) => height - y(d.published))
            .attr("fill", "#fc8d59")
            .attr("rx", 2);

        // Unpublished part (light color) - at the top
        barGroups.append("rect")
            .attr("class", "bar-unpublished")
            .attr("x", 0)
            .attr("y", (d: MonthlyData) => y(d.total))
            .attr("width", x.bandwidth())
            .attr("height", (d: MonthlyData) => y(d.published) - y(d.total))
            .attr("fill", "#fee08b")
            .attr("rx", 2);

        // Add tooltip
        const tooltip = d3.select(container)
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        barGroups
            .on("mouseover", function(event, d: MonthlyData) {
                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(`
                    <strong>${d.year}-${d.month.toString().padStart(2, '0')}</strong><br/>
                    Published: ${d.published}<br/>
                    Unpublished: ${d.unpublished}<br/>
                    Total: ${d.total}
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
                
                // Hover effect removed for stability
            })
            .on("mouseout", function() {
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                
                // Hover effect removed for stability
            });

        // Add X-axis (months) - only show quarterly labels
        const xAxis = d3.axisBottom(x)
            .tickFormat((d) => {
                const [year, month] = d.split('-');
                const monthNum = parseInt(month);
                // Only show labels for Q1 (Jan), Q2 (Apr), Q3 (Jul), Q4 (Oct)
                return monthNum % 3 === 1 ? `${year}-${month}` : '';
            });

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        // Add Y-axis (paper count)
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5));

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -5)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Monthly Paper Count Statistics (Past 48 Months)");

        // Add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#666")
            .text("Month");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#666")
            .text("Paper Count");
    };

    const drawPieChart = (data: ConferenceData[], container: HTMLDivElement) => {
        // Clear container
        d3.select(container).selectAll("*").remove();

        const width = container.clientWidth;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 40;

        const svg = d3.select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width * 0.35},${height / 2})`);

        // Create the color scale with spectral interpolation
        const color = d3.scaleOrdinal<string>()
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        // Pie chart generator
        const pie = d3.pie<ConferenceData>()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc<d3.PieArcDatum<ConferenceData>>()
            .innerRadius(radius * 0.4)
            .outerRadius(radius);

        // Draw sectors
        const g = svg.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i.toString()))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .on("mouseover", function(event, d) {
                // Show tooltip with conference name
                const tooltip = d3.select(container)
                    .append("div")
                    .attr("class", "pie-tooltip")
                    .style("position", "absolute")
                    .style("background", "rgba(0, 0, 0, 0.8)")
                    .style("color", "white")
                    .style("padding", "8px")
                    .style("border-radius", "4px")
                    .style("font-size", "12px")
                    .style("pointer-events", "none")
                    .style("z-index", "1000");
                
                tooltip.html(`
                    <strong>${d.data.name}</strong><br/>
                    Papers: ${d.data.count}<br/>
                    Percentage: ${d.data.percentage.toFixed(1)}%
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                // Hover effect removed for stability
                
                // Remove tooltip
                d3.select(container).selectAll(".pie-tooltip").remove();
            });

        // Add labels
        g.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text(d => d.data.count > 1 ? d.data.count.toString() : "");

        // Add legend - moved up and left to fit in narrower space
        const legend = svg.append("g")
            .attr("transform", `translate(${radius + 20}, -${radius * 0.95})`);

        const legendGroups = legend.selectAll(".legend-item")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d: ConferenceData, i: number) => `translate(0, ${i * 20})`);

        legendGroups.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", (d: ConferenceData, i: number) => color(i.toString()));

        legendGroups.append("text")
            .attr("x", 20)
            .attr("y", 9)
            .style("font-size", "10px")
            .text((d: ConferenceData) => `${d.name} (${d.count})`);

        // Add title
        svg.append("text")
            .attr("x", 50)
            .attr("y", -radius - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Conference/Journal Publication Statistics");
    };

    return (
        <div className="w-full mb-10">
            {/* Charts container with horizontal scroll for narrow screens */}
            <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
                {/* Fixed width wrapper to prevent layout jumping */}
                <div className="flex gap-0" style={{ minWidth: '1500px' }}>
                    {/* Bar chart */}
                    <div className="w-3/4 min-w-[600px] flex-shrink-0">
                        <div ref={barChartRef} className="w-full h-[300px]"></div>
                    </div>
                    
                    {/* Pie chart */}
                    <div className="w-1/4 min-w-[300px] flex-shrink-0">
                        <div ref={pieChartRef} className="w-full h-[300px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Visualization;
