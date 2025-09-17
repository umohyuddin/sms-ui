export const ApiConfig = {
  baseUrl: 'http://localhost:8081',

  get generateToken() { return `${this.baseUrl}/api/auth/generateToken`; },



  // theme table
  get updateTheme() { return `${this.baseUrl}/api/user/theme/update`; },
  get createTheme() { return `${this.baseUrl}/api/user/theme/create`; },
  get getAllTheme() { return `${this.baseUrl}/api/user/theme/getall`; },
  get getThemeById() { return `${this.baseUrl}/api/user/theme/get`; },
  get deleteTheme() { return `${this.baseUrl}/api/user/theme/delete`; },
  get getThemeByUserId() { return `${this.baseUrl}/api/user/theme/getbyuser`; },

  // User Table
  get updateUser() { return `${this.baseUrl}/api/user/update`; },
  get createUser() { return `${this.baseUrl}/api/user/create`; },
  get getUsers() { return `${this.baseUrl}/api/user/getall`; },
  get getUserById() { return `${this.baseUrl}/api/user/get`; },
  get getUserByUsername() { return `${this.baseUrl}/api/user/getbyusername`; },
  get deleteUser() { return `${this.baseUrl}/api/user/delete`; },

  //Student Table
  get updateStudent() { return `${this.baseUrl}/api/student/update`; },
  get deleteStudent() { return `${this.baseUrl}/api/student/delete`; },
  get craeteStudent() { return `${this.baseUrl}/api/student/create`; },
  get getStudentsByInstitute() { return `${this.baseUrl}/api/student/getbyinst`; },
  get getStudentsByCampus() { return `${this.baseUrl}/api/student/getbycampus`; },
  get getStudents() { return `${this.baseUrl}/api/student/getall`; },
  get getStudentById() { return `${this.baseUrl}/api/student/get`; },
  

  // Fee Table
  get updateFee() { return `${this.baseUrl}/api/student/fee/update`; },
  get deleteFee() { return `${this.baseUrl}/api/student/fee/delete`; },
  get craeteStudentFee() { return `${this.baseUrl}/api/student/fee/create`; },
  get getStudentFeeByStudentId() { return `${this.baseUrl}/api/student/fee/getbystudent`; },
  get getAllStudentFee() { return `${this.baseUrl}/api/student/fee/getall`; },
  get getStudentFeeById() { return `${this.baseUrl}/api/student/fee/get`; },

  // Student Attendance
  get updateStudentAttendance() { return `${this.baseUrl}/api/student/attendance/update`; },
  get deleteStudentAttendance() { return `${this.baseUrl}/api/student/attendance/delete`; },
  get craeteStudentAttendance() { return `${this.baseUrl}/api/student/attendance/create`; },
  get getStudentAttendanceByStudentId() { return `${this.baseUrl}/api/student/attendance/getbystudent`; },
  get getAllStudentAttendance() { return `${this.baseUrl}/api/student/attendance/getall`; },
  get getStudentAttendanceById() { return `${this.baseUrl}/api/student/attendance/get`; },

   // Student FeeParticulars
  get updateFeeParticulars() { return `${this.baseUrl}/api/student/feeparticulars/update`; },
  get deleteFeeParticulars() { return `${this.baseUrl}/api/student/feeparticulars/delete`; },
  get craeteFeeParticulars() { return `${this.baseUrl}/api/student/feeparticulars/create`; },
  get getFeeParticularsByInstitute() { return `${this.baseUrl}/api/student/feeparticulars/getbyinstitute`; },
  get getAllFeeParticulars() { return `${this.baseUrl}/api/student/feeparticulars/getall`; },
  get getFeeParticularsById() { return `${this.baseUrl}/api/student/feeparticulars/get`; },

  // User Role
  get updateUserRole() { return `${this.baseUrl}/api/user/user-role/update`; },
  get deleteUserRole() { return `${this.baseUrl}/api/user/user-role/delete`; },
  get createUserRole() { return `${this.baseUrl}/api/user/user-role/create`; },
  get getUserRoles() { return `${this.baseUrl}/api/user/user-role/getall`; },
  get getUserRoleById() { return `${this.baseUrl}/api/user/user-role/get`; },

  // Inventory
  get updateInventory() { return `${this.baseUrl}/api/schools/inventory/update`; },
  get deleteInventory() { return `${this.baseUrl}/api/schools/inventory/delete`; },
  get createInventory() { return `${this.baseUrl}/api/schools/inventory/create`; },
  get getInventoryByInstitute() { return `${this.baseUrl}/api/schools/inventory/getbyinstitute`; },
  get getInventoryByCampus() { return `${this.baseUrl}/api/schools/inventory/getbycampus`; },
  get getAllInventory() { return `${this.baseUrl}/api/schools/inventory/getall`; },
  get getInventoryById() { return `${this.baseUrl}/api/schools/inventory/get`; },

  // Institute
  get updateInstitute() { return `${this.baseUrl}/api/schools/institute/update`; },
  get deleteInstitute() { return `${this.baseUrl}/api/schools/institute/delete`; },
  get createInstitute() { return `${this.baseUrl}/api/schools/institute/create`; },
  get getAllInstitutes() { return `${this.baseUrl}/api/schools/institute/getall`; },
  get getInstituteById() { return `${this.baseUrl}/api/schools/institute/get`; },

  // bank 
  get updateBank() { return `${this.baseUrl}/api/schools/bank/update`; },
  get deleteBank() { return `${this.baseUrl}/api/schools/bank/delete`; },
  get createBank() { return `${this.baseUrl}/api/schools/bank/create`; },
  get getAllBank() { return `${this.baseUrl}/api/schools/bank/getall`; },
  get getBankById() { return `${this.baseUrl}/api/schools/bank/get`; },
  get getBankByInstitute() { return `${this.baseUrl}/api/schools/bank/getbyinstitute`; },

    // Rules 
  get updateRules() { return `${this.baseUrl}/api/schools/rules/update`; },
  get deleteRules() { return `${this.baseUrl}/api/schools/rules/delete`; },
  get createRules() { return `${this.baseUrl}/api/schools/rules/create`; },
  get getRulesByInstitute() { return `${this.baseUrl}/api/schools/rules/getbyinstitute`; },

    // marks 
  get updateMarks() { return `${this.baseUrl}/api/schools/marks/update`; },
  get deleteMarks() { return `${this.baseUrl}/api/schools/marks/delete`; },
  get createMarks() { return `${this.baseUrl}/api/schools/marks/create`; },
  get getAllMarks() { return `${this.baseUrl}/api/schools/marks/getall`; },
  get getMarksById() { return `${this.baseUrl}/api/schools/marks/get`; },
  get getMarksByInstitute() { return `${this.baseUrl}/api/schools/marks/getbyinstitute`; },

  // FailCriteria 
  get updateFailCriteria() { return `${this.baseUrl}/api/schools/failcriteria/update`; },
  get deleteFailCriteria() { return `${this.baseUrl}/api/schools/failcriteria/delete`; },
  get createFailCriteria() { return `${this.baseUrl}/api/schools/failcriteria/create`; },
  get getAllFailCriteria() { return `${this.baseUrl}/api/schools/failcriteria/getall`; },
  get getFailCriteriaById() { return `${this.baseUrl}/api/schools/failcriteria/get`; },
  get getFailCriteriaByInstitute() { return `${this.baseUrl}/api/schools/failcriteria/getbyinstitute`; },

  // dashbord
  get getDashBoard() { return `${this.baseUrl}/api/schools/dashboard/getdashboard`; },


  // Department
  get updateDeparment() { return `${this.baseUrl}/api/schools/department/update`; },
  get deleteDeparment() { return `${this.baseUrl}/api/schools/department/delete`; },
  get createDeparment() { return `${this.baseUrl}/api/schools/department/create`; },
  get getAllDeparments() { return `${this.baseUrl}/api/schools/department/getall`; },
  get getDeparmentById() { return `${this.baseUrl}/api/schools/department/get`; },

  // Campus
  get updateCampus() { return `${this.baseUrl}/api/schools/campus/update`; },
  get deleteCampus() { return `${this.baseUrl}/api/schools/campus/delete`; },
  get createCampus() { return `${this.baseUrl}/api/schools/campus/create`; },
  get getAllCampus() { return `${this.baseUrl}/api/schools/campus/getall`; },
  get getCampusById() { return `${this.baseUrl}/api/schools/campus/get`; },

  // Employee
  get updateEmployee() { return `${this.baseUrl}/api/employee/update`; },
  get deleteEmployee() { return `${this.baseUrl}/api/employee/delete`; },
  get createEmployee() { return `${this.baseUrl}/api/employee/create`; },
  get getEmployeeByInstitute() { return `${this.baseUrl}/api/employee/getbyinst`; },
  get getEmployeeByCampus() { return `${this.baseUrl}/api/employee/getbycampus`; },
  get getAllEmployee() { return `${this.baseUrl}/api/employee/getall`; },
  get getEmployeeById() { return `${this.baseUrl}/api/employee/get`; },

  // Salary
  get updateSalary() { return `${this.baseUrl}/api/employee/salary/update`; },
  get deleteSalary() { return `${this.baseUrl}/api/employee/salary/delete`; },
  get createSalary() { return `${this.baseUrl}/api/employee/salary/create`; },
  get getAllSalary() { return `${this.baseUrl}/api/employee/salary/getall`; },
  get getSalaryById() { return `${this.baseUrl}/api/employee/salary/get`; },
  get getSalaryByEmployeeId() { return `${this.baseUrl}/api/employee/salary/get/emp`; },

  // Employee Role
  get updateEmployeeRole() { return `${this.baseUrl}/api/employee/role/update`; },
  get deleteEmployeeRole() { return `${this.baseUrl}/api/employee/role/delete`; },
  get createEmployeeRole() { return `${this.baseUrl}/api/employee/role/create`; },
  get getAllEmployeeRole() { return `${this.baseUrl}/api/employee/role/getall`; },
  get getEmployeeRoleById() { return `${this.baseUrl}/api/employee/role/get`; },

  // Employee Attendace
  get updateEmployeeAttendance() { return `${this.baseUrl}/api/employee/attendance/update`; },
  get deleteEmployeeAttendance() { return `${this.baseUrl}/api/employee/attendance/delete`; },
  get createEmployeeAttendance() { return `${this.baseUrl}/api/employee/attendance/create`; },
  get getAllEmployeeAttendance() { return `${this.baseUrl}/api/employee/attendance/getall`; },
  get getEmployeeAttendanceById() { return `${this.baseUrl}/api/employee/attendance/get`; },
  get getEmployeeAttendanceByEmployeeId() { return `${this.baseUrl}/api/employee/attendance/get/emp`; },

  // Course
  get updateCourse() { return `${this.baseUrl}/api/course/update`; },
  get deleteCourse() { return `${this.baseUrl}/api/course/delete`; },
  get createCourse() { return `${this.baseUrl}/api/course/create`; },
  get getCoursesByTeacherId() { return `${this.baseUrl}/api/course/getbyteacherid`; },
  get getCourseById() { return `${this.baseUrl}/api/course/get`; },
  get getAllCourse() { return `${this.baseUrl}/api/course/getall`; },
  get getCourseByDeparmentId() { return `${this.baseUrl}/api/course/getbydepartmentid`; },

  // Class
  get updateClass() { return `${this.baseUrl}/api/course/sclass/update`; },
  get deleteClass() { return `${this.baseUrl}/api/course/sclass/delete`; },
  get createClass() { return `${this.baseUrl}/api/course/sclass/create`; },
  get getClassById() { return `${this.baseUrl}/api/course/sclass/get`; },
  get getClassByCourseId() { return `${this.baseUrl}/api/course/sclass/getbycourseid`; },
  get getAllClasses() { return `${this.baseUrl}/api/course/sclass/getall`; },
  get getClassByTeacherId() { return `${this.baseUrl}/api/course/sclass/getbyteacherid`; },

  // Enrollment
  get updateEnrollement() { return `${this.baseUrl}/api/course/enrollment/update`; },
  get deleteEnrollement() { return `${this.baseUrl}api/course/enrollment/delete`; },
  get createEnrollement() { return `${this.baseUrl}/api/course/enrollment/create`; },
  get getEnrollementByTeacherId() { return `${this.baseUrl}/api/course/enrollment/getbyteacherid`; },
  get getEnrollementByStudentId() { return `${this.baseUrl}/api/course/enrollment/getbystudentid`; },
  get getEnrollementByCourseId() { return `${this.baseUrl}/api/course/enrollment/getbycourseid`; },
  get getAllEnrollement() { return `${this.baseUrl}/api/course/enrollment/getall`; },
  get getEnrollementById() { return `${this.baseUrl}/api/course/enrollment/get`; },

  // Assessment
  get updateAssessment() { return `${this.baseUrl}/api/course/assessment/update`; },
  get deleteAssessment() { return `${this.baseUrl}/api/course/assessment/delete`; },
  get createAssessment() { return `${this.baseUrl}/api/course/assessment/create`; },
  get getAssessmentofStudentWithinCourse() { return `${this.baseUrl}/api/course/assessment/getstudentwithincourse`; },
  get getAssessmentByStudentId() { return `${this.baseUrl}/api/course/assessment/getbystudentid`; },
  get getAssessmentByCourseId() { return `${this.baseUrl}/api/course/assessment/getbycourseid`; },
  get getAssessmentById() { return `${this.baseUrl}/api/course/assessment/get`; },
  get getAllAssessment() { return `${this.baseUrl}/api/course/assessment/getall`; },

  
};

