import { http, HttpResponse } from 'msw'

const BASE_URL = 'http://localhost:5173/api';

export const handlers = [
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const requestBody = await request.json() as { username: string; password: string; name: string; };

    if (requestBody.username === 'test' && requestBody.password === '1234') {
      return HttpResponse.json({
        id: 1,
        accessToken: "fake_access_token_12345",
        refreshToken: "fake_refresh_token_67890",
        message: "로그인 성공!"
      });
    } else {
      // 실패 시 401 에러 반환
      return HttpResponse.json(
        { message: "아이디 또는 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }
  }),

  // 회원가입 Mock API
  http.post(`${BASE_URL}/auth/signup`, () => {
    return HttpResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다."
    }, { status: 201 });
  }),

  // 회원탈퇴 Mock API
  http.delete(`${BASE_URL}/members/:id`, ({ params }) => {
    console.log(`유저 ID ${params.id} 삭제 요청됨`);
    return HttpResponse.json({
      success: true,
      message: "회원 탈퇴 완료"
    });
  }),

  // 비밀번호 변경 Mock API
  http.patch(`${BASE_URL}/members/:id`, async ({ request }) => {
    const body = await request.json() as { currentpassword: string; newpassword: string; };
    
    if (body.currentpassword === '1234') {
      return HttpResponse.json({
        status: 200,
        success: true,
        message: "비밀번호가 변경되었습니다."
      });
    } else {
      return HttpResponse.json({
        message: "현재 비밀번호가 일치하지 않습니다."
      }, { status: 400 });
    }
  }),
]