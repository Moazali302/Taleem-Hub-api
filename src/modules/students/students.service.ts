import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {
  findAll() { return { message: 'Get all students' }; }
  create(data: any) { return { message: 'Create student', data }; }
  findOne(id: string) { return { message: 'Get student', id }; }
  update(id: string, data: any) { return { message: 'Update student', id, data }; }
  remove(id: string) { return { message: 'Delete student', id }; }
  uploadPhoto(id: string, file: any) { return { message: 'Upload photo', id, file }; }
  getFeeHistory(id: string) { return { message: 'Get fee history', id }; }
  getAttendance(id: string) { return { message: 'Get attendance', id }; }
  restore(id: string) { return { message: 'Restore student', id }; }
}
