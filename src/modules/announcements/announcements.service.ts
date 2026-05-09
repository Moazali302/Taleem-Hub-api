import { Injectable } from '@nestjs/common';

@Injectable()
export class AnnouncementsService {
  findAll() {
    return { message: 'Get all announcements' };
  }

  create(data: any) {
    return { message: 'Create announcement', data };
  }

  update(id: string, data: any) {
    return { message: 'Update announcement', id, data };
  }

  remove(id: string) {
    return { message: 'Delete announcement', id };
  }
}
