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

// 새 강의 추가하기
export async function addLecture(
	lecture: Omit<Lecture, "id" | "classes">
): Promise<number | null | { error: string }> {
	const { data, error } = await supabase
		.from("lectures")
		.insert([lecture])
		.select();

	if (error) {
		console.error("Error adding lecture:", error);
		// 중복 키 오류인 경우 구체적인 메시지 반환
		if (error.code === "23505") {
			return {
				error: `이미 ${lecture.week}주차 강의가 존재합니다. 다른 주차를 선택해주세요.`,
			};
		}
		return { error: error.message || "강의 추가에 실패했습니다." };
	}

	return data?.[0]?.id || null;
}

// 강의 수정하기
export async function updateLecture(
	id: number,
	lecture: Partial<Omit<Lecture, "id" | "classes">>
): Promise<boolean> {
	const { error } = await supabase
		.from("lectures")
		.update(lecture)
		.eq("id", id);

	if (error) {
		console.error(`Error updating lecture ${id}:`, error);
		return false;
	}

	return true;
}

// 강의 삭제하기
export async function deleteLecture(id: number): Promise<boolean> {
	// 먼저 관련된 모든 수업(classes)을 삭제
	const { error: classesError } = await supabase
		.from("classes")
		.delete()
		.eq("lecture_id", id);

	if (classesError) {
		console.error(`Error deleting classes for lecture ${id}:`, classesError);
		return false;
	}

	// 그 다음 강의 삭제
	const { error } = await supabase.from("lectures").delete().eq("id", id);

	if (error) {
		console.error(`Error deleting lecture ${id}:`, error);
		return false;
	}

	return true;
}

// 새 수업 추가하기
export async function addClass(
	lectureId: number,
	classData: Omit<LectureClass, "id">
): Promise<number | null> {
	const { data, error } = await supabase
		.from("classes")
		.insert([{ ...classData, lecture_id: lectureId }])
		.select();

	if (error) {
		console.error(`Error adding class to lecture ${lectureId}:`, error);
		return null;
	}

	return data?.[0]?.id || null;
}

// 수업 수정하기
export async function updateClass(
	id: number,
	classData: Partial<Omit<LectureClass, "id">>
): Promise<boolean> {
	const { error } = await supabase
		.from("classes")
		.update(classData)
		.eq("id", id);

	if (error) {
		console.error(`Error updating class ${id}:`, error);
		return false;
	}

	return true;
}

// 수업 삭제하기
export async function deleteClass(id: number): Promise<boolean> {
	const { error } = await supabase.from("classes").delete().eq("id", id);

	if (error) {
		console.error(`Error deleting class ${id}:`, error);
		return false;
	}

	return true;
}

// 관리자 비밀번호 확인
export async function verifyAdminPassword(password: string): Promise<boolean> {
	// 환경 변수에서 관리자 비밀번호를 가져옵니다
	const adminPassword = process.env.ADMIN_PASSWORD;

	// 환경 변수가 설정되지 않은 경우 기본값 사용
	if (!adminPassword) {
		console.warn(
			"ADMIN_PASSWORD 환경 변수가 설정되지 않았습니다. 기본 비밀번호를 사용합니다."
		);
		return password === "hanyang_startup_admin";
	}

	return password === adminPassword;
}
