"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminAuthCheck from "@/components/AdminAuthCheck";
import { getAllLectures } from "@/lib/lectureUtils";
import { Lecture } from "@/lib/types";

export default function AdminDashboardPage() {
	const [lectures, setLectures] = useState<Lecture[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

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

	const handleLogout = () => {
		sessionStorage.removeItem("adminAuthenticated");
		router.push("/admin");
	};

	return (
		<AdminAuthCheck>
			<div className="min-h-screen bg-gray-50">
				<header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
					<div className="container mx-auto px-4 py-4 flex justify-between items-center">
						<h1 className="text-2xl font-bold text-white">관리자 대시보드</h1>
						<div className="flex items-center space-x-4">
							<Link
								href="/admin/dashboard/lecture/new"
								className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition duration-200"
							>
								새 강의 추가
							</Link>
							<button
								onClick={handleLogout}
								className="text-white hover:text-blue-100 font-medium"
							>
								로그아웃
							</button>
						</div>
					</div>
				</header>

				<main className="container mx-auto px-4 py-8 max-w-5xl">
					<div className="bg-white rounded-xl shadow-md p-6 mb-8">
						<h2 className="text-xl font-bold text-gray-800 mb-4">강의 관리</h2>
						<p className="text-gray-600 mb-4">
							아래 목록에서 강의를 관리하거나 새 강의를 추가할 수 있습니다.
						</p>
					</div>

					{loading ? (
						<div className="flex justify-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
						</div>
					) : (
						<div className="grid gap-6">
							{lectures.length > 0 ? (
								lectures.map((lecture) => (
									<div
										key={lecture.id}
										className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
									>
										<div className="flex justify-between items-start">
											<div>
												<h3 className="text-lg font-bold text-gray-800">
													{lecture.week}주차: {lecture.title}
												</h3>
												<p className="text-gray-600 mt-1">{lecture.date}</p>
											</div>
											<div className="flex space-x-2">
												<Link
													href={`/admin/dashboard/lecture/${lecture.id}`}
													className="text-blue-600 hover:text-blue-800 font-medium"
												>
													관리
												</Link>
											</div>
										</div>
										<div className="mt-4">
											<p className="text-gray-700 line-clamp-2">
												{lecture.content}
											</p>
										</div>
										<div className="mt-4 flex items-center">
											<span className="text-sm text-gray-500">
												수업 {lecture.classes?.length || 0}개
											</span>
										</div>
									</div>
								))
							) : (
								<div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
									<p className="text-gray-600">등록된 강의가 없습니다.</p>
									<Link
										href="/admin/dashboard/lecture/new"
										className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
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
