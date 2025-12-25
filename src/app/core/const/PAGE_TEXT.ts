export const PageTexts = {
  departments: {
    icon:'kt-font-dark flaticon-squares',
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
};
