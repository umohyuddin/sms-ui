export const API_ENDPOINTS = {
    USERS: {
        GET_ALL: '/users',
        GET_BY_ID: (id: number) => `/users/${id}`,
        CREATE: '/users/create',
        UPDATE: (id: number) => `/users/update/${id}`,
        DELETE: (id: number) => `/users/delete/${id}`
    }
    ,
    INSTITUTE: {
        CAMPUSES: {
            CREATE: '/api/institute/campuses',
            UPDATE: '/api/institute/campuses',
            GET_ALL: '/api/institute/campuses',
            SEARCH: (keyword: string) => `/api/institute/campuses/search/${keyword}`,
            GET_BY_ID: (id: string) => `/api/institute/campuses/${id}`
        },
        STANDARDS: {
            CREATE: '/api/institute/campuses/standards',
            UPDATE: '/api/institute/campuses/standards',
            GET_ALL: '/api/institute/campuses/standards',
            SEARCH: '/api/institute/campuses/standards/search',
            GET_BY_ID: (id: string) => `/api/institute/campuses/standards/${id}`
        }

    },


    LOOKUP: {
        PROVINCE: {
            GET_ALL: '/api/lookup/provinces'
        },
        CITIY: {
            GET_BY_PROVINCE_ID: (id: number) => `/api/lookup/provinces/${id}/cities`
        }
    }
};
