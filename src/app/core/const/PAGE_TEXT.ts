export const PageTexts = {
  SCHOOL_PROFILE: {
    icon: 'kt-font-dark flaticon-squares',
    header: 'Your Profile',
    buttons: {
      add: 'Add your Profile',
      edit: 'Edit your Profile',
      view: 'View your Profile'
    },
    messages: {
      welcomeNote: 'Add your Profile to unlock all the features and manage everything with ease.',
      welcomeHeading: 'Welcome to Your Profile Setup!',
      profileAddedHeading: 'School Profile Added!',
      profileAddedMessagge: 'Your school profile has been successfully created. However, no campus has been set up yet.',
      profileAddedNote: 'Please set up at least one campus to ensure your system runs smoothly. If your school is a standalone entity, creating at least one campus is required for proper functionality.'
    }
  },

  departments: {
    icon: 'kt-font-dark flaticon-squares',
    header: 'Departments Listing',
    buttons: {
      add: 'Add Department',
      edit: 'Edit Department',
      delete: 'Delete Department',
      view: 'View Department'
    },
    messages: {
      noData: 'No departments available at the moment. Please check back later or add a new department.',
      deleteConfirmation: 'Are you sure you want to delete this department?'
    }
  },
  campus: {
    Module: 'Campus',
    icon: 'kt-font-dark flaticon-squares',
    header: 'Campus Listing',
    buttons: {
      add: 'Add Campus',
      edit: 'Edit Campus',
      delete: 'Delete Campus',
      view: 'View Campus'
    },
    messages: {
      noData: 'No campuses available at the moment. Please check back later or add a new campus.',
      deleteConfirmation: 'Are you sure you want to delete this campus?'
    }
  },
  examSubject: {
    Module: 'Exam Subject',
    icon: 'kt-font-dark flaticon-squares',
    header: 'Exam Subject Listing',
    buttons: {
      add: 'Schedule Subject',
      edit: 'Edit Schedule',
      delete: 'Unschedule Subject',
      view: 'View Schedule'
    },
    messages: {
      noData: 'No subjects scheduled for this exam yet.',
      deleteConfirmation: 'Are you sure you want to unschedule this subject?'
    }
  },
  roles: {
    icon: 'kt-font-dark flaticon-squares',
    header: 'Roles Listing',
    buttons: {
      add: 'Add Role',
      edit: 'Edit Role',
      delete: 'Delete Role',
      view: 'View Role'
    },
    messages: {
      noData: 'No roles available at the moment. Please check back later or add a new role.',
      deleteConfirmation: 'Are you sure you want to delete this role?'
    }
  },
  permissions: {
    icon: 'kt-font-dark flaticon-squares',
    header: 'Permissions Listing',
    buttons: {
      add: 'Add Permission',
      edit: 'Edit Permission',
      delete: 'Delete Permission',
      view: 'View Permission'
    },
    messages: {
      noData: 'No permissions available at the moment. Please check back later or add a new permission.',
      deleteConfirmation: 'Are you sure you want to delete this permission?'
    }
  },

  employees: {
    header: 'Employees Listing',
    buttons: {
      add: 'Add Employee',
      edit: 'Edit Employee',
      delete: 'Delete Employee',
      view: 'View Employee'
    },
    messages: {
      noData: 'No employees found. Please add new employees.',
      deleteConfirmation: 'Are you sure you want to delete this employee?'
    },
    tableHeaders: ['Name', 'Employee Code', 'Designation', 'Department', 'Status', 'Actions']
  },

  payroll: {
    header: 'Payroll Details',
    buttons: {
      process: 'Process Payroll',
      view: 'View Payroll'
    },
    messages: {
      noData: 'No payroll records available.'
    }
  },

  // add more pages here...
  academic: {
    subjects: {
      icon: 'kt-font-dark flaticon-squares',
      header: 'Subjects Listing',
      buttons: {
        add: 'Add Subject',
        edit: 'Edit Subject',
        delete: 'Delete Subject'
      },
      messages: {
        noData: 'No subjects available. Please add a new subject.',
        deleteConfirmation: 'Are you sure you want to delete this subject?'
      }
    },
    subjectGroups: {
      icon: 'kt-font-dark flaticon-squares',
      header: 'Subject Groups Listing',
      buttons: {
        add: 'Add Group',
        edit: 'Edit Group',
        delete: 'Delete Group'
      },
      messages: {
        noData: 'No subject groups available. Please add a new group.',
        deleteConfirmation: 'Are you sure you want to delete this group?'
      }
    },
    exams: {
      header: 'Exams Listing',
      buttons: {
        add: 'Add Exam',
        schedule: 'Schedule Exam'
      }
    },
    attendance: {
      studentHeader: 'Student Attendance',
      employeeHeader: 'Employee Attendance'
    }
  },
  feeRecurrenceRule: {
    Module: 'Fee Recurrence Rule',
    icon: 'kt-font-dark flaticon-squares',
    header: 'Fee Recurrence Rule Listing',
    buttons: {
      add: 'Add Recurrence Rule',
      edit: 'Edit Recurrence Rule',
      delete: 'Delete Recurrence Rule',
      view: 'View Recurrence Rule'
    },
    messages: {
      noData: 'No fee recurrence rules available at the moment. Please check back later or add a new rule.',
      deleteConfirmation: 'Are you sure you want to delete this fee recurrence rule?'
    }
  },
  chargeType: {
    Module: 'Charge Type',
    icon: 'kt-font-dark flaticon-squares',
    header: 'Charge Type Listing',
    buttons: {
      add: 'Add Charge Type',
      edit: 'Edit Charge Type',
      delete: 'Delete Charge Type',
      view: 'View Charge Type'
    },
    messages: {
      noData: 'No charge types available at the moment. Please check back later or add a new charge type.',
      deleteConfirmation: 'Are you sure you want to delete this charge type?'
    }
  }
};
