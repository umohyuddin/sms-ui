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
            UPDATE: (id: string) => `/api/institute/campuses/standards${id}`,
            GET_ALL: '/api/institute/campuses/standards',
            SEARCH: '/api/institute/campuses/standards/search',
            GET_BY_ID: (id: string) => `/api/institute/campuses/standards/${id}`,
            GET_BY_CAMPUS_ID: (id: string) => `/api/institute/campuses/standards/campus/${id}`
        },
        SECTIONS: {
            CREATE: '/api/institute/campuses/standards/sections',
            UPDATE: (id: string) => `/api/institute/campuses/standards/sections/${id}`,
            GET_ALL: '/api/institute/campuses/standards/sections',
            SEARCH: '/api/institute/campuses/standards/sections/search',
            GET_BY_ID: (id: string) => `/api/institute/campuses/standards/sections/${id}`
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
