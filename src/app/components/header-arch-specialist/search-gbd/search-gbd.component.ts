import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Entity, Person, Realty, SearchGBDOption, ZagsBirth, ZagsChangeFio, ZagsDeath} from './search-gbd.model';
import {SearchGbdService} from './search-gbd.service';

@Component({
  selector: 'app-search-gbd',
  templateUrl: './search-gbd.component.html',
  styleUrls: ['./search-gbd.component.scss'],
})
export class SearchGbdComponent implements OnInit {
  searchOption = '';
  destroyed$ = new Subject();
  @ViewChild('userInput', {static: true}) userInput: ElementRef<HTMLInputElement>;
  personsData: Person;
  facesData: Entity;
  realtiesData: Realty[];
  isSpinnerOpened = false;
  zagsDeathData: ZagsDeath[];
  zagsChangeFio: ZagsChangeFio[];
  zagsBirthData: ZagsBirth[];
  searchOptions: SearchGBDOption[];

  constructor(
    private gbdSvc: SearchGbdService,
    public dialogRef: MatDialogRef<SearchGbdComponent>
  ) {
  }

  ngOnInit() {
    this.initSearchOptions();
  }

  onSearchClick(searchOption: string) {
    this.clearResults();
    this.isSpinnerOpened = true;
    const userInputVal = this.userInput.nativeElement.value;
    switch (searchOption) {
      case 'persons':
        this.getPersonsData(userInputVal);
        this.getRealties('byiinbin', userInputVal);
        this.getZags('death', 'byiin', userInputVal);
        this.getZags('changefio', 'byiin', userInputVal);
        this.getZags('birth', 'byiin', userInputVal);
        break;
      case 'faces':
        this.getFacesData(userInputVal);
        this.getRealties('byiinbin', userInputVal);
        break;
      case 'realties':
        this.getRealties('bykadno', userInputVal);
        break;
      case 'fullName':
        this.getZags('death', 'byfio?page=0&size=5', userInputVal);
        this.getZags('changefio', 'byfio?page=0&size=5', userInputVal);
        this.getZags('birth', 'byfio?page=0&size=5', userInputVal);
        break;
    }
  }

  clearResults() {
    this.personsData = null;
    this.facesData = null;
    this.realtiesData = null;
    this.zagsDeathData = null;
    this.zagsChangeFio = null;
    this.zagsBirthData = null;
  }

  getPersonsData(iin: string): void {
    this.gbdSvc
      .getIndividual(iin)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.personsData = data;
            this.isSpinnerOpened = false;
          }
        },
        (error) => {
          alert('Ошибка: ' + error);
          this.isSpinnerOpened = false;
        }
      );
  }

  getFacesData(iin: string): void {
    this.gbdSvc
      .getEntity(iin)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.facesData = data;
            this.isSpinnerOpened = false;
          }
        },
        (error) => {
          alert('Ошибка: ' + error);
          this.isSpinnerOpened = false;
        }
      );
  }

  getRealties(type: string, iin: string): void {
    this.gbdSvc
      .getRealties(type, iin)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.realtiesData = data;
            this.isSpinnerOpened = false;
          }
        },
        (error) => {
          alert('Ошибка: ' + error);
          this.isSpinnerOpened = false;
        }
      );
  }

  getZags(zagsType: string, searchType: string, input: string): void {
    this.gbdSvc
      .getZags(zagsType, searchType, input)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (data: any) => {
          if (data && data.content && data.content.length) {
            this.parseByZagsType(zagsType, data.content);
            this.isSpinnerOpened = false;
          }
        },
        (error) => {
          alert('Ошибка: ' + error);
          this.isSpinnerOpened = false;
        }
      );
  }

  parseByZagsType(zagsType: string, data: any) {
    switch (zagsType) {
      case 'death':
        this.zagsDeathData = data;
        break;
      case 'changefio':
        this.zagsChangeFio = data;
        break;
      case 'birth':
        this.zagsBirthData = data;
        break;
    }
  }

  initSearchOptions() {
    this.searchOptions = [
      {title: 'Поиск по ИИН', value: 'persons'},
      {title: 'Поиск по БИН', value: 'faces'},
      {title: 'Поиск по кадастровому номеру', value: 'realties'},
      {title: 'Поиск по ФИО', value: 'fullName'}
    ];
  }

  onClose() {
    this.dialogRef.close();
  }
}
