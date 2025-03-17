"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAuthCheck({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// 클라이언트 사이드에서만 실행
		const checkAuth = () => {
			const auth = sessionStorage.getItem("adminAuthenticated");
			if (auth !== "true") {
				router.push("/admin");
			} else {
				setIsAuthenticated(true);
			}
			setIsLoading(false);
		};

		checkAuth();
	}, [router]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return isAuthenticated ? <>{children}</> : null;
}
