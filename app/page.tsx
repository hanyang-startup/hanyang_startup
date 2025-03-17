import LectureList from "@/components/LectureList";
import { getAllLectures } from "@/lib/lectureUtils";

export default async function HomePage() {
	const lectures = await getAllLectures();

	return (
		<main className="fade-in min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			<section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-14 shadow-md relative overflow-hidden">
				<div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
				<div className="container mx-auto px-4 max-w-5xl relative z-10">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-md">
							한양대학교 창업 강의
						</h1>
						<p className="text-white/90 text-lg max-w-2xl mx-auto">
							창업 강의 자료 모음
						</p>
					</div>
				</div>
			</section>

			<section className="py-12 -mt-6">
				<div className="container mx-auto px-4 max-w-5xl">
					<div className="bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b-2 border-gray-100">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7 mr-3 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
								강의 목록
							</h2>
							<span className="text-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-5 rounded-full font-medium shadow-md">
								{lectures.length}개의 강의
							</span>
						</div>
						<LectureList lectures={lectures} />
					</div>
				</div>
			</section>
		</main>
	);
}
