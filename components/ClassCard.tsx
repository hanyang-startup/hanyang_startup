import Link from "next/link";
import { LectureClass } from "@/lib/types";

interface ClassCardProps {
	weekId: number;
	classData: LectureClass;
}

export default function ClassCard({ weekId, classData }: ClassCardProps) {
	// 중요도에 따른 배지 스타일
	const severityBadges = {
		low: "bg-green-100 text-green-800 border-green-300",
		normal: "bg-blue-100 text-blue-800 border-blue-300",
		high: "bg-red-100 text-red-800 border-red-300",
	};

	// 중요도 텍스트
	const severityText = {
		low: "낮음",
		normal: "보통",
		high: "높음",
	};

	// 중요도에 따른 아이콘
	const severityIcons = {
		low: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-4 w-4 mr-1"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M5 13l4 4L19 7"
				/>
			</svg>
		),
		normal: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-4 w-4 mr-1"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
		high: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-4 w-4 mr-1"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
		),
	};

	return (
		<Link
			href={`/lectures/${weekId}/classes/${classData.id}`}
			className="block bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
		>
			<div className="p-6">
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-3">
							<span className="bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
								{classData.period}교시
							</span>
							<h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
								{classData.title}
							</h3>
						</div>
						<p className="text-gray-600 text-sm mb-4 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 mr-1 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							담당: {classData.professor}
						</p>
						<div className="flex items-center mt-4">
							<span
								className={`text-xs px-3 py-1.5 rounded-full border flex items-center ${
									severityBadges[classData.severity]
								}`}
							>
								{severityIcons[classData.severity]}
								중요도: {severityText[classData.severity]}
							</span>
						</div>
					</div>
					<div className="text-blue-600 bg-blue-50 p-2 rounded-full flex-shrink-0 ml-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		</Link>
	);
}
