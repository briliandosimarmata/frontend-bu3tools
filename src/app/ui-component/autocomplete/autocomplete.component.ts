import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupName } from '@angular/forms';

@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements OnInit {

  @ViewChild('autoCompleteInput') protected inputElement!: ElementRef;

  @Input() suggestionDatas: any[] = [];
  @Input() labelKey: string = '';
  @Input() valueKey: string = '';
  @Input() otherDescKey: string = '';
  @Input() fieldName!: string;
  @Output() onSelect: EventEmitter<any> = new EventEmitter(false);
  @Output() onBlur: EventEmitter<any> = new EventEmitter(false);

  protected tempSuggestionDatas: any[] = [];
  protected isHoverOnOptions: boolean = false;

  private selectedData: any = null;

  constructor(private parentForm: FormGroupName) {
    if (this.parentForm.control) {
      if (!this.parentForm.control.contains(this.fieldName)) {
        throw `Form control with name ${this.fieldName} does not exists`;
      }
    }
  }

  ngOnInit(): void { }

  protected doFind(keyword?: string) {
    if (keyword != null && keyword != undefined) {
      if (keyword.length > 0) {
        this.parentForm.control.controls[this.fieldName].setValue(null);
        let keywordEl = keyword.trim().split(/\s+/g);
        this.tempSuggestionDatas = this.suggestionDatas.filter(
          (dataEl) => {
            let label = keywordEl[0];
            let value = keywordEl[1];

            if (dataEl[this.labelKey]?.includes(label)) {
              if (value) {
                return dataEl[this.valueKey]?.includes(value);
              } else {
                return true;
              }
            }

            return false;
          }
        ).map(
          (dataEl) => {
            let label = dataEl[this.labelKey]?.replace(`${keywordEl[0]}`, `<b>${keywordEl[0]}</b>`);
            let value = dataEl[this.valueKey]?.replace(`${keywordEl[1]}`, `<b>${keywordEl[1]}</b>`);
            let otherDesc = `${this.otherDescKey.length > 0 ? ` - ${dataEl[this.otherDescKey]}` : ''}`;

            return {
              inputLabel: `${dataEl[this.labelKey]} - ${dataEl[this.valueKey]}${otherDesc}`,
              label: `${label} - ${value}${otherDesc}`,
              data: dataEl
            }
          }
        )
      } else {
        this.parentForm.control.controls[this.fieldName].setValue(null);
        this.tempSuggestionDatas = [];
      }
    }
  }

  protected setAutocompleteInputLabel(
    label: string, value: any, inputEl: any) {
    this.isHoverOnOptions = false;
    inputEl.value = label;
    this.parentForm.control.controls[this.fieldName].setValue(value);
    this.selectedData = value;

    this.tempSuggestionDatas = [];
    this.onSelect.emit(value);
  }

  protected onBlurInput(inputEl: any) {
    if (this.tempSuggestionDatas.length > 0 && !this.isHoverOnOptions) {
      let tempSuggestionData = this.tempSuggestionDatas[0];
      let value = tempSuggestionData.data;
      this.inputElement.nativeElement.value = tempSuggestionData.inputLabel;
      this.parentForm.control.controls[this.fieldName].setValue(value);
      this.selectedData = value;
      this.onSelect.emit(value);
    }

    if (!this.isHoverOnOptions) {
      this.tempSuggestionDatas = [];
      if (this.parentForm.control.controls[this.fieldName].value == null) {
        inputEl.value = '';
        this.onBlur.emit(this.selectedData);
        this.selectedData = null;
      } else {
        this.onBlur.emit(null);
      }
    }
  }

  protected setHoverConditionOnOptions(value: boolean) {
    this.isHoverOnOptions = value;
  }

  public setSelectedData(value: any) {
    this.parentForm.control.controls[this.fieldName].setValue(value);
    let otherDesc = `${this.otherDescKey.length > 0 ? ` - ${value[this.otherDescKey]}` : ''}`;
    const labelInput = `${value[this.labelKey]} - ${value[this.valueKey]}${otherDesc}`;
    this.inputElement.nativeElement.value = labelInput;
    this.selectedData = value;
  }

  protected onTabInput(inputEl: any) {
    if (this.tempSuggestionDatas.length > 0 && !this.isHoverOnOptions) {
      let tempSuggestionData = this.tempSuggestionDatas[0];
      let value = tempSuggestionData.data;
      inputEl.value = tempSuggestionData.inputLabel;
      this.parentForm.control.controls[this.fieldName].setValue(value);
      this.selectedData = value;
      this.onSelect.emit(value);
    }
  }

}
