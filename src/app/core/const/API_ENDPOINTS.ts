export const API_ENDPOINTS = {
    AUTH: {
        CREATE: '/sms/auth',
    },
    STUDENTS: {
        CREATE: '/api/institute/students',
        UPDATE: (id: string) => `/api/institute/students/${id}`,
        GET_ALL: '/api/institute/students',
        SEARCH: (keyword: string) => `/api/institute/students/search/${keyword}`,
        GET_BY_ID: (id: string) => `/api/institute/students/${id}`
    },
    INSTITUTE: {
        ACADEMIC_YEAR: {
            GET_BY_ID: (id: string) => `/api/school/academic/${id}`,
            GET_ALL: '/api/school/academic',
            GET_CURRENT:'/api/school/academic/current'
        },
         ADMISSION_TYPES: {
            GET_ALL: '/api/admission/types',
        },
        CAMPUSES: {
            CREATE: '/api/institute/campuses',
            UPDATE: (id: string) => `/api/institute/campuses/${id}`,
            GET_ALL: '/api/institute/campuses',
            SEARCH: (keyword: string) => `/api/institute/campuses/search/${keyword}`,
            GET_BY_ID: (id: string) => `/api/institute/campuses/${id}`
        },
        STANDARDS: {
            CREATE: '/api/institute/campuses/standards',
            UPDATE: (id: string) => `/api/institute/campuses/standards/${id}`,
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
            GET_BY_ID: (id: string) => `/api/institute/campuses/standards/sections/${id}`,
            GET_BY_STANDARD_ID: (id: string) => `/api/institute/campuses/standards/${id}/sections`
        }
    },
    FEE: {
        FEE_CATALOG: {
            CREATE: '/api/fee/catalogs',
            UPDATE: (id: string) => `/api/fee/catalogs${id}`,
            GET_ALL: '/api/fee/catalogs',
            SEARCH: (keyword: string) => `/api/fee/catalogs/search/${keyword}`,
            GET_BY_ID: (id: string) => `/api/fee/catalogs/${id}`
            
        },
        FEE_CATALOG_COMPONENT: {
            CREATE: '/api/fee/components',
            UPDATE: (id: string) => `/api/fee/components/${id}`,
            GET_ALL: '/api/fee/components',
            SEARCH: `/api/fee/components/search`,
            GET_BY_ID: (id: string) => `/api/fee/components/${id}`,
            GET_BY_FEE_CATALOG: (id: string) => `/api/fee/components/catalog/${id}`
        },
        FEE_RATES: {
            CREATE: '/api/fee/rates',
            UPDATE: (id: string) => `/api/fee/rates/${id}`,
            GET_ALL: '/api/fee/rates',
            SEARCH: (keyword: string) => `/api/fee/rates/search/${keyword}`,
            GET_BY_ID: (id: string) => `/api/fee/rates/${id}`,
            GET_ACTIVE_RATES:'/api/fee/rates'
        }
    },
    DISCOUNT: {
        DISCOUNT_TYPE: {
            CREATE: '/api/school/discounts/types',
            GET_ALL: '/api/school/discounts/types',
            SEARCH: (keyword: string) => `/api/school/discounts/types/search/${keyword}`,
            GET_BY_ID: (id: string) => `/api/school/discounts/types/${id}`,
            UPDATE: (id: string) => `/api/school/discounts/types/${id}`,
        },
        DISCOUNT_SUB_TYPE: {
            CREATE: '/api/school/discounts/subtypes',
            UPDATE: (id: string) => `/api/school/discounts/subtypes/${id}`,
            GET_ALL: '/api/school/discounts/subtypes',
            SEARCH: `/api/school/discounts/subtypes/search`,
            GET_BY_ID: (id: string) => `/api/school/discounts/subtypes/${id}`
        },
        DISCOUNT_RATES: {
            CREATE: '/api/school/discounts/rates',
            UPDATE: (id: string) => `/api/school/discounts/rates/${id}`,
            GET_ALL: '/api/school/discounts/rates',
            SEARCH: (keyword: string) => `/api/school/discounts/rates/search/${keyword}`,
            GET_BY_ID: (id: string) => `/api/school/discounts/rates/${id}`
        }
    },

    LOOKUP: {
        FEE_CATALOG_META: '/api/lookup/fee-catalog/metadata',
        STUDENT_ADMISSION_META: '/api/lookup/admission/metadata',
        PROVINCE: {
            GET_ALL: '/api/lookup/provinces'
        },
        CITIY: {
            GET_BY_PROVINCE_ID: (id: number) => `/api/lookup/provinces/${id}/cities`
        }
    }
};
