import { Injectable } from '@nestjs/common';

@Injectable()
export class LeavesService {
  findAll() {
    return { message: 'Get all leaves' };
  }

  create(data: any, user: any) {
    return { message: 'Create leave request', data, user };
  }

  approve(id: string) {
    return { message: 'Approve leave', id };
  }

  reject(id: string) {
    return { message: 'Reject leave', id };
  }

  addNote(id: string, note: string) {
    return { message: 'Add note to leave', id, note };
  }

  getMyLeaves(user: any) {
    return { message: 'Get my leaves', user };
  }
}
