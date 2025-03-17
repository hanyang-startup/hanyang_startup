"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthCheck from "@/components/AdminAuthCheck";
import { getAllLectures } from "@/lib/lectureUtils";
import { Lecture } from "@/lib/types";

export default function AdminDashboardPage() {
	const [lectures, setLectures] = useState<Lecture[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLectures = async () => {
			try {
				const data = await getAllLectures();
				setLectures(data);
			} catch (error) {
				console.error("Error fetching lectures:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLectures();
	}, []);

	return (
		<AdminAuthCheck>
			<div className="min-h-screen">
				<header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
					<div className="container mx-auto px-6">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 space-y-4 md:space-y-0">
							<div className="flex items-center space-x-4">
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-color to-primary-dark dark:from-primary-light dark:to-primary-color flex items-center justify-center text-white text-xl font-bold shadow-lg">
									A
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-primary-color to-primary-dark dark:from-primary-light dark:to-primary-color bg-clip-text text-transparent">
										관리자 대시보드
									</h1>
									<p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
										강의 관리 및 콘텐츠 업데이트
									</p>
								</div>
							</div>

							<div className="flex items-center space-x-4">
								<Link
									href="/admin/dashboard/lecture/new"
									className="flex items-center bg-primary-color hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary-color text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg group"
								>
									<svg
										className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
									새 강의 추가
								</Link>
							</div>
						</div>
					</div>
				</header>

				<main className="container mx-auto px-6 py-12 max-w-6xl mt-24">
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 mb-16">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 rounded-xl bg-primary-color/10 dark:bg-primary-light/10 flex items-center justify-center">
								<svg
									className="w-6 h-6 text-primary-color dark:text-primary-light"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
							<div>
								<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
									강의 관리
								</h2>
								<p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
									아래 목록에서 강의를 관리하거나 새 강의를 추가할 수 있습니다.
								</p>
							</div>
						</div>
					</div>

					<h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-6 px-2">
						전체 강의 목록
					</h3>

					{loading ? (
						<div className="flex justify-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color dark:border-primary-light"></div>
						</div>
					) : (
						<div className="grid gap-8">
							{lectures.length > 0 ? (
								lectures.map((lecture) => (
									<div
										key={lecture.id}
										className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 transition-all duration-300 hover:bg-white hover:dark:bg-gray-800"
									>
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<div className="flex items-center space-x-3">
													<h3 className="text-xl font-bold text-gray-800 dark:text-white">
														{lecture.week}주차: {lecture.title}
													</h3>
													<span className="text-base text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-1 rounded-xl">
														수업 {lecture.classes?.length || 0}개
													</span>
												</div>
												<p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
													{lecture.date}
												</p>
											</div>
											<Link
												href={`/admin/dashboard/lecture/${lecture.id}`}
												className="flex items-center bg-primary-color/10 hover:bg-primary-color dark:bg-primary-light/10 dark:hover:bg-primary-light text-primary-color hover:text-white dark:text-primary-light dark:hover:text-white font-medium px-5 py-2 rounded-xl transition-all duration-300 group"
											>
												<span>관리</span>
												<svg
													className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 5l7 7-7 7"
													/>
												</svg>
											</Link>
										</div>
										<div className="mt-6">
											<p className="text-gray-700 dark:text-gray-300 line-clamp-2 text-lg">
												{lecture.content}
											</p>
										</div>
									</div>
								))
							) : (
								<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-12 text-center">
									<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-color/10 dark:bg-primary-light/10 flex items-center justify-center">
										<svg
											className="w-10 h-10 text-primary-color dark:text-primary-light"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6v6m0 0v6m0-6h6m-6 0H6"
											/>
										</svg>
									</div>
									<p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
										등록된 강의가 없습니다.
									</p>
									<Link
										href="/admin/dashboard/lecture/new"
										className="inline-block bg-primary-color hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary-color text-white text-lg font-medium px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
									>
										첫 강의 추가하기
									</Link>
								</div>
							)}
						</div>
					)}
				</main>
			</div>
		</AdminAuthCheck>
	);
}
