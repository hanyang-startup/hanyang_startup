import Link from "next/link";
import { getLectureByWeek } from "@/lib/lectureUtils";
import ClassCard from "@/components/ClassCard";
import LectureContentRenderer from "@/components/LectureContentRenderer";
import { notFound } from "next/navigation";

type PageProps<T = Record<string, unknown>> = {
	params: Promise<T>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LectureDetailPage({
	params,
}: PageProps<{
	weekId: string;
}>) {
	// params를 비동기적으로 처리
	const { weekId } = await params;
	const weekIdNum = parseInt(weekId);

	if (isNaN(weekIdNum)) {
		notFound();
	}

	const lecture = await getLectureByWeek(weekIdNum);

	if (!lecture) {
		notFound();
	}

	return (
		<main className="fade-in min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			<section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-14 shadow-md relative overflow-hidden">
				<div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
				<div className="container mx-auto px-4 max-w-5xl relative z-10">
					<div className="mb-6">
						<Link
							href="/"
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
							<span className="font-medium">강의 목록으로 돌아가기</span>
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
				</div>
			</section>

			<section className="py-12">
				<div className="container mx-auto px-4 max-w-5xl">
					<div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
						<h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200 text-gray-800 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mr-2 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							강의 내용
						</h2>
						<div className="prose prose-lg max-w-none">
							<LectureContentRenderer content={lecture.content} />
						</div>
					</div>

					<div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 mt-8">
						<h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200 text-gray-800 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mr-2 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
							교시별 수업
						</h2>
						{lecture.classes && lecture.classes.length > 0 ? (
							<div className="grid gap-6 md:grid-cols-2">
								{lecture.classes.map((classItem) => (
									<ClassCard
										key={classItem.id}
										weekId={lecture.week}
										classData={classItem}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-10 bg-gray-50 rounded-lg">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-16 w-16 mx-auto mb-4 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<p className="text-lg text-gray-600 font-medium">
									등록된 수업이 없습니다.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
