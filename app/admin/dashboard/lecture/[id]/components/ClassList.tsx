"use client";

import { useState } from "react";
import { LectureClass } from "@/lib/types";
import { updateClass, deleteClass } from "@/lib/lectureUtils";

interface ClassListProps {
	classes: LectureClass[];
	lectureId: number;
	onClassUpdated: () => void;
}

export default function ClassList({ classes, onClassUpdated }: ClassListProps) {
	const [editingClassId, setEditingClassId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		period: "",
		title: "",
		professor: "",
		content: "",
		severity: "",
	});

	const handleEdit = (classItem: LectureClass) => {
		setEditingClassId(classItem.id);
		setFormData({
			period: classItem.period.toString(),
			title: classItem.title,
			professor: classItem.professor,
			content: classItem.content,
			severity: classItem.severity,
		});
		setError("");
	};

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
		if (!editingClassId) return;

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

			const success = await updateClass(editingClassId, classData);

			if (success) {
				setEditingClassId(null);
				onClassUpdated();
			} else {
				throw new Error("수업 수정에 실패했습니다.");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "수업 수정 중 오류가 발생했습니다."
			);
			console.error("Error updating class:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (classId: number) => {
		if (
			window.confirm(
				"정말로 이 수업을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
			)
		) {
			setLoading(true);
			try {
				const success = await deleteClass(classId);
				if (success) {
					onClassUpdated();
				} else {
					throw new Error("수업 삭제에 실패했습니다.");
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "수업 삭제 중 오류가 발생했습니다."
				);
				console.error("Error deleting class:", err);
			} finally {
				setLoading(false);
			}
		}
	};

	const getSeverityColor = (severity: LectureClass["severity"]) => {
		switch (severity) {
			case "low":
				return "bg-green-100 text-green-800";
			case "normal":
				return "bg-blue-100 text-blue-800";
			case "high":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getSeverityText = (severity: LectureClass["severity"]) => {
		switch (severity) {
			case "low":
				return "낮음";
			case "normal":
				return "보통";
			case "high":
				return "높음";
			default:
				return "알 수 없음";
		}
	};

	// 교시 순으로 정렬
	const sortedClasses = [...classes].sort((a, b) => a.period - b.period);

	return (
		<div className="space-y-6">
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
					{error}
				</div>
			)}

			{sortedClasses.map((classItem) => (
				<div
					key={classItem.id}
					className="border border-gray-200 rounded-lg overflow-hidden"
				>
					{editingClassId === classItem.id ? (
						<div className="p-6 bg-gray-50">
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
										required
									/>
								</div>

								<div className="flex justify-end space-x-4">
									<button
										type="button"
										onClick={() => setEditingClassId(null)}
										className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
									>
										취소
									</button>
									<button
										type="submit"
										disabled={loading}
										className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-70"
									>
										{loading ? "저장 중..." : "변경사항 저장"}
									</button>
								</div>
							</form>
						</div>
					) : (
						<div className="p-6">
							<div className="flex justify-between items-start">
								<div>
									<div className="flex items-center mb-2">
										<span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2">
											{classItem.period}교시
										</span>
										<span
											className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${getSeverityColor(
												classItem.severity
											)}`}
										>
											{getSeverityText(classItem.severity)}
										</span>
									</div>
									<h3 className="text-lg font-bold text-gray-800 mb-1">
										{classItem.title}
									</h3>
									<p className="text-gray-600 mb-4">
										담당: {classItem.professor}
									</p>
								</div>
								<div className="flex space-x-2">
									<button
										onClick={() => handleEdit(classItem)}
										className="text-blue-600 hover:text-blue-800 font-medium"
									>
										수정
									</button>
									<button
										onClick={() => handleDelete(classItem.id)}
										className="text-red-600 hover:text-red-800 font-medium"
									>
										삭제
									</button>
								</div>
							</div>
							<div className="mt-4 prose max-w-none">
								<p className="whitespace-pre-line text-gray-700">
									{classItem.content}
								</p>
							</div>
						</div>
					)}
				</div>
			))}

			{sortedClasses.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					등록된 수업이 없습니다.
				</div>
			)}
		</div>
	);
}
