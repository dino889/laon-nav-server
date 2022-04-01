## 나를위한 server

## stack

- node
- express-generator
- typescript
- pm2
  - log 파일 경로 `public/logs/` 로 변경(웹에서 모니터링 가능)
- nodemon (dev only)

## CLI

### 개발시

```bash
yarn run dev
```

### 배포시

```bash
yarn start
```

### 배포 중단 시

```bash
yarn stop
```

## API 정리

### 유저

- POST 회원가입 (social 여부도 포함)
- GET 회원정보 조회(user_id)
- PUT 회원정보 수정(user_id)
- DELETE(user_id)

---

- 이메일 중복확인
- 로그인
- 패스워드 초기화
- 이메일 인증 (메일보내기)
- 푸시알림 목록

### 지역

- 모든 지역 목록 조회

### 장소

> ex) places?area=부산&category=음식

> 장소는 찜수, 좋아요 수를 가지고있는다.

- 지역별 저회
- 지역별 & 카테고리별(타입별) 목록 조회
- 장소 상세 조회
- 장소 찜하기
- 장소 찜 취소하기
- 사용자의 찜목록 조회
- 장소에 대한 review 데이터(user의 image,nickname 과 join)
- 리뷰 등록 (별점갱신,image갱신)
- 리뷰 삭제
- 리뷰 수정 (별점갱신, image갱신)

---

- 내주변 장소 리스트 (10km? 정도)
- 리뷰 많은 순 장소 리스트
- 리뷰 좋은 순 장소 리스트
