import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card, CardHeader, CardTitle, CardContent } from './Card'

export const SentimentPieChart = ({ data, title = "Sentiment Distribution" }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    const width = 400
    const height = 300
    const radius = Math.min(width, height) / 2 - 40

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    // Create pie generator
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null)

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

    // Create label arc (for positioning labels)
    const labelArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6)

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(['Positive', 'Neutral', 'Negative'])
      .range(['#4CAF50', '#9E9E9E', '#f44336'])

    // Create pie slices
    const slices = svg.selectAll('.slice')
      .data(pie(data))
      .join('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.name))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)

    // Add labels with count
    svg.selectAll('.label')
      .data(pie(data))
      .join('text')
      .attr('class', 'label')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '16px')
      .text(d => d.data.value > 0 ? d.data.value : '')

    // Add legend
    const legend = svg.selectAll('.legend')
      .data(data)
      .join('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${radius + 20}, ${-radius + i * 25})`)

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => colorScale(d.name))
      .attr('rx', 3)

    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .text(d => `${d.name}: ${d.value}`)

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
