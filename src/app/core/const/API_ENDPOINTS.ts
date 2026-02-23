export const API_ENDPOINTS = {
    AUTH: {
        CREATE: '/sms/auth',
    },
    USERS: {
        ROLES: {
            CREATE: '/api/v1/roles',
            UPDATE: (id: string | number, orgId: string | number) => `/api/v1/roles/${id}/organization/${orgId}`,
            GET_ALL: (orgId: string | number) => `/api/v1/roles/organization/${orgId}`,
            GET_BY_ID: (id: string | number, orgId: string | number) => `/api/v1/roles/${id}/organization/${orgId}`,
            DELETE: (id: string | number, orgId: string | number) => `/api/v1/roles/${id}/organization/${orgId}`,
            SEARCH: (orgId: string | number, keyword: string) => `/api/v1/roles/search?organizationId=${orgId}&keyword=${keyword}`
        },
        PERMISSIONS: {
            CREATE: '/api/v1/permissions',
            UPDATE: (id: string | number, orgId: string | number) => `/api/v1/permissions/${id}/organization/${orgId}`,
            GET_ALL: (orgId: string | number) => `/api/v1/permissions/organization/${orgId}`,
            GET_BY_ID: (id: string | number, orgId: string | number) => `/api/v1/permissions/${id}/organization/${orgId}`,
            DELETE: (id: string | number, orgId: string | number) => `/api/v1/permissions/${id}/organization/${orgId}`,
            SEARCH: (orgId: string | number, keyword: string) => `/api/v1/permissions/search?organizationId=${orgId}&keyword=${keyword}`
        },
        MODULES: {
            CREATE: '/api/v1/modules',
            UPDATE: (id: string | number) => `/api/v1/modules/${id}`,
            GET_ALL: '/api/v1/modules',
            GET_BY_ID: (id: string | number) => `/api/v1/modules/${id}`,
            DELETE: (id: string | number) => `/api/v1/modules/${id}`,
            SEARCH: (keyword: string) => `/api/v1/modules/search?keyword=${keyword}`
        },
        RESOURCES: {
            CREATE: '/api/v1/resources',
            UPDATE: (id: string | number) => `/api/v1/resources/${id}`,
            GET_ALL: '/api/v1/resources',
            GET_BY_ID: (id: string | number) => `/api/v1/resources/${id}`,
            DELETE: (id: string | number) => `/api/v1/resources/${id}`,
            SEARCH: (keyword: string) => `/api/v1/resources/search?keyword=${keyword}`
        },
        ACTIONS: {
            CREATE: '/api/v1/actions',
            UPDATE: (id: string | number) => `/api/v1/actions/${id}`,
            GET_ALL: '/api/v1/actions',
            GET_BY_ID: (id: string | number) => `/api/v1/actions/${id}`,
            DELETE: (id: string | number) => `/api/v1/actions/${id}`,
            SEARCH: (keyword: string) => `/api/v1/actions/search?keyword=${keyword}`
        },
        ROLE_PERMISSIONS: {
            ASSIGN: '/api/role-permissions/assign',
            GET_BY_ROLE: (roleId: string | number) => `/api/role-permissions/role/${roleId}`,
            REMOVE: (roleId: string | number, permissionId: string | number) => `/api/role-permissions/role/${roleId}/permission/${permissionId}`,
            REMOVE_ALL: (roleId: string | number) => `/api/role-permissions/role/${roleId}`
        }
    },
    SALARY_STRUCTURE: {
        GET_ALL: '/api/institute/salary-structures',
        GET_BY_ID: (id: string) => `/api/institute/salary-structures/${id}`,
        CREATE: '/api/institute/salary-structures',
        UPDATE: (id: string) => `/api/institute/salary-structures/${id}`,
        CLOSE: (id: string) => `/api/institute/salary-structures/${id}/close`,
        DELETE: (id: string) => `/api/institute/salary-structures/${id}`,
        SEARCH: '/api/institute/salary-structures/search',
        DETAIL: '/api/institute/salary-structures/detail',
        DETAIL_BY_EMPLOYEE_TYPE: (id: string) => `/api/institute/salary-structures/by-employee-type/${id}`

    },
    SALARY_STRUCTURE_COMPONENT: {

        GET_ALL: '/api/institute/salary-structure/components',

        GET_BY_ID: (id: string) =>
            `/api/institute/salary-structure/components/${id}`,

        CREATE: '/api/institute/salary-structure/components',

        UPDATE: (id: string) =>
            `/api/institute/salary-structure/components/employee-type/${id}`,

        DELETE: (id: string) =>
            `/api/institute/salary-structure/components/${id}`,

        GET_BY_SALARY_STRUCTURE: (salaryStructureId: string) =>
            `/api/institute/salary-structure/components/salary-structure/${salaryStructureId}`,

        SEARCH: (salaryStructureId: string, keyword: string) =>
            `/api/institute/salary-structure/components/search?salaryStructureId=${salaryStructureId}&keyword=${keyword}`,

        COUNT_BY_SALARY_STRUCTURE: (salaryStructureId: string) =>
            `/api/institute/salary-structure/components/count/${salaryStructureId}`
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
        CREATE: '/api/institute/employees/list',
        UPDATE: (id: string) => `/api/institute/employees/${id}`,
        UPDATE_PROFILE: `/api/institute/employees/update-profile-photo`,
        UPLOAD_DOCS: `/api/institute/employees/upload-document`,
        DOWNLOAD_DOCS: `/api/institute/employees/download-document`,
        GET_EMPLOYEE_DOCS: (id: string) => `/api/institute/employees/${id}/documents`,
        GET_ALL: '/api/institute/employees',
        SEARCH: (keyword: string) => `/api/institute/employees/search?name=${keyword}`,
        GET_BY_ID: (id: string) => `/api/institute/employees/${id}`,


        EMPLOYEE_SALARY: {
            GET_ALL: '/api/institute/employee-salaries',
            GET_BY_ID: (id: string) => `/api/institute/employee-salaries/${id}`,
            GET_BY_EMP_ID: (id: string) => `/api/institute/employee-salaries/by-employeeId/${id}`,
            CREATE: '/api/institute/employee-salaries',
            UPDATE: (id: string) => `/api/institute/employee-salaries/${id}`,
            DELETE: (id: string) => `/api/institute/employee-salaries/${id}`,
            GET_BY_EMPLOYEE: (employeeId: string) => `/api/institute/employee-salaries/employee/${employeeId}`,
            GET_BY_STATUS: (status: string) => `/api/institute/employee-salaries/status/${status}`,
            GET_BY_EMPLOYEE_AND_MONTH: (employeeId: string, year: number, month: number) => `/api/institute/employee-salaries/employee/${employeeId}/month?year=${year}&month=${month}`
        },

        SALARY_PAYMENT: {
            GET_ALL: '/api/institute/salary-payments',
            GET_BY_ID: (id: string) => `/api/institute/salary-payments/${id}`,
            CREATE: '/api/institute/salary-payments',
            UPDATE: (id: string) => `/api/institute/salary-payments/${id}`,
            DELETE: (id: string) => `/api/institute/salary-payments/${id}`,
            GET_BY_EMPLOYEE_ID: (id: string) => `/api/institute/salary-payments/employee/${id}`,
            GET_BY_EMPLOYEE_SALARY: (employeeSalaryId: string) => `/api/institute/salary-payments/employee-salary/${employeeSalaryId}`
        },

        DEPARTMENTS: {
            ASSIGN: '/api/employees/departments', // POST to assign
            CURRENT: (employeeId: string | number) => `/api/employees/departments/current/${employeeId}`, // GET current department
            HISTORY: (employeeId: string | number) => `/api/employees/departments/history/${employeeId}`, // GET full history
        },
        DESIGNATIONS: {
            ASSIGN: '/api/employees/designations/assign',
            CURRENT: (employeeId: string | number) => `/api/employees/designations/current/${employeeId}`,
            HISTORY: (employeeId: string | number) => `/api/employees/designations/history/${employeeId}`
        },
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
        GET_DASHBOARD_FINANCIAL: '/api/lookup/dashboard/financials',
        GET_EMPLOYEE_COUNT_BY_TYPE: '/api/institute/employees/count-by-type'
    },

    INSTITUTE: {
        PROFILE: {
            GET: '/api/institute',
            CREATE: '/api/institute',
            UPDATE: '/api/institute'
        },
        CONTACTS: {
            CREATE: '/api/institute/contacts',
            UPDATE: (id: string | number) => `/api/institute/contacts/${id}`,
            GET_ALL: '/api/institute/contacts',
            GET_BY_ID: (id: string | number) => `/api/institute/contacts/${id}`,
            GET_BY_INSTITUTE_ID: (instituteId: string | number) => `/api/institute/contacts/institute/${instituteId}`,
            DELETE: (id: string | number) => `/api/institute/contacts/${id}`,
            SEARCH: (keyword: string) => `/api/institute/contacts/search?keyword=${keyword}`
        },
        SOCIAL_LINKS: {
            CREATE: '/api/institute/social-links',
            UPDATE: (id: string | number) => `/api/institute/social-links/${id}`,
            GET_ALL: '/api/institute/social-links',
            GET_BY_ID: (id: string | number) => `/api/institute/social-links/${id}`,
            GET_BY_INSTITUTE_ID: (instituteId: string | number) => `/api/institute/social-links/institute/${instituteId}`,
            DELETE: (id: string | number) => `/api/institute/social-links/${id}`,
            SEARCH: (keyword: string) => `/api/institute/social-links/search?keyword=${keyword}`
        },
        BOARD_MEMBERS: {
            CREATE: '/api/institute/board-members',
            UPDATE: (id: string | number) => `/api/institute/board-members/${id}`,
            GET_ALL: '/api/institute/board-members',
            GET_BY_ID: (id: string | number) => `/api/institute/board-members/${id}`,
            GET_BY_INSTITUTE_ID: (instituteId: string | number) => `/api/institute/board-members/institute/${instituteId}`,
            DELETE: (id: string | number) => `/api/institute/board-members/${id}`,
            SEARCH: (keyword: string) => `/api/institute/board-members/search?keyword=${keyword}`
        },
        ACCREDITATIONS: {
            CREATE: '/api/institute/accreditations',
            UPDATE: (id: string | number) => `/api/institute/accreditations/${id}`,
            GET_ALL: '/api/institute/accreditations',
            GET_BY_ID: (id: string | number) => `/api/institute/accreditations/${id}`,
            GET_BY_INSTITUTE_ID: (instituteId: string | number) => `/api/institute/accreditations/institute/${instituteId}`,
            DELETE: (id: string | number) => `/api/institute/accreditations/${id}`,
            SEARCH: (keyword: string) => `/api/institute/accreditations/search?keyword=${keyword}`,
            ACTIVATE: (id: string | number) => `/api/institute/accreditations/${id}/activate`,
            DEACTIVATE: (id: string | number) => `/api/institute/accreditations/${id}/deactivate`,
            GET_ACTIVE: '/api/institute/accreditations/active'
        },
        DOCUMENTS: {
            UPLOAD_DOCS: '/api/institute/documents/upload-document',
            DOWNLOAD_DOCS: '/api/institute/documents/download-document',
            GET_INSTITUTE_DOCS: (id: string | number) => `/api/institute/${id}/documents`
        },
        FINANCIAL_SETTINGS: {
            GET: (instituteId: string | number, academicYearId: string | number) => `/api/institute/${instituteId}/financial-settings/${academicYearId}`,
            UPDATE: (id: string | number) => `/api/institute/financial-settings/${id}`,
            CREATE: '/api/institute/financial-settings'
        },
        FACILITIES: {
            CREATE: '/api/institute/facilities',
            UPDATE: (id: string | number) => `/api/institute/facilities/${id}`,
            GET_ALL: '/api/institute/facilities',
            GET_BY_ID: (id: string | number) => `/api/institute/facilities/${id}`,
            GET_BY_INSTITUTE_ID: (instituteId: string | number) => `/api/institute/facilities/institute/${instituteId}`,
            DELETE: (id: string | number) => `/api/institute/facilities/${id}`,
            SEARCH: (keyword: string) => `/api/institute/facilities/search?keyword=${keyword}`
        },
        ACADEMIC_YEAR: {
            GET_BY_ID: (id: string) => `/api/school/academic/${id}`,
            GET_ALL: '/api/school/academic',
            GET_CURRENT: '/api/school/academic/current',
            SEARCH: `/api/school/academic/search`,
            CREATE: '/api/school/academic',
            UPDATE: (id: string) => `/api/school/academic/${id}`,
            ACTIVATE: (id: string) => `/api/school/academic/${id}/activate`,
            ARCHIVE: (id: string) => `/api/school/academic/${id}/archive`,
            CLOSE: (id: string) => `/api/school/academic/${id}/close`,
            MARK_LOCKED: (id: string) => `/api/school/academic/${id}/lock`,
            DELETE: (id: string) => `/api/school/academic/${id}`,
            CREATE_DEFAULT: `/api/school/academic/default`

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
            SEARCH: (keyword: string) => `/api/institute/designations/search/${keyword}`,
            GET_BY_DEPARTMENT: (departmentId: string | number) => `/api/institute/designations/by-department/${departmentId}`
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
            CREATE: '/api/institute/campuses-standards',
            UPDATE: (id: string) => `/api/institute/campuses-standards/${id}`,
            GET_ALL: '/api/institute/campuses-standards',
            SEARCH: '/api/institute/campuses-standards/search',
            GET_BY_ID: (id: string) => `/api/institute/campuses-standards/${id}`,
            GET_BY_CAMPUS_ID: (campusId: string) => `/api/institute/campuses-standards/campus/${campusId}`,
            DELETE_BY_ID: (id: string) => `/api/institute/campuses-standards/${id}`,
            DELETE_BY_CAMPUS_ID: (campusId: string) => `/api/institute/campuses-standards/campus/${campusId}`
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
        FEE_RECURRENCE_RULES: {
            GET_ALL: '/api/lookups/fee-recurrence-rules'
        },
        PROVINCE: {
            GET_ALL: '/api/lookup/provinces',
            GET_BY_COUNTRY_ID: (id: string) => `/api/lookup/countries/${id}/provinces`
        },
        CITY: {
            GET_BY_PROVINCE_ID: (id: number) => `/api/lookup/country/provinces/${id}/cities`
        },
        CURRENCY: {
            GET_ALL: '/api/lookups/currencies'
        },
        TAX_TYPE: {
            GET_ALL: '/api/lookups/tax-types',
            GET_BY_COUNTRY: (countryId: number) => `/api/lookups/tax-types/country/${countryId}`
        },
        FACILITY_TYPES: {
            GET_ALL: '/api/lookups/facility-types',
            GET_BY_ID: (id: string | number) => `/api/lookups/facility-types/${id}`,
            CREATE: '/api/lookups/facility-types',
            UPDATE: (id: string | number) => `/api/lookups/facility-types/${id}`,
            DELETE: (id: string | number) => `/api/lookups/facility-types/${id}`
        }
    },
    ACADEMIC: {
        CORE: {
            GROUPS: {
                CREATE: '/api/academic/core/groups',
                UPDATE: (id: string | number) => `/api/academic/core/groups/${id}`,
                GET_ALL: '/api/academic/core/groups',
                GET_BY_ID: (id: string | number) => `/api/academic/core/groups/${id}`,
                DELETE: (id: string | number) => `/api/academic/core/groups/${id}`
            },
            SUBJECTS: {
                CREATE: '/api/academic/core/subjects',
                UPDATE: (id: string | number) => `/api/academic/core/subjects/${id}`,
                GET_ALL: '/api/academic/core/subjects',
                GET_BY_ID: (id: string | number) => `/api/academic/core/subjects/${id}`,
                DELETE: (id: string | number) => `/api/academic/core/subjects/${id}`
            },
            SUBJECT_GROUPS: {
                CREATE: '/api/academic/core/groups',
                UPDATE: (id: string | number) => `/api/academic/core/groups/${id}`,
                GET_ALL: '/api/academic/core/groups',
                GET_BY_ID: (id: string | number) => `/api/academic/core/groups/${id}`,
                DELETE: (id: string | number) => `/api/academic/core/groups/${id}`
            },
            STANDARD_SUBJECTS: {
                ASSIGN: '/api/academic/core/standard-subjects',
                BULK_ASSIGN: '/api/academic/core/standard-subjects/bulk',
                GET_BY_STANDARD: '/api/academic/core/standard-subjects',
                UNASSIGN: '/api/academic/core/standard-subjects',
                BULK_UNASSIGN: '/api/academic/core/standard-subjects/bulk',
                UPDATE: (id: string | number) => `/api/academic/core/standard-subjects/${id}`
            }
        },
        SCHEDULING: {
            ASSIGNMENTS: {
                CREATE: '/api/academic/scheduling/assignments',
                GET_BY_TEACHER: (id: string | number) => `/api/academic/scheduling/assignments/teacher/${id}`,
                GET_BY_SECTION: '/api/academic/scheduling/assignments/section',
                GET_BY_STANDARD: '/api/academic/scheduling/assignments/standard',
                DELETE: '/api/academic/scheduling/assignments'
            },
            TIMETABLE: {
                CREATE: '/api/academic/scheduling/timetable',
                UPDATE: (id: string | number) => `/api/academic/scheduling/timetable/${id}`,
                GET_SECTION: '/api/academic/scheduling/timetable/section',
                GET_TEACHER: (id: string | number) => `/api/academic/scheduling/timetable/teacher/${id}`,
                DELETE: (id: string | number) => `/api/academic/scheduling/timetable/${id}`
            }
        },
        ATTENDANCE: {
            STUDENTS: {
                MARK: '/api/academic/attendance/students',
                GET_SECTION: '/api/academic/attendance/students/section',
                GET_MONTHLY: (id: string | number) => `/api/academic/attendance/students/${id}/monthly`,
                DELETE: (id: string | number) => `/api/academic/attendance/students/${id}`
            },
            EMPLOYEES: {
                MARK: '/api/academic/attendance/employees',
                GET_MONTHLY: (id: string | number) => `/api/academic/attendance/employees/${id}/monthly`,
                DELETE: (id: string | number) => `/api/academic/attendance/employees/${id}`
            }
        },
        EVALUATION: {
            EXAM_TYPES: {
                CREATE: '/api/academic/evaluation/exam-types',
                UPDATE: (id: string | number) => `/api/academic/evaluation/exam-types/${id}`,
                GET_ALL: '/api/academic/evaluation/exam-types',
                GET_BY_ID: (id: string | number) => `/api/academic/evaluation/exam-types/${id}`,
                SEARCH: (keyword: string) => `/api/academic/evaluation/exam-types/search/${keyword}`,
                DELETE: (id: string | number) => `/api/academic/evaluation/exam-types/${id}`
            },
            EXAM_TERMS: {
                CREATE: '/api/academic/evaluation/exam-terms',
                UPDATE: (id: string | number) => `/api/academic/evaluation/exam-terms/${id}`,
                GET_BY_YEAR: '/api/academic/evaluation/exam-terms',
                GET_BY_TENANT: '/api/academic/evaluation/exam-terms/tenant',
                GET_BY_ID: (id: string | number) => `/api/academic/evaluation/exam-terms/${id}`,
                SEARCH: (keyword: string) => `/api/academic/evaluation/exam-terms/search/${keyword}`,
                DELETE: (id: string | number) => `/api/academic/evaluation/exam-terms/${id}`
            },
            EXAMS: {
                CREATE: '/api/academic/evaluation/exams',
                UPDATE: (id: string | number) => `/api/academic/evaluation/exams/${id}`,
                GET_ALL: '/api/academic/evaluation/exams',
                GET_BY_ID: (id: string | number) => `/api/academic/evaluation/exams/${id}`,
                GET_BY_SECTION: '/api/academic/evaluation/exams/section',
                SEARCH: '/api/academic/evaluation/exams/search',
                DELETE: (id: string | number) => `/api/academic/evaluation/exams/${id}`
            },
            ASSESSMENT_TYPES: {
                CREATE: '/api/academic/evaluation/assessment-types',
                UPDATE: (id: string | number) => `/api/academic/evaluation/assessment-types/${id}`,
                GET_ALL: '/api/academic/evaluation/assessment-types',
                GET_BY_ID: (id: string | number) => `/api/academic/evaluation/assessment-types/${id}`,
                SEARCH: (keyword: string) => `/api/academic/evaluation/assessment-types/search/${keyword}`,
                DELETE: (id: string | number) => `/api/academic/evaluation/assessment-types/${id}`
            },
            EXAM_SUBJECTS: {
                SCHEDULE: '/api/academic/evaluation/exam-subjects',
                GET_BY_EXAM: '/api/academic/evaluation/exam-subjects',
                UNSCHEDULE: '/api/academic/evaluation/exam-subjects',
                BULK_SCHEDULE: '/api/academic/evaluation/exam-subjects/bulk'
            },
            ASSESSMENTS: {
                CREATE: '/api/academic/evaluation/assessments',
                UPDATE: (id: string | number) => `/api/academic/evaluation/assessments/${id}`,
                GET_BY_ID: (id: string | number) => `/api/academic/evaluation/assessments/${id}`,
                GET_BY_ASSIGNMENT: (id: string | number) => `/api/academic/evaluation/assessments/assignment/${id}`,
                DELETE: (id: string | number) => `/api/academic/evaluation/assessments/${id}`
            },
            STUDENT_ASSESSMENTS: {
                SUBMIT: '/api/academic/evaluation/student-assessments/submit',
                EVALUATE: '/api/academic/evaluation/student-assessments/evaluate',
                GET_BY_ASSESSMENT: (id: string | number) => `/api/academic/evaluation/student-assessments/assessment/${id}`,
                GET_BY_STUDENT: (id: string | number) => `/api/academic/evaluation/student-assessments/student/${id}`
            },
            REPORTS: {
                CAMPUS_SUMMARY: '/api/academic/reports/exam-attendance/campus-summary',
                STANDARD_SUMMARY: '/api/academic/reports/exam-attendance/standard-summary',
                SECTION_SUMMARY: '/api/academic/reports/exam-attendance/section-summary',
                SUBJECT_SUMMARY: '/api/academic/reports/exam-attendance/subject-summary',
                DETAILED: '/api/academic/reports/exam-attendance/detail'
            }
        },
        RESULTS: {
            MARKS: {
                RECORD: '/api/academic/results/marks',
                GET_BY_SUBJECT: (id: string | number) => `/api/academic/results/marks/subject/${id}`,
                GET_BY_STUDENT: (id: string | number) => `/api/academic/results/marks/student/${id}`
            },
            EXAM_ATTENDANCE: {
                RECORD: '/api/academic/evaluation/mark-exam-attendance',
                GET_BY_SUBJECT: '/api/academic/evaluation/exam-attendance'
            },
            WEIGHTAGES: {
                SAVE: '/api/academic/results/weightages',
                GET_BY_STANDARD: (id: string | number) => `/api/academic/results/weightages/standard/${id}`
            },
            PROCESS: '/api/academic/results/process',
            SECTION_RESULTS: '/api/academic/results/section',
            STUDENT_RESULT: (id: string | number) => `/api/academic/results/student/${id}`,
            REPORT_CARDS: {
                GENERATE: '/api/academic/results/report-cards',
                GET_BY_STUDENT: (id: string | number) => `/api/academic/results/report-cards/student/${id}`,
                DELETE: (id: string | number) => `/api/academic/results/report-cards/${id}`
            },
            GRADE_SCALES: {
                CREATE: '/api/academic/results/grade-scales',
                UPDATE: (id: string | number) => `/api/academic/results/grade-scales/${id}`,
                GET_ALL: '/api/academic/results/grade-scales',
                GET_BY_ID: (id: string | number) => `/api/academic/results/grade-scales/${id}`,
                SEARCH: (keyword: string) => `/api/academic/results/grade-scales/search/${keyword}`,
                DELETE: (id: string | number) => `/api/academic/results/grade-scales/${id}`
            }
        }
    }
};
