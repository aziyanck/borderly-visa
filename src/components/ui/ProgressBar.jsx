const ProgressBar = ({ current, total, className = '' }) => {
    const percentage = Math.round((current / total) * 100)

    return (
        <div className={className}>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">Progress</span>
                <span className="font-medium text-slate-700">{percentage}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

export default ProgressBar
