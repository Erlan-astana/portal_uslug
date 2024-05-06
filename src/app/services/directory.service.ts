import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {dic} from '../shared/models/dictionary.model';
import MonitoringContract = dic.MonitoringContract;
import {Location} from '@angular/common';
import SpecReg = dic.SpecReg;

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  monitoringContract: MonitoringContract = null;
  selectedSpecregs: SpecReg[];

  constructor(
    private api: ApiService,
    private location: Location
  ) {
  }

  public goBack() {
    this.location.back();
  }

  getMonitoringContract() {
    return this.monitoringContract;
  }

  setSonitoringContract(mnContract) {
    this.monitoringContract = mnContract;
  }

  setSelectedSpecregs(specregs) {
    this.selectedSpecregs = specregs;
  }

  getSelectedSpecregs() {
    return this.selectedSpecregs;
  }

  public getInCorrespondences(page: number, size: number) {
    return this.api.get2(`correspondences?type=IN&page=${page}&size=${size}`);
  }

  public getOutCorrespondences(page: number, size: number) {
    return this.api.get2(`correspondences?type=OUT&page=${page}&size=${size}`);
  }

  public getCorrespondencesCategories() {
    return this.api.get2(`correspondences/categories`);
  }

  public addCorrespondence(data: any) {
    return this.api.post2(`correspondences`, data);
  }

  public updateCorrespondence(data: any) {
    return this.api.put2(`correspondences/${data.id}`, data);
  }

  public removeCorrespondence(id) {
    return this.api.delete(`correspondences/${id}`);
  }

  public getCorrespondence(id) {
    return this.api.get2(`correspondences/${id}`);
  }

  public getCorrespondenceFiles(id) {
    return this.api.get2(`correspondences/${id}/files`);
  }

  public getAdmDocuments(page: number, size: number) {
    return this.api.get2(`adm-documents?page=${page}&size=${size}`);
  }

  public getSpecregs(page: number, size: number, body) {
    return this.api.post2(`specreg/filter?page=${page}&size=${size}`, body);
  }

  public getduplicates(page: number, size: number, regionId) {
    return this.api.get2(`specreg/duplicates?page=${page}&size=${size}&regionId=${regionId}`);
  }

  public getSpecregsJournal(regionId, page: number, size: number, body = null) {
    return this.api.get2(`specreg/journal/${regionId}?page=${page}&size=${size}`);
  }

  public getSpecregById(id) {
    return this.api.get2(`specreg/${id}`);
  }

  public excludeSpecregs(body) {
    return this.api.post2(`specreg/exclude`, body);
  }

  public rollbackSpecreg(specregId) {
    return this.api.post2(`specreg/rollback/${specregId}`);
  }

  public excludedSpecregs(regionId) {
    return this.api.get2(`specreg/excluded/history/${regionId}`);
  }

  public getSpecregHistoryById(id) {
    return this.api.get2(`specreg/${id}/history`);
  }

  public updateSpecreg(data: any) {
    return this.api.put2(`specreg`, data);
  }

  public saveSpecreg(data: any) {
    return this.api.post2(`specreg`, data);
  }

  public specregRenumetate(regionId) {
    return this.api.post2(`specreg/renumerate/${regionId}`);
  }

  public specregRenumerateHistory(regionId) {
    return this.api.post2(`specreg/renumerate/history/${regionId}`);
  }

  public getSpecregPreliminaries() {
    return this.api.get2(`specreg/preliminary`);
  }

  public getSpecregCommisionFiles(id) {
    return this.api.get2(`specreg/${id}/files/commission`);
  }

  public saveSpecregCommision(data: any) {
    return this.api.post2(`specreg/commission`, data);
  }

  public removeSpecregFile(specregId, fileId) {
    return this.api.delete(`specreg/${specregId}/files/commission/${fileId}`);
  }

  public removeSpecreg(specregId) {
    return this.api.delete(`specreg/${specregId}/`);
  }

  public getAdmDocumentCategories() {
    return this.api.get2(`adm-documents/categories`);
  }

  public getDocument(id) {
    return this.api.get2(`adm-documents/${id}`);
  }

  public addDocument(data: any) {
    return this.api.post2(`adm-documents`, data);
  }

  public updateDocument(data: any) {
    return this.api.put2(`adm-documents/${data.id}`, data);
  }

  public getDocumentFiles(id) {
    return this.api.get2(`adm-documents/${id}/files`);
  }

  public getContracts(page: number, size: number) {
    return this.api.get2(`contracts?page=${page}&size=${size}`);
  }

  public getMonitoringContracts(page: number, size: number, sort: string) {
    return this.api.get2(`monitoring/contracts?by=${sort}&page=${page}&size=${size}`);

  }

  public getContractSubjects() {
    return this.api.get2(`contract-subjects`);
  }

  public getSubjectTemplates(contractSubjectId) {
    return this.api.get2(`contract-templates?contractSubjectId=${contractSubjectId}`);
  }

  public addSubjectTemplates(data: any) {
    return this.api.post2(`contract-templates`, data);
  }

  public updateSubjectTemplates(data: any) {
    return this.api.put2(`contract-templates/${data.id}`, data);
  }

  public removeSubjectTemplate(id) {
    return this.api.delete(`contract-templates/${id}`);
  }

  public addContracts(data: any) {
    return this.api.post2(`contracts`, data);
  }

  public getContract(id) {
    return this.api.get2(`contracts/${id}`);
  }

  public updateContract(data: any) {
    return this.api.put2(`contracts/${data.id}`, data);
  }

  public removeContract(id) {
    return this.api.delete(`contracts/${id}`);
  }

  public getContractExecutions(page: number, size: number) {
    return this.api.get2(`contract-executions?page=${page}&size=${size}`);
  }

  public getContractExecutionsByContractId(page: number, size: number, contractId) {
    return this.api.get2(`contract-executions?page=${page}&size=${size}&contractId=${contractId}`);
  }

  public removeContractExecution(id) {
    return this.api.delete(`contract-executions/${id}`);
  }

  public getContractExecutionById(id) {
    return this.api.get2(`contract-executions/${id}`);
  }

  public addContractExecution(data: any) {
    return this.api.post2(`contract-executions`, data);
  }

  public getCompletedApplications(data: any, page: number, size: number) {
    return this.api.post2(`monitoring/zu?page=${page}&size=${size}`, data);
  }

  public getIntersectApplications(gid, page: number = null, size: number = null) {
    return this.api.get2(`monitoring/zu/${gid}/intersect?page=${page}&size=${size}`);
  }

  public updateContractExecution(data: any) {
    return this.api.put2(`contract-executions/${data.id}`, data);
  }

  public getMyReports(from, to) {
    return this.api.get2(`history/executor-stats?from=${from}&to=${to}`);
  }
}
