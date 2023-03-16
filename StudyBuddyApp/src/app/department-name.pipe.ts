import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'departmentName'
})
export class DepartmentNamePipe implements PipeTransform {

  transform(faculty_id: number, department_id: number, departments: any[]): unknown {
    var result = departments.find(d => d.faculty_id == faculty_id && d.department_id == department_id)
    if (result == null) {
      return ''
    }
    if (result.department_name != null) {
      return result.department_name
    }
    else {
      return ''
    }
  }

}
