import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import { LoadingAnimationService } from '../utility/loading-animation/loading-animation.service';
import { ToastMessageService } from '../utility/toast-message/toast-message.service';
import { MenuStructure } from './menu-structure';
import { MenuStructureService } from './menu-structure.service';


@Component({
  selector: 'app-menu-structure',
  templateUrl: './menu-structure.component.html',
})
export class MenuStructureComponent implements OnInit {

  private urlApi: string;

  protected uploadSectionClass: string = ' opacity-100 translate-x-0';
  protected generatorSectionClass: string = ' opacity-0 translate-x-full';
  protected downloadSectionClass: string = ' opacity-0 translate-x-full';


  protected copyFileTSContentForm: FormGroup;

  public menuSettingsForm: FormGroup;

  public parentTempMenuStructures: MenuStructure[];
  public parentMenuStructures: MenuStructure[];
  public parentMenuForm: FormGroup;

  public childTempMenuStructures: MenuStructure[];
  public childMenuStructures: MenuStructure[];
  public childMenuForm: FormGroup;
  private tempChildMenuId: string;
  private tempChildMenuSequence: string;

  protected isParentMenuAppear!: boolean;
  protected isChildMenuAppear!: boolean;

  protected buttonTabActiveClass: string = `border-b-2 
                                            active:border-indigo-500/100 
                                            active:bg-blue-50 
                                            outline-none 
                                            border-indigo-500/100 
                                            bg-blue-50 
                                            active:text-indigo-500/100 
                                            text-indigo-500/100 
                                            hover:border-slate-400
                                            font-medium 
                                            px-4 py-2
                                            rounded-none`;

  protected buttonTabInactiveClass: string = `border-b-2 
                                              border-transparent
                                              active:border-indigo-500/100 
                                              active:bg-blue-50 
                                              focus:outline-none 
                                              focus:border-indigo-500/100 
                                              focus:bg-blue-50 
                                              active:text-indigo-500/100 
                                              focus:text-indigo-500/100 
                                              hover:border-slate-400
                                              text-slate-700
                                              font-medium 
                                              px-4 py-2
                                              rounded-none`;

  protected buttonParentCurrentClass!: string;
  protected buttonChildCurrentClass!: string;

  protected fileTS!: any;
  protected fileTSContent!: any;

  @ViewChild('parentMenuTabButton') parentMenuTabButton!: ElementRef;

  constructor(
    private menuStructureService: MenuStructureService,
    private fb: FormBuilder,
    private loadingAnimationService: LoadingAnimationService,
    private toastMessageService: ToastMessageService) {

    this.urlApi = 'mst-menu-structure';

    this.parentTempMenuStructures = [];
    this.parentMenuStructures = [];
    this.parentMenuForm = this.fb.group({});

    this.childTempMenuStructures = [];
    this.childMenuStructures = [];
    this.childMenuForm = this.fb.group({});
    this.tempChildMenuId = '';
    this.tempChildMenuSequence = '';

    this.menuSettingsForm = this.fb.group({
      parentMenuForm: this.parentMenuForm,
      childMenuForm: this.childMenuForm
    });

    this.copyFileTSContentForm = this.fb.group(
      {
        content: ''
      }
    );

    this.showParentMenu();
  }

  ngOnInit(): void {
    this.parentMenuStructures.push(
      {
        menuId: '',
        menuSequence: '',
        menuDesc: '',
        modulId: '',
        iconClass: '',
        routingPath: ''
      }
    );

    this.parentMenuForm.addControl('form_', this.fb.group(
      {
        menuId: '',
        menuSequence: '',
        menuDesc: '',
        iconClass: '',
      }
    ));
  }

  protected showParentMenu(): void {
    this.buttonParentCurrentClass = this.buttonTabActiveClass;
    this.isParentMenuAppear = true;

    this.buttonChildCurrentClass = this.buttonTabInactiveClass;
    this.isChildMenuAppear = false;
  }

  protected showChildMenu(): void {
    this.buttonParentCurrentClass = this.buttonTabInactiveClass;
    this.isParentMenuAppear = false;

    this.buttonChildCurrentClass = this.buttonTabActiveClass;
    this.isChildMenuAppear = true;
  }

  protected showListParentMenuAll() {
    this.parentMenuStructures = [...this.parentTempMenuStructures];
  }

  protected showListParentMenuWithoutIcon() {
    this.parentTempMenuStructures = [...this.parentMenuStructures];

    this.parentMenuStructures = this.parentMenuStructures.filter(
      (val) => {
        let iconClass: string = this.parentMenuForm
          .controls[`form_${val.modulId}`].value.iconClass;

        return iconClass === null || iconClass === undefined || iconClass.trim() === '';
      }
    );
  }

  protected onSearchParentMenuBySequence(event: any) {
    this.searchParentMenuBySequence(event.target.value);
  }

