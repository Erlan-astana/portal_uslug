import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {ProblemService} from '../../services/problem.service';
import {takeUntil} from 'rxjs/operators';

export interface CalendarList {
  number?: number;
  events?: Event[];
}

interface Event {
  name: string;
  time: string;
}

const TREE_DATA: CalendarList[] = [];

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  events = [];
  currentTasks: number;
  finishedTasks: number;
  subscription: Subscription;
  destroyed$ = new Subject();
  firstDayPosition: any;
  lastDayOfMonth: any;
  currentYear: any;
  currentMonth: any;
  satyrdayPosition = 0;
  sundayPosition = 0;
  unusualDays = [];

  firstDayHelper = 0;
  lastDayHelper = 1;

  constructor(
    private taskService: ProblemService
  ) {
    this.events = TREE_DATA;
    this.subscription = this.taskService.getMenu()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(menu => {
        this.getSectionCount(menu.data);
      });
  }

  ngOnInit() {
    this.initCalendar();
  }

  initCalendar() {
    this.getAllDaysInCurrentMonth();
    this.getFirstDayPosition();
    this.getUnusualdays()
      .then(() => {
        this.events = [];
        this.drawCalendarByMonthDays();
      });
  }

  public getUnusualdays() {
    return new Promise((resolve) => {
      const startDay = `${this.currentYear}-${this.currentMonth}-01`;
      const lastDay = `${this.currentYear}-${this.currentMonth}-${this.lastDayOfMonth}`;
      this.unusualDays = [];
      this.taskService.getUnusualDays(startDay, lastDay)
        .subscribe(res => {
          res.forEach(item => {
            const newDate = new Date(item.date);
            item.dayNumber = newDate.getDate();
            this.unusualDays.push(item);
          });
          resolve();
        });
    });
  }

  drawCalendarByMonthDays() {
    this.events = [];
    this.setFirstDayPositionInCalendar();
    let firstDayPosition = this.firstDayPosition;
    this.satyrdayPosition = 6;
    this.sundayPosition = 7;
    for (let i = 1; i <= this.lastDayOfMonth; i++) {
      this.setHolidaysInCalendar(firstDayPosition, i);
      firstDayPosition++;
    }
  }

  setHolidaysInCalendar(firstDayPosition, index) {
    let event = {name: ''};
    if (firstDayPosition % this.satyrdayPosition === 0) {
      event = {name: 'Выходной'};
      this.satyrdayPosition += 7;
    }
    if (firstDayPosition % this.sundayPosition === 0) {
      event = {name: 'Выходной'};
      this.sundayPosition += 7;
    }
    const unusualDayIndex = this.unusualDays.findIndex((day) => firstDayPosition === day.dayNumber);
    if (unusualDayIndex >= 0) {
      event.name = this.unusualDays[unusualDayIndex].dayName || 'Выходной';
    }
    this.events.push({
      number: index,
      events: [event]
    });
  }

  setFirstDayPositionInCalendar() {
    for (let i = 1; i < this.firstDayPosition; i++) {
      this.events.push({
        number: null,
        events: []
      });
    }
  }

  public getFirstDayPosition() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth() + this.firstDayHelper, 1);
    this.firstDayPosition = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
  }

  prevMonth() {
    this.firstDayHelper -= 1;
    this.lastDayHelper -= 1;
    this.initCalendar();
  }

  nextMonth() {
    this.firstDayHelper += 1;
    this.lastDayHelper += 1;
    this.initCalendar();
  }

  public getAllDaysInCurrentMonth() {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth() + this.lastDayHelper;
    this.lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + this.lastDayHelper, 0).getDate();
  }

  getSectionCount(menu) {
    if (menu) {
      this.finishedTasks = menu.finishedTasks;
      this.currentTasks = menu.currentTasks;
    }
  }

  getCurrentMonthStr() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth() + this.firstDayHelper, 1);
    return firstDay.toLocaleString('default', {month: 'long'});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
