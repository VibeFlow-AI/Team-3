import { AgeGroup } from "./SessionOverview";

const PieChartComponent = ({ data }: { data: AgeGroup[] }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let cumulativePercentage = 0;

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Pie Chart - Bigger */}
            <div className="grid grid-cols-3">
                <div className="col-span-2">
                    <div className="flex justify-center">
                        <div className="relative">
                            <svg width="280" height="280" className="transform -rotate-90">
                                {/* Background circle */}
                                <circle
                                    cx="140"
                                    cy="140"
                                    r="100"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="32"
                                />
                                {/* Data segments */}
                                {data.map((item, index) => {
                                    const percentage = (item.count / total) * 100;
                                    const strokeDasharray = `${(percentage / 100) * 628.3} 628.3`;
                                    const strokeDashoffset = -((cumulativePercentage / 100) * 628.3);
                                    cumulativePercentage += percentage;

                                    return (
                                        <circle
                                            key={index}
                                            cx="140"
                                            cy="140"
                                            r="100"
                                            fill="none"
                                            stroke={item.color}
                                            strokeWidth="32"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={strokeDashoffset}
                                            className="transition-all duration-300"
                                        />
                                    );
                                })}
                            </svg>
                            {/* Center text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-900">{total}</div>
                                    <div className="text-base text-gray-500 font-medium">Students</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend - Positioned to right bottom */}
                <div className="absolute bottom-0 right-0 space-y-3 backdrop-blur-sm rounded-lg p-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 min-w-[100px]">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm font-medium text-gray-700">{item.ageRange}</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 ml-auto">{item.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PieChartComponent;
