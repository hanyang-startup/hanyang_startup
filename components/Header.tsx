"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
			<header
				className={`w-[60%] rounded-2xl transition-all duration-300 ${
					isScrolled
						? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
						: "bg-white dark:bg-gray-900 shadow-[0_4px_20px_rgb(0,0,0,0.08)]"
				}`}
			>
				<nav className="container mx-auto px-6 py-6">
					<div className="flex justify-between items-center">
						<Link
							href="/"
							className="text-3xl font-bold text-gray-800 dark:text-white hover:text-primary-color dark:hover:text-primary-light transition-colors"
						>
							한양대학교 스타트업
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-12">
							<Link
								href="/lectures"
								className="text-xl font-medium text-gray-600 hover:text-primary-color dark:text-gray-300 dark:hover:text-primary-light transition-colors py-2"
							>
								강의
							</Link>
							<Link
								href="/about"
								className="text-xl font-medium text-gray-600 hover:text-primary-color dark:text-gray-300 dark:hover:text-primary-light transition-colors py-2"
							>
								소개
							</Link>
							<Link
								href="/contact"
								className="text-xl font-medium text-gray-600 hover:text-primary-color dark:text-gray-300 dark:hover:text-primary-light transition-colors py-2"
							>
								문의하기
							</Link>
							<Link
								href="/admin"
								className="text-xl font-medium text-white bg-primary-color hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary-color transition-colors py-2 px-6 rounded-xl"
							>
								관리자
							</Link>
						</div>

						{/* Mobile Menu Button */}
						<button
							className="md:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2"
							onClick={toggleMenu}
							aria-label="메뉴 열기"
						>
							<svg
								className="w-7 h-7"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isMenuOpen ? (
									<path d="M6 18L18 6M6 6l12 12" />
								) : (
									<path d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>

					{/* Mobile Navigation */}
					{isMenuOpen && (
						<div className="md:hidden mt-4 space-y-6 pb-4">
							<Link
								href="/lectures"
								className="block text-xl font-medium text-gray-600 hover:text-primary-color dark:text-gray-300 dark:hover:text-primary-light transition-colors py-3"
								onClick={() => setIsMenuOpen(false)}
							>
								강의
							</Link>
							<Link
								href="/about"
								className="block text-xl font-medium text-gray-600 hover:text-primary-color dark:text-gray-300 dark:hover:text-primary-light transition-colors py-3"
								onClick={() => setIsMenuOpen(false)}
							>
								소개
							</Link>
							<Link
								href="/contact"
								className="block text-xl font-medium text-gray-600 hover:text-primary-color dark:text-gray-300 dark:hover:text-primary-light transition-colors py-3"
								onClick={() => setIsMenuOpen(false)}
							>
								문의하기
							</Link>
							<Link
								href="/admin"
								className="block text-xl font-medium text-white bg-primary-color hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary-color transition-colors py-3 px-6 rounded-xl"
								onClick={() => setIsMenuOpen(false)}
							>
								관리자
							</Link>
						</div>
					)}
				</nav>
			</header>
		</div>
	);
};

export default Header;
