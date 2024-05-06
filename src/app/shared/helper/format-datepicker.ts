import { NativeDateAdapter } from '@angular/material';

export class AppDateAdapter extends NativeDateAdapter {

  getFirstDayOfWeek(): number {
    return 1;
  }
}
