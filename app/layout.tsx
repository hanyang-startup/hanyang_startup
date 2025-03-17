import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "한양대학교 창업 강의",
	description: "한양대학교 창업 강의 자료 모음",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body
				className={`${inter.className} bg-bg-light min-h-screen flex flex-col`}
			>
				<Header />
				<div className="flex-grow pt-24">{children}</div>
				<footer className="bg-gray-800 text-white py-10 mt-auto">
					<div className="container mx-auto px-4">
						<div className="flex flex-col md:flex-row justify-between items-center">
							<div className="mb-6 md:mb-0">
								<h2 className="text-2xl font-bold mb-3">
									한양대학교 창업 강의
								</h2>
								<p className="text-gray-400 max-w-md">
									창업 강의 자료 모음 - 한양대학교 창업 교육 과정에서 제공하는
									강의 자료와 수업 내용을 확인할 수 있습니다.
								</p>
							</div>
							<div className="text-center md:text-right">
								<p className="text-lg font-semibold mb-2">
									&copy; {new Date().getFullYear()} 한양대학교 창업 강의
								</p>
								<p className="text-gray-400 text-sm">모든 권리 보유</p>
								<div className="mt-4 flex justify-center md:justify-end space-x-4">
									<a
										href="#"
										className="text-white hover:text-primary-light transition-colors"
									>
										<span className="sr-only">이용약관</span>
										이용약관
									</a>
									<a
										href="#"
										className="text-white hover:text-primary-light transition-colors"
									>
										<span className="sr-only">개인정보처리방침</span>
										개인정보처리방침
									</a>
								</div>
							</div>
						</div>
					</div>
				</footer>
			</body>
		</html>
	);
}