  private searchParentMenuBySequence(pMenuSequence: string) {

    this.parentMenuStructures = [...this.parentTempMenuStructures];

    if (pMenuSequence.trim() !== '' && pMenuSequence.trim().length > 0) {
      this.parentMenuStructures = this.parentMenuStructures.filter(
        (prMS) => {
          let pKeyMenuSequence = new RegExp(pMenuSequence, 'g');
          let matchLength = prMS.menuSequence?.match(pKeyMenuSequence)?.length;
          return matchLength !== undefined && matchLength !== null && matchLength > 0;
        }
      );
    }
  }

  protected showListChildMenuAll() {
    this.childMenuStructures = [...this.childTempMenuStructures];
  }

  protected showListChildMenuWithoutURL() {
    this.childTempMenuStructures = [...this.childMenuStructures];

    this.childMenuStructures = this.childMenuStructures.filter(
      (val) => {
        let routingPath: string = this.childMenuForm
          .controls[`form_${val.modulId}`].value.routingPath;

        return routingPath === null || routingPath === undefined || routingPath.trim() === '';
      }
    );
  }

  protected onSearchChildMenuById(event: any) {
    this.tempChildMenuId = event.target.value;
    this.searchChildMenuByIdAndSequence(this.tempChildMenuId, this.tempChildMenuSequence);
  }

  protected onSearchChildMenuBySequence(event: any) {
    this.tempChildMenuSequence = event.target.value;
    this.searchChildMenuByIdAndSequence(this.tempChildMenuId, this.tempChildMenuSequence);
  }

