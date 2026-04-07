import { Injectable } from '@nestjs/common';

@Injectable()
export class SuperAdminService {
  getAllSchools() {
    return { message: 'Get all schools' };
  }

  getSchool(id: string) {
    return { message: 'Get school', id };
  }

  blockSchool(id: string) {
    return { message: 'Block school', id };
  }

  unblockSchool(id: string) {
    return { message: 'Unblock school', id };
  }

  getRevenue() {
    return { message: 'Get revenue' };
  }

  getAuditLogs() {
    return { message: 'Get audit logs' };
  }
}
