#entities=("department" "employee-type" "designation" "salary-structure" "salary-component" \
#"salary-structure-component" "employee-salary" "employee-deduction" "salary-payment" \
#"payroll-period" "employee-bonus" "employee-advance" "salary-slip")

entities=("roles" "permission")

BASE_PATH="src/app/features"

for e in "${entities[@]}"
do
  # Module with routing
  ng g m ${BASE_PATH}/${e}-management --routing

  # Components
  ng g c ${BASE_PATH}/${e}-management/components/${e}-create-form
  ng g c ${BASE_PATH}/${e}-management/components/${e}-info
  ng g c ${BASE_PATH}/${e}-management/components/${e}-listing-table

  # Pages
  ng g c ${BASE_PATH}/${e}-management/pages/${e}-create
  ng g c ${BASE_PATH}/${e}-management/pages/${e}-details
  ng g c ${BASE_PATH}/${e}-management/pages/${e}-listing

  # Service
  ng g s ${BASE_PATH}/${e}-management/services/${e}
done
