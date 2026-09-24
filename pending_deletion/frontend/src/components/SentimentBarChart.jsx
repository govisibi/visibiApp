import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card, CardHeader, CardTitle, CardContent } from './Card'

export const SentimentBarChart = ({ data, title = "Sentiment Breakdown" }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    const width = 500
    const height = 300
    const margin = { top: 20, right: 30, bottom: 40, left: 60 }

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2)

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.value), 1) * 1.2])
      .range([height - margin.bottom, margin.top])

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(['Positive', 'Neutral', 'Negative'])
      .range(['#4CAF50', '#9E9E9E', '#f44336'])

    // Create bars
    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - margin.bottom - yScale(d.value))
      .attr('fill', d => colorScale(d.name))
      .attr('rx', 4)

    // Add value labels on top of bars
    svg.selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text(d => d.value)

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('font-size', '12px')

    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('font-size', '12px')

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 3)
      .attr('x', -(height / 2))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text('Count')

  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef} className="w-full h-auto"></svg>
      </CardContent>
    </Card>
  )
}
