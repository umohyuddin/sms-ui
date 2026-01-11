export const API_ENDPOINTS = {
    AUTH: {
        CREATE: '/sms/auth',
    },
    SALARY_STRUCTURE: {
        GET_ALL: '/api/institute/salary-structures',
        GET_BY_ID: (id: string) => `/api/institute/salary-structures/${id}`,
        CREATE: '/api/institute/salary-structures',
        UPDATE: (id: string) => `/api/institute/salary-structures/${id}`,
        CLOSE: (id: string) => `/api/institute/salary-structures/${id}/close`,
        DELETE: (id: string) => `/api/institute/salary-structures/${id}`,
        SEARCH: '/api/institute/salary-structures/search'
    },
    SALARY_COMPONENT: {
        GET_ALL: '/api/institute/salary-components',
        GET_BY_ID: (id: string) => `/api/institute/salary-components/${id}`,
        CREATE: '/api/institute/salary-components',
        UPDATE: (id: string) => `/api/institute/salary-components/${id}`,
        SEARCH: (keyword: string) => `/api/institute/salary-components/search/${keyword}`,
        META: '/api/institute/salary-components'
    },
    STUDENTS: {
        CREATE: '/api/institute/students',
        UPDATE: (id: string) => `/api/institute/students/${id}`,
        GET_ALL: '/api/institute/students',
        SEARCH: `/api/institute/students/search`,
        GET_BY_ID: (id: string) => `/api/institute/students/${id}`,
        ASSIGN_STUDENT_FEE: (id: string) => `/api/students/${id}/fees/assign`,
        UPDATE_STUDENT_FEE: (id: string) => `/api/students/${id}/fees/update`,
        STUDENT_FEE_SUMMARY: '/api/students/fee/summary/filter',
        STUDENT_FEE_PAYMENT: '/api/students/fee/payments',
        UPLOAD_DOCS: `/api/institute/students/upload-document`,
        DOWNLOAD_DOCS: `/api/institute/students/download-document`,
        GET_STUDENT_DOCS: (id: string) => `/api/institute/students/${id}/documents`,

        STUDENT_ASSIGNED_DISCOUNT: {
            GET_STUDENT_ASSIGNED_DISCOUNT: (id: string) => `/api/school/discounts/student/${id}/assigned`,
            UPDATE: (id: string) => `/api/school/discounts/rates/${id}`,
            GET_ALL: '/api/school/discounts/rates',
            SEARCH: `/api/school/discounts/rates/search`,
            GET_BY_ID: (id: string) => `/api/school/discounts/rates/${id}`,
            GET_ACTIVE_DISCOUNTS: '/api/school/discounts/rates/byCampusYear'
        },
        STUDENT_ASSIGNED_FEE: {
            GET_STUDENT_ASSIGNED_FEE_FLAT: (id: string) => `/api/students/${id}/fees/assigned-flat`,
        }

    },
    EMPLOYEE: {
        CREATE: '/api/institute/employees',
        UPDATE: (id: string) => `/api/institute/employees/${id}`,
        UPDATE_PROFILE: `/api/institute/employees/update-profile-photo`,
        UPLOAD_DOCS: `/api/institute/employees/upload-document`,
        DOWNLOAD_DOCS: `/api/institute/employees/download-document`,
        GET_EMPLOYEE_DOCS: (id: string) => `/api/institute/employees/${id}/documents`,
        GET_ALL: '/api/institute/employees',
        SEARCH: (keyword: string) => `/api/institute/employees/search?name=${keyword}`,
        GET_BY_ID: (id: string) => `/api/institute/employees/${id}`,

        ADDRESS: {
            GET_EMPLOYEE_ID: (id: string) => `/api/institute/employees/${id}/addresses`,
            GET_BY_ID: (id: string) => `/api/institute/employees/addresses/${id}`,
            CREATE: (id: string) => `/api/institute/employees/${id}/addresses`,
            UPDATE: (id: string) => `/api/institute/employees/addresses/${id}`
        },

    },
    DASHBOARD: {
        GET_STUDENT_COUNTS: '/api/institute/students/dashboard',
        GET_DASHBOARD_COUNTS: '/api/lookup/dashboard/counts',
        GET_DASHBOARD_FINANCIAL: '/api/lookup/dashboard/financials'
    },

    INSTITUTE: {
        PROFILE: {
            GET: '/api/institute',
            CREATE: '/api/institute',
            UPDATE: '/api/institute'
        },
        ACADEMIC_YEAR: {
            GET_BY_ID: (id: string) => `/api/school/academic/${id}`,
            GET_ALL: '/api/school/academic',
            GET_CURRENT: '/api/school/academic/current',
            SEARCH: `/api/school/academic/search`,
            CREATE: '/api/school/academic',
            UPDATE: (id: string) => `/api/school/academic/${id}`,
        },
        ADMISSION_TYPES: {
            GET_ALL: '/api/admission/types',
        },
        CAMPUSES: {
            CREATE: '/api/institute/campuses',
            UPDATE: (id: string) => `/api/institute/campuses/${id}`,
            GET_ALL: '/api/institute/campuses',
            META: '/api/institute/campuses/meta',
            SEARCH: (keyword: string) => `/api/institute/campuses/search/${keyword}`,
            GET_BY_ID: (id: string) => `/api/institute/campuses/${id}`
        },
        DEPARTMENTS: {
            CREATE: '/api/institute/departments',
            UPDATE: (id: string | number) => `/api/institute/departments/${id}`,
            GET_ALL: '/api/institute/departments',
            GET_ACTIVE: '/api/institute/departments/active',
            GET_BY_ID: (id: string | number) => `/api/institute/departments/${id}`,
            DELETE: (id: string | number) => `/api/institute/departments/${id}`,
            SEARCH: (keyword: string) => `/api/institute/departments/search?keyword=${keyword}`,
        },
        DESIGNATIONS: {
            CREATE: '/api/institute/designations',
            UPDATE: (id: string | number) => `/api/institute/designations/${id}`,
            GET_ALL: '/api/institute/designations',
            GET_ACTIVE: '/api/institute/designations/active',
            GET_BY_ID: (id: string | number) => `/api/institute/designations/${id}`,
            DELETE: (id: string | number) => `/api/institute/designations/${id}`,
            SEARCH: (keyword: string) => `/api/institute/designations/${keyword}`,
        },
        EMPLOYEE_TYPE: {
            CREATE: '/api/institute/employee-types',
            UPDATE: (id: string | number) => `/api/institute/employee-types/${id}`,
            GET_ALL: '/api/institute/employee-types',
            GET_ACTIVE: '/api/institute/employee-types',
            GET_BY_ID: (id: string | number) => `/api/institute/employee-types/${id}`,
            DELETE: (id: string | number) => `/api/institute/employee-types/${id}`,
            SEARCH: (keyword: string) => `/api/institute/employee-types/${keyword}`,
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
            UPDATE: (id: string) => `/api/fee/catalogs/${id}`,
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
            SEARCH: `/api/fee/rates/search`,
            GET_BY_ID: (id: string) => `/api/fee/rates/${id}`,
            GET_ACTIVE_RATES: '/api/fee/rates/active'
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
            GET_BY_ID: (id: string) => `/api/school/discounts/subtypes/${id}`,
            GET_BY_CONCESSION_TYPE: (id: string) => `/api/school/discounts/subtypes/byDiscountType/${id}`
        },
        DISCOUNT_RATES: {
            CREATE: '/api/school/discounts/rates',
            UPDATE: (id: string) => `/api/school/discounts/rates/${id}`,
            GET_ALL: '/api/school/discounts/rates',
            SEARCH: `/api/school/discounts/rates/search`,
            GET_BY_ID: (id: string) => `/api/school/discounts/rates/${id}`,
            GET_ACTIVE_DISCOUNTS: '/api/school/discounts/rates/byCampusYear'
        }
    },
    LOOKUP: {
        FEE_CATALOG_META: '/api/lookup/fee-catalog/metadata',
        STUDENT_ADMISSION_META: '/api/lookup/admission/metadata',
        EMPLOYEE_DOCS_META: '/api/lookup/docs/metadata',
        PROVINCE: {
            GET_ALL: '/api/lookup/provinces',
            GET_BY_COUNTRY_ID: (id: string) => `/api/lookup/countries/${id}/provinces`
        },
        CITY: {
            GET_BY_PROVINCE_ID: (id: number) => `/api/lookup/country/provinces/${id}/cities`
        }
    }
};
