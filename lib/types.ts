// 강의 세부 수업 데이터 타입 정의
export interface LectureClass {
	id: number;
	period: number; // 교시 (1, 2, 3)
	title: string;
	professor: string; // 담당 교수
	content: string;
	severity: "low" | "normal" | "high"; // 중요도를 나타내는 속성 추가
}

// 강의 주차별 데이터 타입 정의
export interface Lecture {
	id: number;
	week: number;
	title: string;
	date: string;
	summary?: string; // 강의 요약 (선택적 속성)
	content: string;
	classes: LectureClass[];
}

// 강의 목록 타입
export type LectureList = Lecture[];