  private searchChildMenuByIdAndSequence(pMenuId: string, pMenuSequence: string) {
    this.childMenuStructures = [...this.childTempMenuStructures];

    let pMenuIdPresent: boolean = pMenuId.trim() !== '' && pMenuId.trim().length > 4;

    let pMenuSequencePresent: boolean = pMenuSequence.trim() !== '' && pMenuSequence.trim().length > 0;

    if (pMenuSequencePresent || pMenuIdPresent) {
      this.childMenuStructures = this.childMenuStructures.filter(
        (chMS) => {
          let pKeyMenuId = new RegExp(pMenuId, 'g');
          let pKeyMenuSequence = new RegExp(pMenuSequence, 'g');
          let menuIdMatchLength = chMS.menuId?.match(pKeyMenuId)?.length;
          let menuSequenceMatchLength = chMS.menuSequence?.match(pKeyMenuSequence)?.length;

          let isMenuIdFound = pMenuIdPresent ?
            (menuIdMatchLength !== undefined
              && menuIdMatchLength !== null
              && menuIdMatchLength > 0) :
            !pMenuIdPresent;

          let isMenuSequenceFound: boolean = pMenuSequencePresent ?
            (menuSequenceMatchLength !== undefined
              && menuSequenceMatchLength !== null
              && menuSequenceMatchLength > 0) :
            !pMenuSequencePresent;

          return isMenuIdFound && isMenuSequenceFound;
        }
      );
    }
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  protected upload(file: any): void {
    let fileReader: FileReader = new FileReader();
    let resArrObjJS: any[] = [];
    let ready: boolean = false;
    this.getBase64(file).then(
      data => console.log(data)
    );

    let refreshMenuStructureDatas = () => {
      if (ready) {
        this.menuStructureService.getParentAndChildMenuStructures(this.urlApi, resArrObjJS)
          .subscribe(
            {
              next: (res) => {
                console.log(res);

                let parMenList: MenuStructure[] = MenuStructure.fromApiResponses(res.data.parentMenuStructures);

                let chMenList: MenuStructure[] = MenuStructure.fromApiResponses(res.data.childMenuStructures);

                parMenList.forEach(
                  (menuStructure) => {
                    this.parentMenuForm.addControl(
                      `form_${menuStructure.modulId}`,
                      this.fb.group(
                        {
                          menuId: menuStructure.menuId,
                          variable: menuStructure.variable,
                          menuSequence: menuStructure.menuSequence,
                          menuDesc: menuStructure.menuDesc,
                          iconClass: menuStructure.iconClass,
                        }
                      ));
                  }
                );

                chMenList.forEach(
                  (menuStructure) => {
                    this.childMenuForm.addControl(
                      `form_${menuStructure.modulId}`,
                      this.fb.group(
                        {
                          menuId: menuStructure.menuId,
                          variable: menuStructure.variable,
                          menuSequence: menuStructure.menuSequence,
                          menuDesc: menuStructure.menuDesc,
                          routingPath: menuStructure.routingPath,
                        }
                      ));
                  }
                );

                this.parentMenuStructures = parMenList;
                this.parentTempMenuStructures = [...parMenList];

                this.childMenuStructures = chMenList;
                this.childTempMenuStructures = [...chMenList];

                this.uploadSectionClass = ' transition duration-500 ease-out -translate-x-full opacity-0 ';
                this.generatorSectionClass = ' transition duration-500 ease-in translate-x-0 opacity-100 ';

                this.toastMessageService.success({
                  code: 'Unggah Berhasil.',
                  description: 'Data struktur menu sebelumnya berhasil diunggah.'
                });
              },
              error: (err) => {
                this.toastMessageService.error(err);
                this.loadingAnimationService.hideAnimation();
              },
              complete: () => {
                this.loadingAnimationService.hideAnimation();
              }
            }
          );

        return;
      }
      setTimeout(refreshMenuStructureDatas, 1000);
    };

    refreshMenuStructureDatas();

    fileReader.onload = () => {
      this.loadingAnimationService.showAnimation();

      let res: string = typeof fileReader.result === 'string' ? fileReader.result : '';


      res = res.replace(/(MENU_INFO_MASTER).*?(,)/g, '');
      res = res.replace(/(\/\/).*?(\n)/g, '\n');
      res = res.replace(/(?:\r\n|\r|\n)/g, ' ');

      res.match(/const.*?(;)/g)?.forEach((arrObj) => {
        let isHasObj = false;
        arrObj.trim().match(/(?<=\{).*?(?=\})/g)?.forEach(
          (obj) => {
            let resObjJs: any = {};
            obj.trim().split(',').forEach(
              (field) => {
                if (field.trim().length > 0) {
                  let fieldSet: string[] = field.trim().split(':');
                  let key = fieldSet[0].trim();

                  if (key === 'icon') {
                    key = 'iconClass';
                  }

                  if (key === 'url') {
                    key = 'routingPath';
                  }

                  let value = fieldSet[1].trim().replace(/\'/g, '');

                  resObjJs[key] = value;
                  isHasObj = true

                }
              }
            );
            if(isHasObj){
              let variable = arrObj.trim().match(/const.*?(:)/g)?.[0];
              variable = variable?.replace('const','');
              variable = variable?.replace(':','').trim();
              resObjJs['variable'] = variable;
            }
            resArrObjJS.push(resObjJs);
          });
      });
      
      
      ready = true;
    };

    fileReader.readAsText(file);
  }

  protected generate(pData: any): void {
    let menStructReqBody: MenuStructure[] = [];

    let parentMenuStructures: any = pData.parentMenuForm;
    let childMenuStructures: any = pData.childMenuForm;

    this.loadingAnimationService.showAnimation();

    for (const key in parentMenuStructures) {
      if (Object.prototype.hasOwnProperty.call(parentMenuStructures, key)) {
        if (parentMenuStructures[key].iconClass === '' && parentMenuStructures[key].variable == '') {
          continue;
        }

        menStructReqBody.push(parentMenuStructures[key]);
      }
    }

    for (const key in childMenuStructures) {
      if (Object.prototype.hasOwnProperty.call(childMenuStructures, key)) {
        if (childMenuStructures[key].routingPath === '' && childMenuStructures[key].variable == '') {
          continue;
        }

        menStructReqBody.push(childMenuStructures[key]);
      }
    }
    console.log(menStructReqBody);
    
    this.menuStructureService.downloadMenuInfoTS(this.urlApi, menStructReqBody).subscribe(
      {
        next: (res) => {
          const fileByte = typeof res.data === 'string'
            ? window.atob(res.data) : res.data;

          this.toastMessageService.success();

          this.fileTSContent = fileByte;
          this.fileTS = new Blob([fileByte]);

          this.copyFileTSContentForm.controls['content'].setValue(this.fileTSContent);

          this.generatorSectionClass = ' transition duration-500 ease-out -translate-x-full opacity-0 ';
          this.downloadSectionClass = ' transition duration-500 ease-in translate-x-0 opacity-100 ';
        },
        error: (err) => {
          this.toastMessageService.error(err);
        },
        complete: () => {
          this.loadingAnimationService.hideAnimation();
        }
      }
    );
  }

  protected download() {
    saveAs(this.fileTS, 'menu-info.ts');
  }

  protected copyText(content: string) {
    navigator.clipboard.writeText(content);
  }

  protected onUpload(table: any, file: any) {
    this.urlApi = table;

    if (file === undefined || file === null) {
      this.toastMessageService.error(null, true, {
        code: 'File Belum Diunggah.',
        description: `Anda harus menggungah file terlebih dahulu!`
      });
      return;
    }

    if (!file.name.split('.')[1].match('ts') && !file.type.match('text/vnd.qt.linguist')) {
      this.toastMessageService.error(null, true, {
        code: 'Ektensi File Salah.',
        description: `Ektensi file harus '.ts' dengan tipe 'text/vnd.qt.linguist'!`
      });

      throw `Wrong file type. Extension should be '.ts' with type 'text/vnd.qt.linguist' ! `;
    }

    let arr: any[] = [];

    // table.forEach(
    //   (val: any) => {
    //     arr.push(val);
    //   }
    // );
    this.upload(file);
  }

  protected backToUploadSection() {
    this.generatorSectionClass = ' transition duration-500 ease-out translate-x-full opacity-0 ';
    this.uploadSectionClass = ' transition duration-500 ease-in translate-x-0 opacity-100 ';
  }

  protected backToGenerateSection() {
    this.downloadSectionClass = ' transition duration-500 ease-out translate-x-full opacity-0 ';
    this.generatorSectionClass = ' transition duration-500 ease-in translate-x-0 opacity-100 ';
  }
}
