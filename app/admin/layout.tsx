import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "한양대학교 스타트업 - 관리자",
	description: "한양대학교 스타트업 강의 관리자 페이지",
};

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="min-h-screen bg-gray-50">{children}</div>;
}
