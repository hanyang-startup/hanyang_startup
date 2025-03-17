"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminAuthCheck from "@/components/AdminAuthCheck";
import { addLecture } from "@/lib/lectureUtils";

export default function NewLecturePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		week: "",
		title: "",
		date: "",
		summary: "",
		content: "",
	});

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
			// 주차는 숫자로 변환
			const weekNumber = parseInt(formData.week, 10);
			if (isNaN(weekNumber)) {
				throw new Error("주차는 숫자여야 합니다.");
			}

			const lectureData = {
				week: weekNumber,
				title: formData.title,
				date: formData.date,
				summary: formData.summary || undefined, // 빈 문자열이면 undefined로 설정
				content: formData.content,
			};

			const result = await addLecture(lectureData);

			if (typeof result === "number") {
				router.push(`/admin/dashboard/lecture/${result}`);
			} else if (result && "error" in result) {
				// 오류 메시지가 있는 경우 팝업 표시
				alert(result.error);
				throw new Error(result.error);
			} else {
				throw new Error("강의 추가에 실패했습니다.");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "강의 추가 중 오류가 발생했습니다."
			);
			console.error("Error adding lecture:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AdminAuthCheck>
			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
				<header className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg">
					<div className="container mx-auto px-4 py-5 flex justify-between items-center">
						<h1 className="text-2xl font-bold text-white flex items-center">
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
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							새 강의 추가
						</h1>
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
				</header>

				<main className="container mx-auto px-4 py-8 max-w-3xl">
					<div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
						<h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
							강의 정보 입력
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
											placeholder="예: 1"
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

							{error && (
								<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
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

							<div className="flex justify-end space-x-4 pt-4">
								<Link
									href="/admin/dashboard"
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
								</Link>
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
											강의 저장
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</AdminAuthCheck>
	);
}
