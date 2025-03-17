"use client";

import { useState } from "react";
import { addClass } from "@/lib/lectureUtils";
import { LectureClass } from "@/lib/types";

interface AddClassFormProps {
	lectureId: number;
	onSuccess: () => void;
}

export default function AddClassForm({
	lectureId,
	onSuccess,
}: AddClassFormProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		period: "1",
		title: "",
		professor: "",
		content: "",
		severity: "normal",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const periodNumber = parseInt(formData.period, 10);
			if (isNaN(periodNumber)) {
				throw new Error("교시는 숫자여야 합니다.");
			}

			const classData = {
				period: periodNumber,
				title: formData.title,
				professor: formData.professor,
				content: formData.content,
				severity: formData.severity as LectureClass["severity"],
			};

			const classId = await addClass(lectureId, classData);

			if (classId) {
				onSuccess();
				// 폼 초기화
				setFormData({
					period: "1",
					title: "",
					professor: "",
					content: "",
					severity: "normal",
				});
			} else {
				throw new Error("수업 추가에 실패했습니다.");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "수업 추가 중 오류가 발생했습니다."
			);
			console.error("Error adding class:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
			<h3 className="text-lg font-bold text-gray-800 mb-4">새 수업 추가</h3>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label
							htmlFor="period"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							교시 <span className="text-red-500">*</span>
						</label>
						<select
							id="period"
							name="period"
							value={formData.period}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="1">1교시</option>
							<option value="2">2교시</option>
							<option value="3">3교시</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="professor"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							담당 교수 <span className="text-red-500">*</span>
						</label>
						<input
							id="professor"
							name="professor"
							type="text"
							value={formData.professor}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="담당 교수명"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="severity"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							중요도 <span className="text-red-500">*</span>
						</label>
						<select
							id="severity"
							name="severity"
							value={formData.severity}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="low">낮음</option>
							<option value="normal">보통</option>
							<option value="high">높음</option>
						</select>
					</div>
				</div>

				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						수업 제목 <span className="text-red-500">*</span>
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="수업 제목을 입력하세요"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="content"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						수업 내용 <span className="text-red-500">*</span>
					</label>
					<textarea
						id="content"
						name="content"
						value={formData.content}
						onChange={handleChange}
						rows={4}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="수업 내용을 입력하세요"
						required
					/>
				</div>

				{error && (
					<div className="text-red-500 text-sm font-medium">{error}</div>
				)}

				<div className="flex justify-end">
					<button
						type="submit"
						disabled={loading}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-70"
					>
						{loading ? "추가 중..." : "수업 추가"}
					</button>
				</div>
			</form>
		</div>
	);
}
