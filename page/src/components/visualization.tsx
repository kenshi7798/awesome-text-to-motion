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

        // Generate monthly data for the past 3 years
        for (let year = currentYear - 2; year <= currentYear; year++) {
            for (let month = 1; month <= 12; month++) {
                // Skip future months
                if (year === currentYear && month > currentMonth) continue;

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
        }

        // Process conference/journal data
        const conferenceMap = new Map<string, number>();
        data.forEach(paper => {
            if (paper.submission && paper.submission.trim() !== '') {
                const conference = paper.submission.trim();
                conferenceMap.set(conference, (conferenceMap.get(conference) || 0) + 1);
            }
        });

        const conferenceData: ConferenceData[] = Array.from(conferenceMap.entries())
            .map(([name, count]) => ({
                name,
                count,
                percentage: (count / Array.from(conferenceMap.values()).reduce((a, b) => a + b, 0)) * 100
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Only show top 10

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

        // X-axis scale
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.total) || 0])
            .range([0, width]);

        // Y-axis scale
        const y = d3.scaleBand()
            .domain(data.map(d => `${d.year}-${d.month.toString().padStart(2, '0')}`))
            .range([0, height])
            .padding(0.1);

        // Add bars
        const barGroups = svg.selectAll(".bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", (d: MonthlyData) => `translate(0,${y(`${d.year}-${d.month.toString().padStart(2, '0')}`)})`);

        // Unpublished part (light color)
        barGroups.append("rect")
            .attr("class", "bar-unpublished")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", (d: MonthlyData) => x(d.unpublished))
            .attr("height", y.bandwidth())
            .attr("fill", "#e5e7eb")
            .attr("rx", 2);

        // Published part (dark color)
        barGroups.append("rect")
            .attr("class", "bar-published")
            .attr("x", (d: MonthlyData) => x(d.unpublished))
            .attr("y", 0)
            .attr("width", (d: MonthlyData) => x(d.published))
            .attr("height", y.bandwidth())
            .attr("fill", "#3b82f6")
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
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5));

        // Add Y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -5)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Monthly Paper Count Statistics");
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
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10);

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
            .style("stroke-width", "2px");

        // Add labels
        g.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text(d => d.data.count > 1 ? d.data.count.toString() : "");

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${radius + 20}, -${radius / 2})`);

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
            .attr("x", 0)
            .attr("y", -radius - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Conference/Journal Publication Statistics");
    };

    return (
        <div className="w-full mb-16">
            <div className="flex gap-6">
                {/* Left bar chart */}
                <div className="w-2/3">
                    <div ref={barChartRef} className="w-full h-[300px]"></div>
                </div>
                
                {/* Right pie chart */}
                <div className="w-1/3">
                    <div ref={pieChartRef} className="w-full h-[300px]"></div>
                </div>
            </div>
        </div>
    );
};

export default Visualization;
