import api from './axios';

export interface ClothInput {
    image: File;
    category: string;
    season: string;
    color: string;
    rainOk: boolean;
    memo: string;
}

export interface ClothParams {
    page?: number;
    size?: number;
    category?: string;
    season?: string;
}

// 옷 등록 (POST /api/closet)
export const addCloth = async (formData: FormData) => {
    const response = await api.post('/api/closet', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송 필수 헤더
        },
    });
    return response.data;
};

// 모든 옷 조회 (GET /api/closet)
export const getClothes = async (params?: ClothParams) => {
    const response = await api.get('/api/closet', {
        params: {
            page: 0,
            size: 20,
            ...params, // category, season 등의 필터가 들어오면 합침
        }
    });
    return response.data;
};

// 옷 상세 조회 (GET /api/closet/{clothId})
export const getClothDetail = async (clothId: string) => {
    const response = await api.get(`/api/closet/${clothId}`);
    return response.data;
};

// 옷 수정 (PATCH /api/closet/{clothId})
export const updateCloth = async (clothId: string, data: FormData) => {
    const response = await api.patch(`/api/closet/${clothId}`, data);
    return response.data;
};

// 옷 삭제 (DELETE /api/closet/{clothId})
export const deleteCloth = async (clothId: string) => {
    const response = await api.delete(`/api/closet/${clothId}`);
    return response.data;
};