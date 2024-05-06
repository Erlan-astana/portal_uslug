import {Injectable, OnDestroy} from '@angular/core';
import {ApiService} from './api.service';
import {auth} from '../shared/models/auth.model';
import User = auth.User;
import {Location} from '@angular/common';
import {dic} from '../shared/models/dictionary.model';
import Subservices = dic.Subservices;
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private api: ApiService,
              private location: Location,
              private snackBar: MatSnackBar) {
  }

  pageName: string;
  lastPageNumber: number;
  searchData: any = {};


  public goBack() {
    this.location.back();
  }

  public setPaginationInfo(name, nm) {
    this.pageName = name;
    this.lastPageNumber = nm;
  }

  public getPaginationInfo() {
    return {name: this.pageName, number: this.lastPageNumber};
  }

  public setSearchInfo(name, componentName) {
    this.searchData.value = name;
    this.searchData.name = componentName;
  }

  public getSearchInfo() {
    return this.searchData;
  }

  public setForm(control, data) {
    Object.keys(control)
      .forEach(controlName => {
        if (!control[controlName].controls) {
          if (data) {
            control[controlName].setValue(data[controlName]);
            if (controlName.toLowerCase().indexOf('date') !== -1) {
              if (data[controlName]) {
                const convertDate = new Date(data[controlName]).toISOString().substring(0, 10);
                control[controlName].setValue(convertDate, {
                  onlyself: true
                });
              }
            }
          }
        } else {
          this.setForm(control[controlName].controls, data[controlName]);
        }
      });
  }

  public openSkackbar(message, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }


  public getRoleList(page: number = null, size: number = null, name: string = '') {
    return this.api.get2(`roles?page=${page}&size=${size}&name=${name}&sort=id`);
  }

  public addRole(data: any) {
    return this.api.post2('roles', data);
  }

  public getRole(id: number) {
    return this.api.get2(`roles/${id}`);
  }

  public updateRole(role: any) {
    return this.api.put2(`roles/${role.id}`, role);
  }

  public removeRole(id: number) {
    return this.api.delete(`roles/${id}`);
  }

  public removeRoleFromService(id: number, roleId) {
    return this.api.delete(`subservices/${id}/roles/${roleId}`);
  }

  public getUsers(page: number = null, size: number = null, searchText) {
    return this.api.get2(`users?page=${page}&size=${size}&searchText=${searchText}`);
  }

  public getUsersWithoutPage() {
    return this.api.get2(`users`);
  }

  public updateTasksAssignees(body) {
    return this.api.put2(`tasks/assignees`, body);
  }

  public getUserByEmail(email: string) {
    return this.api.get2(`users?username=${email}`);
  }

  public getUserByEmailFromEatyrau(email: string) {
    return this.api.get(`users/email/${email}`);
  }

  public getUserById(id: number) {
    return this.api.get2(`users/${id}`);
  }

  public saveUser(user: User) {
    return this.api.post2('users', user);
  }

  public updateUser(user: User) {
    return this.api.put2(`users/${user.id}`, user);
  }

  public giveUserRoleAndSubservice(data: any) {
    return this.api.post2('users/roles', data);
  }

  public updateUserRoleAndSubservice(data: any, id: number) {
    return this.api.put2(`users/roles/${id}`, data);
  }

  public getUserRoles(username: string) {
    return this.api.get2(`users/roles?username=${username}`);
  }

  public removeUserRole(id: number) {
    return this.api.delete(`users/roles/${id}`);
  }

  public removeUser(id: number) {
    return this.api.delete(`users/${id}`);
  }

  public getSubservices(page: number = null, size: number = null, name: string) {
    return this.api.get2(`subservices?page=${page}&size=${size}&name=${name}`);
  }

  public getMembersById(id: number, regionId: number) {
    if (regionId) {
      return this.api.get2(`subservices/${id}/members?regionId=${regionId}`);
    } else {
      return this.api.get2(`subservices/${id}/members`);
    }

  }

  public getServiceById(id: number) {
    return this.api.get2(`subservices/${id}`);
  }

  public updateSubservice(subservice: Subservices) {
    return this.api.put2(`subservices/${subservice.id}`, subservice);
  }

  public getRoles(subserviceId: number = null) {
    return this.api.get2(`roles?subserviceId=${subserviceId}&size=60`);
  }

  public getRoleSubservices(roleId: number) {
    return this.api.get2(`roles/${roleId}/subservices`);
  }

  public removeRoleSubservices(roleId: number, subserviceRoleId: number) {
    return this.api.delete(`/roles/${roleId}/subservices/${subserviceRoleId}`);
  }

  public setSubserviceInRole(data: any, roleId: number) {
    return this.api.post2(`roles/${roleId}/subservices`, data);
  }

  public getAvailableUserSections(userId: number) {
    return this.api.get2(`users/${userId}/access`);
  }

  public getUserMenu() {
    return this.api.get2(`users/access`);
  }

  public saveUserMenu(data: any, userId) {
    return this.api.put2(`/users/${userId}/access`, data);
  }

  public getComments() {
    return this.api.get2(`comments`);
  }

  public addComment(comment) {
    return this.api.post2(`comments`, comment);
  }

  public updateComment(id, comment) {
    return this.api.put2(`comments/${id}`, comment);
  }

  public removeComment(id: number) {
    return this.api.delete(`comments/${id}`);
  }

  public getOrganizations() {
    return this.api.get('org/all');
  }

  public getReportTypes() {
    return this.api.get2(`report/types`);
  }

  public getReport(page, size, body) {
    return this.api.post2(`report/executed?page=${page}&size=${size}`, body);
  }

  public getReportforExport(page, size, body) {
    return this.api.postArrayBuffer(`report/executed/export?page=${page}&size=${size}`, body);
  }

  sortDataByField(data, field) {
    return data.sort((a, b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0));
  }

  optionSelect(query: any, searchableArr, searchProp: string, searchProp2: string = null, searchProp3: string = null): any[] {
    const result: any[] = [];
    for (const searchableItem of searchableArr) {
      if (searchableItem[searchProp]) {
        if (searchableItem[searchProp].toLowerCase().indexOf(query.toLowerCase()) > -1) {
          result.push(searchableItem);
        }
      }

      if (searchProp2 && searchableItem[searchProp2]) {
        if (searchableItem[searchProp2].toLowerCase().indexOf(query.toLowerCase()) > -1) {
          result.push(searchableItem);
        }
      }
      if (searchProp3 && searchableItem[searchProp3]) {
        if (searchableItem[searchProp3].toLowerCase().indexOf(query.toLowerCase()) > -1) {
          result.push(searchableItem);
        }
      }
    }
    const unique = [...new Set(result)];
    return unique;
  }
}
