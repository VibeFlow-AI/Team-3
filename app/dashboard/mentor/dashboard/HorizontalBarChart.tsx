import { SubjectInterest } from "./SessionOverview";

const HorizontalBarChart = ({ data }: { data: SubjectInterest[] }) => {
    const maxCount = Math.max(...data.map(item => item.count));
    const chartHeight = data.length * 35 + 70;
    const chartWidth = 350;
    const leftMargin = 140;
    const topMargin = 20;
    const barHeight = 16;
    const bottomMargin = 35;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="rounded-lg pb-6">
                <svg
                    width={chartWidth + leftMargin + 60}
                    height={chartHeight}
                    className="w-full h-auto"
                    viewBox={`0 0 ${chartWidth + leftMargin + 60} ${chartHeight}`}
                >
                    {/* Y-axis line */}
                    <line
                        x1={leftMargin}
                        y1={topMargin}
                        x2={leftMargin}
                        y2={chartHeight - bottomMargin}
                        stroke="#6B7280"
                        strokeWidth="1.5"
                    />

                    {/* X-axis line */}
                    <line
                        x1={leftMargin}
                        y1={chartHeight - bottomMargin}
                        x2={chartWidth + leftMargin}
                        y2={chartHeight - bottomMargin}
                        stroke="#6B7280"
                        strokeWidth="1.5"
                    />

                    {/* X-axis labels and grid lines */}
                    {[0, 5, 10, 15, 20, 25, 30].map((value, index) => (
                        <g key={index}>
                            {/* Grid lines */}
                            {value > 0 && (
                                <line
                                    x1={leftMargin + (value / maxCount) * chartWidth}
                                    y1={topMargin}
                                    x2={leftMargin + (value / maxCount) * chartWidth}
                                    y2={chartHeight - bottomMargin}
                                    stroke="#E5E7EB"
                                    strokeWidth="0.5"
                                    strokeDasharray="2,2"
                                />
                            )}
                            {/* Tick marks */}
                            <line
                                x1={leftMargin + (value / maxCount) * chartWidth}
                                y1={chartHeight - bottomMargin}
                                x2={leftMargin + (value / maxCount) * chartWidth}
                                y2={chartHeight - bottomMargin + 5}
                                stroke="#6B7280"
                                strokeWidth="1"
                            />
                            {/* Labels */}
                            <text
                                x={leftMargin + (value / maxCount) * chartWidth}
                                y={chartHeight - bottomMargin + 18}
                                textAnchor="middle"
                                className="text-xs fill-gray-600 font-medium"
                            >
                                {value}
                            </text>
                        </g>
                    ))}

                    {/* Bars and labels */}
                    {data.map((item, index) => {
                        const barWidth = (item.count / maxCount) * chartWidth;
                        const yPosition = topMargin + index * 35 + 10;

                        return (
                            <g key={index}>
                                {/* Subject label */}
                                <text
                                    x={leftMargin - 15}
                                    y={yPosition + barHeight / 2 + 5}
                                    textAnchor="end"
                                    className="text-sm fill-gray-800 font-medium"
                                >
                                    {item.subject}
                                </text>

                                {/* Bar */}
                                <rect
                                    x={leftMargin + 1}
                                    y={yPosition}
                                    width={Math.max(barWidth, 2)}
                                    height={barHeight}
                                    fill="#9CA3AF"
                                    rx="2"
                                    className="transition-all duration-300 hover:fill-gray-600"
                                />

                                {/* Value label at end of bar */}
                                <text
                                    x={leftMargin + Math.max(barWidth, 20) + 10}
                                    y={yPosition + barHeight / 2 + 5}
                                    className="text-xs fill-gray-700 font-semibold"
                                >
                                    {item.count}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default HorizontalBarChart;
