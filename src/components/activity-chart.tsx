import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommitActivity } from "@/types/github"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { format, subDays } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActivityChartProps {
  data: CommitActivity[] | null
}

type ChartType = "bar" | "line" | "area"

export function ActivityChart({ data }: ActivityChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [showGrid, setShowGrid] = useState(true)
  const [showLegend, setShowLegend] = useState(true)

  // Return null if no data or data is not in expected format
  if (!data || !Array.isArray(data)) {
    return null
  }

  // Safely process the data
  const chartData = data
    .filter(week => week && typeof week.week === 'number' && Array.isArray(week.days))
    .flatMap((week) =>
      week.days.map((count, index) => ({
        date: format(
          subDays(new Date(week.week * 1000), 
          6 - index
        ), 'yyyy-MM-dd'),
        commits: count,
      }))
    )

  // Don't render if we have no valid data points
  if (chartData.length === 0) {
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              interval={Math.floor(chartData.length / 7)}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey="commits" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )
      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              interval={Math.floor(chartData.length / 7)}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            {showLegend && <Legend />}
            <Area 
              type="monotone" 
              dataKey="commits" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        )
      case "bar":
      default:
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              interval={Math.floor(chartData.length / 7)}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            {showLegend && <Legend />}
            <Bar 
              dataKey="commits" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Commit Activity</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="grid-toggle"
              checked={showGrid}
              onChange={() => setShowGrid(!showGrid)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="grid-toggle" className="text-sm font-medium leading-none">
              Show Grid
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="legend-toggle"
              checked={showLegend}
              onChange={() => setShowLegend(!showLegend)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="legend-toggle" className="text-sm font-medium leading-none">
              Show Legend
            </label>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}