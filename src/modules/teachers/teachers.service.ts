import { Injectable } from '@nestjs/common';

@Injectable()
export class TeachersService {
  findAll() {
    return { message: 'Get all teachers' };
  }

  create(data: any) {
    return { message: 'Create teacher', data };
  }

  findOne(id: string) {
    return { message: 'Get teacher', id };
  }

  update(id: string, data: any) {
    return { message: 'Update teacher', id, data };
  }

  remove(id: string) {
    return { message: 'Delete teacher', id };
  }

  resendInvite(id: string) {
    return { message: 'Resend invite', id };
  }
}
