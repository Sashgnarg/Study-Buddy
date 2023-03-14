import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'facultyName'
})
export class FacultyNamePipe implements PipeTransform {

  transform(faculty_id: number, faculties: any[]): string {
    console.log('faculty_id', faculty_id)
    console.log('faculties', faculties)
    var result = faculties.find(f => f.faculty_id == faculty_id)
    console.log(result)
    if (result == null) {
      return ''
    }
    if (result.faculty_name != null) {
      return result.faculty_name
    }
    else {
      return ''
    }
  }

}
