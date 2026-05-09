import { Injectable } from '@nestjs/common';

@Injectable()
export class SchoolsService {
  getSettings() {
    return { message: 'Get school settings' };
  }

  updateSettings(data: any) {
    return { message: 'Update school settings', data };
  }

  uploadLogo(file: any) {
    return { message: 'Logo uploaded', file };
  }

  deleteLogo() {
    return { message: 'Logo deleted' };
  }

  getLocation() {
    return { message: 'Get location' };
  }

  updateLocation(location: any) {
    return { message: 'Update location', location };
  }
}
