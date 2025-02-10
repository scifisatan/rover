import type React from "react"
import {
  ResponsiveContainer,
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface ScatterPlotProps {
  data: any[]
  xDataKey: string
  yDataKey: string
  name: string
  fill: string
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, xDataKey, yDataKey, name, fill }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey={xDataKey} stroke="rgba(255,255,255,0.5)" />
        <YAxis dataKey={yDataKey} stroke="rgba(255,255,255,0.5)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            color: "white",
          }}
        />
        <Legend />
        <Scatter name={name} data={data} fill={fill} />
      </RechartsScatterChart>
    </ResponsiveContainer>
  )
}

