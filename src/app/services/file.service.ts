import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiService} from '../services/api.service';
import {app} from '../shared/models/application.model';
import {dic} from '../shared/models/dictionary.model';
import * as FileSaver from 'file-saver';
import {Observable} from 'rxjs';

@Injectable()
export class FileService {

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
  }

  public getAddFileReq(filesToUpload: File[] = [], categories: string = '[]') {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const formData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append('files[]', filesToUpload[i]);
    }
    formData.append('categories', categories);
    return this.http.post('/eqyzmet/storage/files', formData, {headers});
  }

  public getAddFileSingleReq(fileToUpload: File, category: string = null) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('fileName', fileToUpload.name);
    return this.http.post('/fileserver/api/files/upload', formData, {headers});
  }


  public getDeleteFileReq(type, id, fileId) {
    const url = `${type}/${id}/files/${fileId}`;
    return this.api.delete(url);
  }

  deleteFileByUrl(url) {
    return this.api.delete(url);
  }

  public getDeleteAddressFileReqByDeptEmployee(fileId: number) {
    const url = `app/files/${fileId}/address`;
    return this.api.delete(url);
  }

  public downloadFileReq(id: string) {
    location.href = `/fileserver/api/files/download/${id}`;
  }

  public save(fileObjects, fileObject, category, url, index, callback?: any) {
    const files = [];
    fileObject.objectId = fileObject.uid;
    fileObject.fileCategory = category;
    fileObject.name = fileObject.fileName;
    fileObject.size = fileObject.fileSize;
    files.push(fileObject);
    fileObjects[index].objectId = fileObject.uid;
    setTimeout(() => {
      this.api.post2(url, files).subscribe((data: any) => {
        if (data && data.body && data.body.length > 0) {
          fileObjects[index].id = data.body[0].id;
          if (callback) {
            callback();
          }
        }
        fileObjects[index].loading = false;
      });
    }, 1000);
  }

  public saveFiles(fileObjects: any[], category: string, url, callback?: any) {
    if (fileObjects) {
      for (let i = 0; i < fileObjects.length; i++) {
        if (fileObjects[i].loading === true) {
          this.getAddFileSingleReq(fileObjects[i].file, category).subscribe((fileObject: any) => {
            this.save(fileObjects, fileObject, category, url, i, callback);
          }, (error) => {
            console.log(error);
            fileObjects[i].loading = false;
          });
        }
      }
    }
  }

  public checkingFileCategoriesForRequired(app_: app.App, fileCategories: dic.CategoryFiles[]) {
    if (app_.files) {
      return fileCategories.every((e: dic.CategoryFiles) => {
        return e.required ? e.categoryFiles.length > 0 || e.categoryFilesUpload.length > 0 : true;
      });
    }
    return fileCategories.every((e: dic.CategoryFiles) => {
      return e.required ? e.categoryFilesUpload.length > 0 : true;
    });
  }

  generatePdfFile(id) {
    return this.api.getArrayBuffer(`userapp/${id}/generate`);
  }

  generatePdfFromContent(content) {
    this.api.postArrayBuffer(`templates/preview`, content).subscribe(res => {
      this.downloadGeneratedFile(res, 'preview-content.pdf');
    });
  }

  downloadGeneratedFile(file, fileName) {
    FileSaver.saveAs(file, fileName);
  }

  generateExcelFileWithApp(body = null, url, name, page: number, size: number) {
    this.api.postArrayBuffer(`report/${url}?page=${page}&size=${size}`, body).subscribe(res => {
      this.downloadGeneratedFile(res, `${name}_${new Date().getTime()}`);
    });
  }

  public generateExcelFileWithDifferentData(url, name, type = null) {
    this.api.getArrayBuffer(`report/${url}?type=${type}`).subscribe(res => {
      this.downloadGeneratedFile(res, `${name}_${new Date().getTime()}`);
    });
  }

  generateApprovalSheetFile(appId) {
    return this.api.getArrayBuffer(`userapp/${appId}/cn/agreement/preview`).subscribe(res => {
      this.downloadGeneratedFile(res, `approval_sheet_${new Date().getTime()}`);
    });
  }

  downloadApprovalSheetFile(appId, callback?) {
    return this.api.getArrayBuffer(`userapp/${appId}/cn/agreement`).subscribe(res => {
      this.downloadGeneratedFile(res, `approval_sheet_${new Date().getTime()}`);
      callback(res);
    });
  }

  downloadApprovalSheetDocxFile(appId) {
    return this.api.getArrayBuffer(`userapp/${appId}/cn/agreement/docx`).subscribe(res => {
      this.downloadGeneratedFile(res, `approval_sheet_${new Date().getTime()}`);
    });
  }

  public deleteGeneratedFile(id) {
    const url = `userapp/${id}/generate`;
    return this.api.delete(url);
  }

  public correctFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + ' Bytes';
    }
    if (bytes < 1048576) {
      return (bytes / 1024).toFixed(0) + ' KB';
    }
    if (bytes < 1073741824) {
      return (bytes / 1048576).toFixed(3) + ' MB';
    } else {
      return (bytes / 1073741824).toFixed(3) + ' GB';
    }
  }

  public correctFileName(str) {
    const correctName = str.length > 15 ? str.substring(0, 15) : str;
    return correctName;
  }

}
