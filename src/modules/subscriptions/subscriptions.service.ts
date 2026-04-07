import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionsService {
  getPlans() {
    return { message: 'Get subscription plans' };
  }

  getMySubscription() {
    return { message: 'Get my subscription' };
  }

  getTrialStatus() {
    return { message: 'Get trial status' };
  }

  activate(data: any) {
    return { message: 'Activate subscription', data };
  }

  updateStatus(id: string, status: string) {
    return { message: 'Update subscription status', id, status };
  }
}
