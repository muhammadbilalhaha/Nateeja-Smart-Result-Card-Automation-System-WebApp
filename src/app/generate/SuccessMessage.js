import { CheckCircle } from "lucide-react";

export default function SuccessMessage({ totalStudents }) {
    return (
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-start gap-3 mb-4">
                <CheckCircle size={24} className="text-green-600 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-green-800 text-lg">All report cards generated successfully!</h3>
                    <p className="text-sm text-green-700 mt-1">
                        {totalStudents} report cards have been processed, validated, and are ready.
                    </p>
                </div>
            </div>
        </div>
    );
}