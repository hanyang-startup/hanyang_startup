import Link from "next/link";
import {
	getLectureByWeek,
	getClassByLectureAndPeriod,
} from "@/lib/lectureUtils";
import ClassDetail from "@/components/ClassDetail";
import { notFound } from "next/navigation";

type PageProps<T = Record<string, unknown>> = {
	params: Promise<T>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ClassDetailPage({
	params,
}: PageProps<{
	weekId: string;
	classId: string;
}>) {
	// params를 비동기적으로 처리
	const { weekId, classId } = await params;
	const weekIdNum = parseInt(weekId);
	const classIdNum = parseInt(classId);

	if (isNaN(weekIdNum) || isNaN(classIdNum)) {
		notFound();
	}

	const lecture = await getLectureByWeek(weekIdNum);

	if (!lecture) {
		notFound();
	}

	const classData = await getClassByLectureAndPeriod(lecture.id, classIdNum);

	if (!classData) {
		notFound();
	}

	return (
		<main className="fade-in min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			<section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-14 shadow-md relative overflow-hidden">
				<div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
				<div className="container mx-auto px-4 max-w-5xl relative z-10">
					<div className="mb-6">
						<Link
							href={`/lectures/${weekId}`}
							className="text-white hover:text-white/80 transition-colors duration-200 inline-flex items-center group"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="font-medium">
								{lecture.week}주차 강의로 돌아가기
							</span>
						</Link>
					</div>
					<h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">
						{lecture.week}주차: {lecture.title}
					</h1>
					<div className="flex items-center text-white/90 mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2 text-white/80"
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
					</div>
					<div className="mt-4 inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-lg shadow-md backdrop-blur-sm border border-white/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span className="font-medium">{classIdNum}교시</span>
					</div>
				</div>
			</section>

			<section className="py-12">
				<div className="container mx-auto px-4 max-w-5xl">
					<div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
						<ClassDetail classData={classData} />
					</div>
				</div>
			</section>
		</main>
	);
}
