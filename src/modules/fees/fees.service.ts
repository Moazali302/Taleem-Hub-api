import { Injectable } from '@nestjs/common';

@Injectable()
export class FeesService {
  findAll() {
    return { message: 'Get all fees' };
  }

  findByStudent(studentId: string) {
    return { message: 'Get fees by student', studentId };
  }

  markAsPaid(id: string) {
    return { message: 'Mark fee as paid', id };
  }

  generateChallan(id: string) {
    return { message: 'Generate challan', id };
  }

  notifyStudent(studentId: string) {
    return { message: 'Notify student about fee', studentId };
  }

  getOverdueFees() {
    return { message: 'Get overdue fees' };
  }
}
