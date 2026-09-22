export default function OptimizationTip({ totalStudents, estimatedTime }) {
    return (
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <p className="text-xs text-purple-700 font-semibold mb-1">Optimization Tip</p>
            <p className="text-sm text-purple-800">
                The system is currently utilizing high-speed processing clusters.<br />
                Generation of {totalStudents} cards typically takes {estimatedTime} seconds.
            </p>
        </div>
    );
}