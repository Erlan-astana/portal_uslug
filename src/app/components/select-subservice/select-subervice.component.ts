import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DicApplicationService} from '../../services/dic.application.service';
import {dic} from '../../shared/models/dictionary.model';
import Subservices = dic.Subservices;
import {TranslateService} from '@ngx-translate/core';
import {AdminService} from '../../services/admin.service';


@Component({
  selector: 'app-select-subservice',
  templateUrl: './select-subervice.component.html',
  styleUrls: ['./select-subervice.component.scss']
})


export class SelectSuberviceComponent implements OnInit {
  @Output() setSelectSubservice = new EventEmitter<any>();
  services: any;
  reserveServices: any;
  selectedSubservice = null;
  currentLang;

  constructor(
    private translate: TranslateService,
    private dicSvc: DicApplicationService,
    private adminService: AdminService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getSubservices();
  }

  getSubservices() {
    this.dicSvc.getAllSubServiceReq().subscribe((data: any) => {
      this.services = data;
      this.reserveServices = data;
    });
  }

  sendSubservice(subservice: any): void {
    this.setSelectSubservice.emit(subservice);
  }

  searchByServices(query: string) {
    const result = this.adminService.optionSelect(query, this.services, 'shortNameRu');
    this.reserveServices = result;
  }

}
