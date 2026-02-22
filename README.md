### 🌸 여러분, 저희 됐어요…🌸

## ❗❗골라Zoom 서비스가 시작됐어요!! ❗❗

## 👔 골라Zoom

> 바쁜 아침의 코디를 최적화하는 서비스, 골라Zoom 입니다.
> 

골라Zoom은 흩어져 있는 옷들을 디지털 데이터로 전환해 관리합니다. 사용자는 자신만의 개성이 담긴 '프리셋 코디'를 저장할 수 있고, 캘린더 기능을 통해 언제 어떤 옷을 입었는지 한눈에 파악할 수 있습니다.

코디를 미리 저장하지 못했더라도 허둥지둥 준비할 필요 없습니다. 출근 30분 전, 당일의 날씨와 착용 이력에 기반하여 최적의 코디를 추천해드립니다. 프리셋 코디를 우선 반영하여 만족도 높은 스타일링을 제안합니다. 순간이 소중한 아침 출근 시간을 골라Zoom을 통해 효율적으로 사용해보세요!

## ✨ 주요 기능

### 🔐 사용자 관리

- 회원가입/로그인 시스템
- 프로필 관리 (닉네임, 아이디, 비밀번호 등)
- 출근 시간 등록

### 👕 옷장 관리

- 의상 등록 (사진 혹은 퀵등록 가능) 및 열람
- 세탁 기능 (on / off 가능)
- 프리셋 코디 등록 및 열람

### 🗓️ 캘린더

- 날짜 별로 입을 코디를 미리 등록
- 날짜 별 착용한 코디 이력 보관

### 🪄 의상 추천 기능

- 그날의 날씨에 어울리는 의상을 추천
- 저장된 프리셋 코디가 있다면 우선적으로 추천

## 🛠 기술 스택

- **Framework/Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **API Client**: Axios
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Additional**: PWA (Progressive Web App), MSW (Mock Service Worker)

## 📍 컨벤션

- **feat**: 새로운 기능 추가
- **fix**: 버그 및  오류 수정
- **design**: CSS 같은 사용자 UI 디자인 변경
- **refactor**: 기능 변경 없이 코드 리펙토링
- **style**: 코드 형태 및 세미콜론 누락 등 수

## 📁 프로젝트 구조

### Frontend

```
├── public               # PWA 아이콘, 파비콘 등 정적 파일
├── src
│   ├── api              # Axios 및 API 호출 함수
│   ├── assets           # 이미지, 아이콘 등의 에셋
│   ├── components       # 재사용 가능한 UI 컴포넌트
│   │   ├── common       # 공통 컴포넌트
│   │   ├── home         # 홈 화면 전용 컴포넌트
│   │   └── modal        # 특정 기능 모달
│   ├── data             # 정적 데이터 및 상수
│   ├── hooks            # 알람 관련 커스텀 훅
│   ├── layouts          # 페이지 공통 레이아웃
│   ├── mocks            # MSW를 활용한 API 모킹 데이터 및 핸들러
│   ├── pages            # 라우팅되는 각 페이지 컴포넌트
│   │   ├── calendar     # 캘린더 관련 페이지
│   │   ├── closet       # 옷장 관련 페이지
│   │   ├── setuser      # 로그인, 회원가입, 출근시간 설정
│   │   ├── userinfo     # 마이페이지 및 정보 수정
│   │   └── Home.tsx     # 메인 홈 화면
│   ├── App.tsx          # 최상위 라우팅 및 전역 상태/모달 관리
│   └── main.tsx         # React 앱 엔트리 포인트
├── .env                 # 환경 변수 설정 (API 주소)
├── index.html           # 메인 HTML 파일 (파비콘 설정)
├── vercel.json          # Vercel 배포 시 라우팅 설정
└── vite.config.ts       # Vite 및 PWA 빌드 설정
```

## 🔐 보안 기능

- Spring Security 기반 인증/인가
- JWT Token 기반 로그인
- BCrypt 비밀번호 암호화

## 👕 의상 추천 알고리즘

```
[START] recommend(userId, date)

1. 사용자 조회
   └─ 존재하지 않으면 예외 발생

2. 날씨 정보 조회
   ├─ 강수 여부 : isRaining
   └─ 평균 기온 : temperature

3. 어제 착용 의상 조회
   └─ yesterdayClothIds 추출 : lastWornAt

4. 사용자 전체 의상 로딩
   └─ 세탁중 제외 후보군 생성 : WashStatus : WASHING 제외

5. 프리셋 우선 평가
   └─ 각 프리셋에 대해:
       1) 내 옷인지 검증
       2) 조합 유효성 검사
       3) 조건 체크리스트 통과 여부 검사
          - 세탁중 포함 여부
          - 비 규칙 위반 여부
          - 온도 규칙 위반 여부
          - 어제 착용 위반 여부
       4) 통과 시 후보 리스트에 추가 (score = 100)

6. 일반 후보 생성
   ├─ 원피스 단일 후보 생성
   ├─ 상의 + 하의 조합 생성 (최대 10 x 10)
   ├─ 조건 체크리스트 통과 여부 검사
   └─ 통과 시 후보 리스트에 추가

7. 후보가 부족할 경우 (3개 미만)
   └─ 세탁중 포함 fallback 후보 추가

8. 아우터 정책 적용
   ├─ 기온 25도 이상이면 아우터 제외
   └─ 그렇지 않으면
        → 각 base 후보에 대해
           최적 아우터 1개 선택 후 합체 (경우의 수 폭발 방지)

9. 점수 기준 내림차순 정렬

10. 상위 3개 선택

[END] WearRecommendResponse 반환
```

## 📊 주요 특징

### 👕 의상 추천 알고리즘

- 점수제
- 날씨정보 반영

### 🏷️ 퀵등록

- 이모지를 통한 빠르고 편리한 옷 등록
- 핸드폰 안의 옷장 구현

### 🛁 세탁 여부 기능

- 현재 세탁 중인 의상 체크
- 세탁 중인 의상은 코디 추천 로직에서 제외

### ⏰ 출근시간 30분 전 알림

- 출근이 임박한 사용자 재촉

## 👥 팀

GDG 홍익대학교 프로젝트 팀 '골라ZOOM' 팀에서 개발했습니다.

| 이름 | 포지션 | 담당 역할 | Git | WIL |
| --- | --- | --- | --- | --- |
| 김태한 | Backend | JWT, 외부 API 적용, 프리셋 등 | https://github.com/taehan0 | https://velog.io/@taehan0 |
| 유도훈 | Backend | 의상 추천 알고리즘, 옷장, 착용이력 등 | https://github.com/phdcoco | https://velog.io/@rumung/series/Project |
| 김순호 | Frontend | 유저 환경 설정 및 출근 알람 구현 | https://github.com/Motor059 | [https://velog.io/@tnsgh01/](https://velog.io/@tnsgh01/%EA%B8%B0%ED%9A%8D-%EB%B8%8C%EB%A0%88%EC%9D%B8%EC%8A%A4%ED%86%A0%EB%B0%8D-WIL) |
| 양은정 | Frontend | 옷장 페이지, 캘린더 페이지 구현 | https://github.com/YangEunJung | https://blog.naver.com/ej_33 |

## ⭐ 이 프로젝트가 마음에 드신다면 GitHub Star로 응원해주세요! ⭐
