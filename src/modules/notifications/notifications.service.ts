import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  getLogs() {
    return { message: 'Get notification logs' };
  }

  resend(logId: string) {
    return { message: 'Resend notification', logId };
  }

  getMyNotifications() {
    return { message: 'Get my notifications' };
  }
}
