"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminPassword } from "@/lib/lectureUtils";

export default function AdminLoginPage() {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const isValid = await verifyAdminPassword(password);

			if (isValid) {
				// 세션 스토리지에 인증 상태 저장 (실제 환경에서는 더 안전한 방법 사용 권장)
				sessionStorage.setItem("adminAuthenticated", "true");
				router.push("/admin/dashboard");
			} else {
				setError("비밀번호가 올바르지 않습니다.");
			}
		} catch (err) {
			setError("인증 과정에서 오류가 발생했습니다.");
			console.error("Authentication error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-light/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
						관리자 로그인
					</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								비밀번호
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="관리자 비밀번호를 입력하세요"
								required
							/>
						</div>

						{error && (
							<div className="text-red-500 text-sm font-medium">{error}</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-70"
						>
							{loading ? "로그인 중..." : "로그인"}
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
