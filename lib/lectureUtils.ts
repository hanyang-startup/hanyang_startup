import { supabase } from "./supabase";
import { Lecture, LectureClass, LectureList } from "./types";

// 모든 강의 데이터 가져오기
export async function getAllLectures(): Promise<LectureList> {
	const { data, error } = await supabase
		.from("lectures")
		.select("*")
		.order("week", { ascending: true });

	if (error) {
		console.error("Error fetching lectures:", error);
		return [];
	}

	return data || [];
}

// 특정 주차의 강의 데이터 가져오기
export async function getLectureByWeek(
	weekId: number
): Promise<Lecture | null> {
	const { data, error } = await supabase
		.from("lectures")
		.select("*, classes(*)")
		.eq("week", weekId)
		.single();

	if (error) {
		console.error(`Error fetching lecture for week ${weekId}:`, error);
		return null;
	}

	return data;
}

// 특정 강의의 특정 교시 데이터 가져오기
export async function getClassByLectureAndPeriod(
	lectureId: number,
	classId: number
): Promise<LectureClass | null> {
	const { data, error } = await supabase
		.from("classes")
		.select("*")
		.eq("id", classId)
		.eq("lecture_id", lectureId)
		.single();

	if (error) {
		console.error(
			`Error fetching class ${classId} for lecture ${lectureId}:`,
			error
		);
		return null;
	}

	return data;
}
