// @ts-nocheck
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SortEventArgs } from '@syncfusion/ej2-grids';
import { sampleData } from '../jsontreegriddata';

import { ChangeEventArgs, DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import {
  ColumnChooserService,
  ContextMenuService,
  EditService,
  ExcelExportService,
  PageService,
  PdfExportService,
  ReorderService,
  ResizeService,
  SortService,
  InfiniteScrollService
} from '@syncfusion/ej2-angular-treegrid';
import { EmitType } from '@syncfusion/ej2-base';
import { EditSettingsModel } from '@syncfusion/ej2-treegrid';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    SortService,
    ReorderService,
    ResizeService,
    ColumnChooserService,
    PageService,
    EditService,
    ExcelExportService,
    PdfExportService,
    ContextMenuService,
    InfiniteScrollService
  ],
})

export class AppComponent implements OnInit {
  public contextMenuItems: any = [];
  public editing: EditSettingsModel = {};
  public toolbar: Array<string> = [];
  public editparams: Object = {};
  public copyRow = null;
  public copyRowIndex = null;
  public cellIndex: number;
  public rowIndex: any = null;
  public sortSettings: Object | any = {};
  public currentRowId: any = null;
  public currentIndex: any = null;

  public data: any = [];
  public pageSettings: Object = {};
  public selectionSettings: Object = {};
  public filterSettings: Object = {};
  public filteredData: Object = {};
  public filteredFields: Object = {};

  public dropDownFilter: DropDownList = {};

  @ViewChild('taskID') public taskID: CheckBoxComponent;
  @ViewChild('taskName') public taskName: CheckBoxComponent;
  @ViewChild('startDate') public startDate: CheckBoxComponent;
  @ViewChild('endDate') public endDate: CheckBoxComponent;
  @ViewChild('duration') public duration: CheckBoxComponent;
  @ViewChild('progress') public progress: CheckBoxComponent;
  @ViewChild('priority') public priority: CheckBoxComponent;

  public hideAddDialog: EmitType<object> = () => {
    this.addRowDialog.hide();
  };

  public deleteColButtons: Object = [
    {
      click: this.hideAddDialog.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
    {
      click: this.hideAddDialog.bind(this),
      buttonModel: {
        content: 'Cancel',
      },
    },
  ];

  public form: FormGroup;

  @ViewChild('addRowDialog') public addRowDialog: any;

  public columnToEdit = '';

  @ViewChild('treegrid') public treeGridObj: any;

  @ViewChild('addColumnDialog') public addColumnDialog: DialogComponent;

  @ViewChild('editColumnDialog') public editColumnDialog: DialogComponent;

  public targetElement: HTMLElement;

  public deleteColTargetElement: HTMLElement;

  public skillForm: FormGroup;

  public editColumnFormGroup: FormGroup;

  @ViewChild('dropdown') public dropdownObject: DropDownListComponent;
  public sportsData: Array<Object> = [
    { key: 'numericedit', value: 'Numeric' },
    { key: 'datepickeredit', value: 'Date' },
    { key: 'stringedit', value: 'String' },
    { key: 'booleanedit', value: 'Boolean' },
  ];
  public fields: Object = { text: 'value', value: 'key' };

  constructor(private readonly fb: FormBuilder) {
    this.addColumnForm();
    this.editColumnForm();
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      taskName: [null],
      startDate: [null],
      endDate: [null],
      duration: [null],
      progress: [null],
      priority: [null],
      // type: [null],
    });

    this.data = sampleData;
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    this.pageSettings = { pageSize: 10 };
    this.selectionSettings = { type: 'Multiple' };

    this.sortSettings = { columns: [{ field: 'taskID', direction: 'Ascending' }] };

    this.contextMenuItems = [
      { text: 'Edit this column', target: '.e-gridheader', id: 'edit-column' },
      { text: 'Delete this column', target: '.e-gridheader', id: 'delete-column' },
      { text: 'Add new column', target: '.e-gridheader', id: 'add-column' },
      { text: 'Add Row', target: '.e-content', id: 'add-row' },
      { text: 'Copy', target: '.e-content', id: 'customCopy' },
      { text: 'Paste', target: '.e-content', id: 'customPaste' },
      'AutoFit',
      'AutoFitAll',
      'SortAscending',
      'SortDescending',
      'Edit',
      'Delete',
      'Save',
      'Cancel',
      'PdfExport',
      'ExcelExport',
      'CsvExport',
      'FirstPage',
      'PrevPage',
      'LastPage',
      'NextPage',
    ];
    this.editing = { allowDeleting: true, allowEditing: true, allowAdding: true, mode: 'Row', newRowPosition: 'Child' };

    this.pageSettings = { pageSize: 10 };
    this.editparams = { params: { format: 'n' } };
    this.toolbar = ['ColumnChooser'];

