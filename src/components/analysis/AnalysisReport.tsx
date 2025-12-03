import { CheckCircle, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";

interface AnalysisReportProps {
    report: {
        score: number;
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
    } | null;
}

export function AnalysisReport({ report }: AnalysisReportProps) {
    if (!report) {
        return (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-4">
                    <Lightbulb className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Ready to Coach</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Paste your code solution on the left to get a personalized analysis.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full space-y-6 overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Analysis Report</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500">Overall Score</span>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-lg font-bold text-indigo-700">
                        {report.score}/100
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Strengths */}
                <div>
                    <h4 className="mb-3 flex items-center font-semibold text-green-700">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Strengths
                    </h4>
                    <ul className="space-y-2">
                        {report.strengths.map((item, index) => (
                            <li key={index} className="flex items-start text-sm text-slate-600">
                                <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div>
                    <h4 className="mb-3 flex items-center font-semibold text-amber-600">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                        {report.weaknesses.map((item, index) => (
                            <li key={index} className="flex items-start text-sm text-slate-600">
                                <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recommendations */}
                <div className="rounded-lg bg-indigo-50 p-4">
                    <h4 className="mb-3 flex items-center font-semibold text-indigo-700">
                        <Lightbulb className="mr-2 h-5 w-5" />
                        Recommended Next Steps
                    </h4>
                    <ul className="space-y-3">
                        {report.recommendations.map((item, index) => (
                            <li key={index} className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
                                <span className="text-sm font-medium text-slate-700">{item}</span>
                                <ArrowRight className="h-4 w-4 text-indigo-400" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
