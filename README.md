# 청년일자리도약장려금 신청 이력 관리

엑셀로 관리하던 청년일자리도약장려금 신청 이력을 브라우저에서 관리하는 앱입니다.

## 실행

```powershell
npm run dev
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:4173
```

## 현재 기능

- 직원 신청 이력 추가, 수정, 삭제
- 회사, 부서, 팀, 성명 검색
- 신청 완료, 미완료, 이번 달 확인 필요 필터
- 입사일 기준 6개월, 9개월, 12개월, 24개월 도래 여부 계산
- 총 신청금액 자동 합산
- 엑셀에서 열 수 있는 CSV 내보내기
- Supabase 설정 전에는 브라우저 저장소에 자동 저장
- Supabase 설정 후에는 Supabase DB에 자동 저장

## Supabase 연결

1. Supabase 프로젝트를 만들고 SQL Editor에서 `supabase-schema.sql` 내용을 실행합니다.
2. Project Settings > API에서 Project URL과 anon/public key를 확인합니다.
3. `supabase-config.js`에 `url`과 `anonKey`를 입력합니다.
4. 앱을 다시 열면 기존 브라우저 저장 데이터가 비어 있는 Supabase 테이블로 자동 업로드됩니다.

주의: 현재 SQL은 빠른 내부 사용을 위해 anon 권한으로 읽기/쓰기/삭제를 허용합니다. 외부 공개 배포 전에는 Supabase Auth를 붙이고 RLS 정책을 사용자 기준으로 좁히는 것이 좋습니다.

## MCP 연결

`.mcp.json`의 `YOUR_PROJECT_REF`를 Supabase 프로젝트 ref로 바꿉니다.

Claude Code 기준:

```powershell
claude /mcp
```

`supabase` 서버를 선택하고 Authenticate를 진행하면 MCP에서 Supabase DB 도구를 사용할 수 있습니다.

## Vercel 배포 메모

현재 버전은 정적 웹앱이라 Vercel에 바로 올릴 수 있습니다.

Supabase 설정이 완료되면 여러 사람이 같은 DB를 기준으로 데이터를 볼 수 있습니다.
