import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FileService} from './file.service';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private message = new Subject();
  private comment = new Subject();
  private suggestion = new Subject();

  constructor(
    private fileSvc: FileService
  ) {
  }

  sendMessage(text: any) {
    this.message.next(text);
  }

  getMessage(): Observable<any> {
    return this.message.asObservable();
  }

  clearMessage(): void {
    this.message.next();
  }

  sendComment(comment: any) {
    this.comment.next(comment);
  }

  getComments(): Observable<any> {
    return this.comment.asObservable();
  }

  clearComment(): void {
    this.comment.next();
  }

  sendSuggestion(suggestion: any) {
    this.suggestion.next(suggestion);
  }

  getSuggestions(): Observable<any> {
    return this.suggestion.asObservable();
  }

  findSearchTextIndex(text, ind) {
    const preString = 'base64';
    const searchString = '">';
    let preIndex = text.indexOf(preString, ind);
    if (preIndex !== -1) {
      let searchIndex = preIndex + text.substring(preIndex).indexOf(searchString);
      return searchIndex;
    } else {
      return preIndex;
    }
  }

  insert(str, index, value) {
    if (index) {
      let text = this.closeTagImg(str, index, value);
      return text;
    } else {
      return str;
    }
  }

  textRenderAndCorrection(text) {
    if (text) {
      let result = text;
      let searchIndex = 1;
      for (let i = 0; i < 5; i++) {
        searchIndex = this.findSearchTextIndex(result, searchIndex);
        if (searchIndex !== -1) {
          result = this.insert(result, searchIndex + 1, '/');
        } else {
          return result;
        }
      }

      return result;
    }
  }

  closeTagImg(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }
}
