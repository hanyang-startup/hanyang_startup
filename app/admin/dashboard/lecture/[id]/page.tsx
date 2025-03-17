"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import AdminAuthCheck from "@/components/AdminAuthCheck";
import {
	getLectureByWeek,
	updateLecture,
	deleteLecture,
} from "@/lib/lectureUtils";
import { Lecture } from "@/lib/types";
import ClassList from "@/app/admin/dashboard/lecture/[id]/components/ClassList";
import AddClassForm from "@/app/admin/dashboard/lecture/[id]/components/AddClassForm";

interface LecturePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function LecturePage({ params }: LecturePageProps) {
	// params 객체를 use 함수로 래핑하여 사용
	const resolvedParams = use(params);
	const lectureId = parseInt(resolvedParams.id, 10);
	const router = useRouter();
	const [lecture, setLecture] = useState<Lecture | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [showAddClass, setShowAddClass] = useState(false);
	const [formData, setFormData] = useState({
		week: "",
		title: "",
		date: "",
		summary: "",
		content: "",
	});

	useEffect(() => {
		const fetchLecture = async () => {
			try {
				// 강의 ID로 주차를 찾아서 강의 데이터를 가져옵니다
				const data = await getLectureByWeek(lectureId);
				if (data) {
					setLecture(data);
					setFormData({
						week: data.week.toString(),
						title: data.title,
						date: data.date,
						summary: data.summary || "",
						content: data.content,
					});
				} else {
					setError("강의를 찾을 수 없습니다.");
				}
			} catch (err) {
				console.error("Error fetching lecture:", err);
				setError("강의 데이터를 불러오는 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		if (lectureId && !isNaN(lectureId)) {
			fetchLecture();
		} else {
			setError("유효하지 않은 강의 ID입니다.");
			setLoading(false);
		}
	}, [lectureId]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const weekNumber = parseInt(formData.week, 10);
			if (isNaN(weekNumber)) {
				throw new Error("주차는 숫자여야 합니다.");
			}

			const lectureData = {
				week: weekNumber,
				title: formData.title,
				date: formData.date,
				summary: formData.summary || undefined,
				content: formData.content,
			};

			const success = await updateLecture(lectureId, lectureData);

			if (success) {
				// 강의 데이터 다시 불러오기
				const updatedLecture = await getLectureByWeek(lectureId);
				if (updatedLecture) {
					setLecture(updatedLecture);
					setIsEditing(false);
				}
			} else {
				throw new Error("강의 수정에 실패했습니다.");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "강의 수정 중 오류가 발생했습니다."
			);
			console.error("Error updating lecture:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (
			window.confirm(
				"정말로 이 강의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
			)
		) {
			setLoading(true);
			try {
				const success = await deleteLecture(lectureId);
				if (success) {
					router.push("/admin/dashboard");
				} else {
					throw new Error("강의 삭제에 실패했습니다.");
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "강의 삭제 중 오류가 발생했습니다."
				);
				console.error("Error deleting lecture:", err);
			} finally {
				setLoading(false);
			}
		}
	};

	if (loading && !lecture) {
		return (
			<AdminAuthCheck>
				<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-center">
					<div className="flex flex-col items-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
						<p className="mt-4 text-gray-600">강의 정보를 불러오는 중...</p>
					</div>
				</div>
			</AdminAuthCheck>
		);
	}

	return (
		<AdminAuthCheck>
			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
				<header className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg">
					<div className="container mx-auto px-4 py-5 flex justify-between items-center">
						<h1 className="text-2xl font-bold text-white flex items-center">
							{isEditing ? (
								<>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
									강의 수정
								</>
							) : (
								<>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 mr-2"
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
									{`${lecture?.week}주차: ${lecture?.title}`}
								</>
							)}
						</h1>
						<div className="flex items-center space-x-4">
							{!isEditing && (
								<>
									<button
										onClick={() => setIsEditing(true)}
										className="flex items-center text-white hover:text-blue-100 font-medium transition duration-200 ease-in-out"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
										강의 수정
									</button>
									<button
										onClick={handleDelete}
										className="flex items-center text-red-300 hover:text-red-100 font-medium transition duration-200 ease-in-out"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
										강의 삭제
									</button>
								</>
							)}
							<Link
								href="/admin/dashboard"
								className="flex items-center text-white hover:text-blue-100 font-medium transition duration-200 ease-in-out"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								대시보드로 돌아가기
							</Link>
						</div>
					</div>
				</header>

				<main className="container mx-auto px-4 py-8 max-w-5xl">
					{error && (
						<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-red-500"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-red-700">{error}</p>
								</div>
							</div>
						</div>
					)}

					{isEditing ? (
						<div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
							<h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
								강의 정보 수정
							</h2>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<label
											htmlFor="week"
											className="block text-sm font-medium text-gray-700"
										>
											주차 <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 text-gray-400"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
													/>
												</svg>
											</div>
											<input
												id="week"
												name="week"
												type="number"
												value={formData.week}
												onChange={handleChange}
												className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
												required
												min="1"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="date"
											className="block text-sm font-medium text-gray-700"
										>
											날짜 <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 text-gray-400"
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
											</div>
											<input
												id="date"
												name="date"
												type="date"
												value={formData.date}
												onChange={handleChange}
												className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
												required
											/>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="title"
										className="block text-sm font-medium text-gray-700"
									>
										강의 제목 <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-gray-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
												/>
											</svg>
										</div>
										<input
											id="title"
											name="title"
											type="text"
											value={formData.title}
											onChange={handleChange}
											className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
											placeholder="강의 제목을 입력하세요"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="summary"
										className="block text-sm font-medium text-gray-700"
									>
										요약 (선택사항)
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-gray-400"
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
										</div>
										<input
											id="summary"
											name="summary"
											type="text"
											value={formData.summary}
											onChange={handleChange}
											className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
											placeholder="강의 요약을 입력하세요 (선택사항)"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="content"
										className="block text-sm font-medium text-gray-700"
									>
										강의 내용 <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<textarea
											id="content"
											name="content"
											value={formData.content}
											onChange={handleChange}
											rows={8}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
											placeholder="강의 내용을 입력하세요"
											required
										/>
									</div>
								</div>

								<div className="flex justify-end space-x-4 pt-4">
									<button
										type="button"
										onClick={() => setIsEditing(false)}
										className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 flex items-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
										취소
									</button>
									<button
										type="submit"
										disabled={loading}
										className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-70 flex items-center"
									>
										{loading ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												저장 중...
											</>
										) : (
											<>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 mr-1"
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
												변경사항 저장
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					) : (
						<div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
							<div className="mb-6">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-semibold text-gray-800">
										강의 정보
									</h2>
									<div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
										{lecture?.date}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
									<div>
										<h3 className="text-sm font-medium text-gray-500 mb-1">
											주차
										</h3>
										<p className="text-lg font-medium text-gray-800">
											{lecture?.week}주차
										</p>
									</div>
									<div>
										<h3 className="text-sm font-medium text-gray-500 mb-1">
											제목
										</h3>
										<p className="text-lg font-medium text-gray-800">
											{lecture?.title}
										</p>
									</div>
								</div>

								{lecture?.summary && (
									<div className="mb-6">
										<h3 className="text-sm font-medium text-gray-500 mb-1">
											요약
										</h3>
										<p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
											{lecture.summary}
										</p>
									</div>
								)}

								<div>
									<h3 className="text-sm font-medium text-gray-500 mb-1">
										강의 내용
									</h3>
									<div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700">
										{lecture?.content}
									</div>
								</div>
							</div>
						</div>
					)}

					{!isEditing && (
						<>
							<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-gray-800">
										수업 목록
									</h2>
									<button
										onClick={() => setShowAddClass(!showAddClass)}
										className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200"
									>
										{showAddClass ? (
											<>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 mr-1"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
												취소
											</>
										) : (
											<>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 mr-1"
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
												새 수업 추가
											</>
										)}
									</button>
								</div>

								{showAddClass && (
									<div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
										<h3 className="text-lg font-medium text-blue-800 mb-4">
											새 수업 추가
										</h3>
										<AddClassForm
											lectureId={lectureId}
											onSuccess={() => {
												setShowAddClass(false);
												// 강의 데이터 다시 불러오기
												getLectureByWeek(lectureId).then((data) => {
													if (data) setLecture(data);
												});
											}}
										/>
									</div>
								)}

								<ClassList
									classes={lecture?.classes || []}
									lectureId={lectureId}
									onClassUpdated={() => {
										// 강의 데이터 다시 불러오기
										getLectureByWeek(lectureId).then((data) => {
											if (data) setLecture(data);
										});
									}}
								/>
							</div>
						</>
					)}
				</main>
			</div>
		</AdminAuthCheck>
	);
}
