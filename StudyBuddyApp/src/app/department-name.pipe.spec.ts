import { DepartmentNamePipe } from './department-name.pipe';

describe('DepartmentNamePipe', () => {
  it('create an instance', () => {
    const pipe = new DepartmentNamePipe();
    expect(pipe).toBeTruthy();
  });
});
