# 한양대학교 창업 강의

Next.js 15, App Router, Supabase를 이용한 한양대학교 창업 강의 웹사이트입니다.

## 기술 스택

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase

## 시작하기

### 환경 설정

1. `.env.local` 파일에 Supabase 정보를 입력합니다:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 데이터베이스 설정

1. Supabase 프로젝트를 생성합니다.
2. SQL 에디터에서 `scripts/schema.sql` 파일의 내용을 실행하여 테이블을 생성합니다.
3. 더미 데이터를 데이터베이스에 넣기 위해 다음 명령어를 실행합니다:

```bash
npm install
npm run seed
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인할 수 있습니다.

## Supabase 데이터베이스 구조

### lectures 테이블

```sql
CREATE TABLE lectures (
  id SERIAL PRIMARY KEY,
  week INTEGER NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL
);
```

### classes 테이블

```sql
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  lecture_id INTEGER REFERENCES lectures(id),
  period INTEGER NOT NULL,
  title TEXT NOT NULL,
  professor TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'normal', 'high'))
);
```

## 배포

Next.js 애플리케이션을 배포하는 가장 쉬운 방법은 [Vercel](https://vercel.com)을 이용하는 것입니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/deployment)를 참조하세요.
