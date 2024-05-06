import {
  AfterViewInit,
  OnDestroy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  Input,
  ViewEncapsulation,
  OnChanges
} from '@angular/core';
import {CKEditor5} from '@ckeditor/ckeditor5-angular';
import * as ClassicEditorBuild from '../../../../vendor/ckeditor5/build/classic-editor-with-track-changes.js';
import {MatDialog} from '@angular/material';
import {EditorService} from '../../services/editor.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() text: any;
  @Input() sectionId: any;
  @Input() comments: any;
  @Input() suggestions: any;
  @Input() hasComment: boolean;
  @Output() setText = new EventEmitter<any>();
  @Output() public ready = new EventEmitter<CKEditor5.Editor>();
  @ViewChild('sidebar', {static: true}) private sidebarContainer?: ElementRef<HTMLDivElement>;
  subscription: Subscription;
  toolbarItems: any[] = ['heading', '|', 'fontsize', 'fontfamily', 'alignment', '|', 'bold', 'italic', 'underline', 'strikethrough',
    'removeFormat', 'highlight', '|', 'comment', 'trackChanges', '|', 'link', 'blockquote', 'imageUpload', 'insertTable',
    'mediaEmbed', '|', 'numberedList', 'bulletedList', 'undo', 'redo'];
  public Editor = ClassicEditorBuild;
  public editor?: CKEditor5.Editor;
  currentUser: any;
  public data = '';
  ozoExecutors: any;
  hasOzoExecutor: boolean = false;
  private appData = {
    // The ID of the current user.
    userId: 'user-1',
    // Users data.
    users: [
      {
        id: 'user-1',
        name: 'arch11',
        // Note that the avatar is optional.
      },
    ],
    // Suggestion threads data.
    suggestions: [],
    // Comment threads data.
    comments: this.comments ? this.comments : []
  };

  // Note that Angular refs can be used once the view is initialized so we need to create
  // this container and use in the above editor configuration to work around this problem.
  private sidebar = document.createElement('div');

  private boundRefreshDisplayMode = this.refreshDisplayMode.bind(this);
  private boundCheckPendingActions = this.checkPendingActions.bind(this);

  constructor(
    private editorService: EditorService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.subscription = this.editorService.getMessage().subscribe(text => {
      if (text !== undefined && text !== null && this.editor) {
        this.editor.setData(text);
      }
    });
  }

  public ngOnInit() {
    this.setUsers();
    this.getCurrentUser();
    this.setEditorData();
  }

  public ngOnChanges() {
    this.setEditorData();
  }

  setUsers() {
    if (this.hasComment) {
      if (localStorage.ozoExecutorsForEditor) {
        this.ozoExecutors = JSON.parse(localStorage.ozoExecutorsForEditor);
        this.appData.users = this.ozoExecutors;
      }
    }
  }

  setEditorData() {
    if (this.text) {
      this.data = this.text;
    }
  }

  private getCurrentUser() {
    this.currentUser = this.authService.getUser();
    if (this.hasComment) {
      this.hasOzoExecutor = this.ozoExecutors.some(user => user.name === this.currentUser.username);
      if (this.hasOzoExecutor) {
        this.appData.userId = `user-${this.currentUser.username}`;
      } else {
        this.appData.userId = this.appData.users[0].id;
      }
    } else {
      this.hasOzoExecutor = true;
      this.appData.userId = `user-${this.currentUser.username}`;
      this.appData.users[0].name = this.currentUser.username;
      this.appData.users[0].id = `user-${this.currentUser.id}`;
    }
  }

  public get editorConfig() {
    return {
      sidebar: {
        container: this.sidebar,
      }
    };
  }

  public ngAfterViewInit() {
    if (!this.sidebarContainer) {
      throw new Error('Div container for sidebar was not found');
    }
    this.sidebarContainer.nativeElement.appendChild(this.sidebar);
  }

  public ngOnDestroy() {
    window.removeEventListener('resize', this.boundRefreshDisplayMode);
    window.removeEventListener('beforeunload', this.boundCheckPendingActions);
  }

  public onReady(editor: CKEditor5.Editor) {
    this.editor = editor;
    this.ready.emit(editor);
    // Make the track changes mode the "default" state by turning it on right after the editor initializes.
    if (this.hasComment) {
      this.editor.execute('trackChanges');
    }

    // Prevent closing the tab when any action is pending.
    window.addEventListener('beforeunload', this.boundCheckPendingActions);
    // Switch between inline and sidebar annotations according to the window size.
    window.addEventListener('resize', this.boundRefreshDisplayMode);
    this.refreshDisplayMode();
  }

  private checkPendingActions(domEvt) {
    if (this.editor.plugins.get('PendingActions').hasAny) {
      domEvt.preventDefault();
      domEvt.returnValue = true;
    }
  }

  private refreshDisplayMode() {
    /*const annotations = this.editor.plugins.get('Annotations');
    const sidebarElement = this.sidebarContainer.nativeElement;

    sidebarElement.classList.remove('hidden', 'narrow');
    annotations.switchTo('wideSidebar');*/
  }

  setTextToParentComponent() {
    this.setText.emit(this.data);
  }

  messageChange() {
    this.setTextToParentComponent();
  }
}