    this.filteredFields = { text: 'mode', value: 'id' };
    this.filteredData = [
      { id: 'Parent', mode: 'Parent' },
      { id: 'Child', mode: 'Child' },
      { id: 'Both', mode: 'Both' },
      { id: 'None', mode: 'None' },
    ];
  }

  public submitRowData() {
    const data = {
      taskID: Math.floor(Math.random() * (99 - 40)) + 40,
      taskName: this.form.controls.taskName.value,
      startDate: this.form.controls.startDate.value,
      endDate: this.form.controls.endDate.value,
      duration: this.form.controls.duration.value,
      progress: this.form.controls.progress.value,
      priority: this.form.controls.priority.value,
      approved: true,
    };
    this.treeGridObj.addRecord(data, this.rowIndex);
    this.addRowDialog.hide();
    this.form.reset();
  }

  public contextMenuClick(args: any): void {
    switch (args.item.id) {
      case 'add-row': {
        this.rowIndex = args.rowInfo.rowIndex;
        this.addRowDialog.show();
        break;
      }
      case 'add-column': {
        this.addColumnDialog.show();
        break;
      }
      case 'customCopy': {
        this.copyRow = args.rowInfo.rowData;
        this.treeGridObj.copy();
        break;
      }

      case 'customPaste': {
        this.copyRowIndex = args.rowInfo.rowIndex;
        this.treeGridObj.addRecord(this.copyRow, this.copyRowIndex);
        break;
      }

      case 'pasteNext': {
        this.treeGridObj.editSettings.newRowPosition = 'Bottom';

        this.copyRowIndex = args.rowInfo.rowIndex;
        this.treeGridObj.addRecord(this.copyRow, this.copyRowIndex);
        break;
      }

      case 'edit-column': {
        this.columnToEdit = args.column.field;
        this.editColumnFormGroup.patchValue({
          name: args.column.headerText,
          type: args.column.editType,
        });
        this.editColumnDialog.show();
        break;
      }
      case 'delete-column': {
        this.treeGridObj.columns.filter((i: { field: string }, x: any) => {
          if (i.field == args.column.field) {
            this.treeGridObj.columns.splice(x, 1);
          }
        });
        this.treeGridObj.refreshColumns();
        break;
      }
      default: {
        break;
      }
    }
  }

  public onOpenDialog = (event: any): void => {
    this.addColumnDialog.show();
  };

  public onCloseAddNewDialog: EmitType<object> = () => {
    this.skillForm.reset();
    this.addColumnDialog.hide();
  };

  public onSubmitAddNewDialog: EmitType<object> = () => {
    this.onAddNewCol();
    this.skillForm.reset();
    this.addColumnDialog.hide();
  };

  public onOpenEditColumnDialog = (event: any): void => {
    this.editColumnDialog.show();
  };

  public hideDeleteDialog: EmitType<object> = () => {
    this.onEditCol();
    this.skillForm.reset();
    this.editColumnDialog.hide();
  };

  public buttons: Object = [
    {
      click: this.onSubmitAddNewDialog.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
    {
      click: this.onCloseAddNewDialog.bind(this),
      buttonModel: {
        content: 'Cancel',
      },
    },
  ];

  public addNewRowbuttons: Object = [
    {
      click: this.submitRowData.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
    {
      click: this.onCloseAddNewRowDialog.bind(this),
      buttonModel: {
        content: 'Cancel',
      },
    },
  ];

  public onCloseAddNewRowDialog() {
    this.form.reset();
    this.addRowDialog.hide();
  }

  public editColButtons: Object = [
    {
      click: this.hideDeleteDialog.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
    {
      click: this.hideDeleteDialog.bind(this),
      buttonModel: {
        content: 'Cancel',
      },
    },
  ];

  public addColumnForm(): void {
    this.skillForm = this.fb.group({
      name: [null, Validators.required],
      type: [Validators.required],
      defaultValue: [null, Validators.required],
    });
  }

  public editColumnForm(): void {
    this.editColumnFormGroup = this.fb.group({
      name: [null, Validators.required],
      type: [Validators.required],
      defaultValue: [null, Validators.required],
    });
  }

  public onAddNewCol(): void {
    this.treeGridObj.columns.push({
      field: this.skillForm.controls.name.value,
      headerText: this.skillForm.controls.name.value,
      textAlign: 'Left',
      editType: this.skillForm.controls.type.value,
    });
    this.treeGridObj.refreshColumns();
  }

  public onEditCol(): void {
    this.treeGridObj.columns.forEach((i: { field: string; headerText: string; editType: string }, x: any) => {
      if (i.field == this.columnToEdit) {
        i.headerText = this.editColumnFormGroup.controls.name.value;
        i.editType = this.editColumnFormGroup.controls.type.value;
      }
    });
    this.treeGridObj.refreshColumns();
  }

  public change(e: ChangeEventArgs): void {
    const mode: any = <string>e.value;
    this.treeGridObj.filterSettings.hierarchyMode = mode;
    this.treeGridObj.clearFiltering();
    this.dropDownFilter.value = 'All';
  }

  public onClickColum(e: MouseEvent, column: any): void {
    if (this[column].checked) {
      this.treeGridObj.sortByColumn(column, 'Ascending', true);
    } else {
      this.treeGridObj.grid.removeSortColumn(column);
    }
  }

  public sort(args: SortEventArgs): void {
    if (args.requestType === 'sorting') {
      for (const columns of this.treeGridObj.getColumns()) {
        for (const sortcolumns of this.treeGridObj.sortSettings.columns) {
          if (sortcolumns.field === columns.field) {
            this.check(sortcolumns.field, true);
            break;
          } else {
            this.check(columns.field, false);
          }
        }
      }
    }
  }

  public check(field: string, state: boolean): void {
    switch (field) {
      case 'taskID':
        this.taskID.checked = state;
        break;
      case 'taskName':
        this.taskName.checked = state;
        break;
      case 'startDate':
        this.startDate.checked = state;
        break;
      case 'endDate':
        this.endDate.checked = state;
        break;
      case 'duration':
        this.duration.checked = state;
        break;
      case 'progress':
        this.progress.checked = state;
        break;
      case 'priority':
        this.priority.checked = state;
        break;
    }
  }
}
