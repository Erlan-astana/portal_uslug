import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileService} from '../../../services/file.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  public href: string = "";
  folders: any[] = [
    {
      objectId: '09871f85-6c41-4155-b2bb-6155d19e947c-2021-mdb',
      name: 'РП - ицн',
    },
    {
      objectId: '37ae45d9-5e57-4ff8-a1b0-3af0d9c7960c-2021-mdb',
      name: 'РП - эскизный проект',
    },
    {
      objectId: '52a6cd69-6785-4b6c-9009-02d2c56ab311-2021-mdb',
      name: 'РП - апз',
    },
    {
      objectId: '3715ce2a-f0e5-42e2-b652-3e4c133e69e9-2021-mdb',
      name: 'РП - зем.проект',
    },
    {
      objectId: 'a18e3992-229c-45be-8bff-ee353bcd100b-2021-mdb',
      name: 'РП - постановка на очередь'
    }
  ];
  specialFolders = [
    {
      objectId: '87b7414e-3a8c-4883-ba4d-f771f15d2f12-2021-mdb',
      name: 'РП - эскизный проект для специалиста',
    },
    {
      objectId: 'd224615e-367c-4c25-ad13-fc486de01b60-2021-mdb',
      name: 'РП - зем.проект для специалистa'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<UserGuideComponent>,
    private fileSvc: FileService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.showFoldersByUrl();
  }

  showFoldersByUrl() {
    this.href = this.router.url;
    if (!this.href.includes('create-app')) {
      this.folders = this.specialFolders;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showGuideFile(folder) {
    this.fileSvc.downloadFileReq(folder.objectId);
  }

}
