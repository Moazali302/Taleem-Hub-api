import { Injectable } from '@nestjs/common';

@Injectable()
export class ExamsService {
  findAll() {
    return { message: 'Get all exams' };
  }

  create(data: any) {
    return { message: 'Create exam', data };
  }

  update(id: string, data: any) {
    return { message: 'Update exam', id, data };
  }

  remove(id: string) {
    return { message: 'Delete exam', id };
  }
}
