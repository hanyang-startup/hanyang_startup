import Link from "next/link";
import { Lecture } from "@/lib/types";

interface LectureItemProps {
	lecture: Lecture;
}

export default function LectureItem({ lecture }: LectureItemProps) {
	return (
		<Link
			href={`/lectures/${lecture.week}`}
			className="block bg-white rounded-xl border-l-4 border-blue-600 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
		>
			<div className="p-6">
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-3">
							<span className="bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
								{lecture.week}주차
							</span>
							<h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
								{lecture.title}
							</h3>
						</div>
						<p className="text-gray-600 text-sm mt-2 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 mr-2 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span className="font-medium">{lecture.date}</span>
						</p>
						{lecture.summary && (
							<p className="text-sm text-gray-500 mt-4 line-clamp-2 bg-gray-50 p-3 rounded-lg border-l-2 border-blue-200">
								{lecture.summary}
							</p>
						)}

						{lecture.classes && lecture.classes.length > 0 && (
							<div className="mt-4 flex items-center text-sm text-blue-600">
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
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								<span>{lecture.classes.length}개의 수업</span>
							</div>
						)}
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
