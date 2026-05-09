import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassesService {
  findAll() {
    return { message: 'Get all classes' };
  }

  create(data: any) {
    return { message: 'Create class', data };
  }

  findOne(id: string) {
    return { message: 'Get class', id };
  }

  update(id: string, data: any) {
    return { message: 'Update class', id, data };
  }

  remove(id: string) {
    return { message: 'Delete class', id };
  }

  getStudents(id: string) {
    return { message: 'Get students in class', id };
  }
}
