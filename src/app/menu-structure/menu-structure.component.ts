import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import { LoadingAnimationService } from '../utility/loading-animation/loading-animation.service';
import { ToastMessageService } from '../utility/toast-message/toast-message.service';
import { MenuStructure, ModulType } from './menu-structure';
import { MenuInfo, ModulUrlInfo, UploadParam } from './menu-structure.params';
import { MenuStructureService } from './menu-structure.service';
import { mapMenuInfoData, readMenuData, readModulUrlData } from './menu-stucture.utils';


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

  protected isSyncMenuIconAppear!: boolean;
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

  protected buttonSyncMenuIconClass!: string;
  protected buttonParentCurrentClass!: string;
  protected buttonChildCurrentClass!: string;

  protected fileTS!: any;
  protected fileTSContent!: any;

  public syncMenuIconForm: FormGroup;
  protected menuStructures: MenuStructure[];

  protected menuStructuresWithIconExist: MenuStructure[];
  protected newModulUrlInfoList: MenuStructure[];

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

    this.syncMenuIconForm = this.fb.group({});
    this.menuStructures = [];

    this.menuStructuresWithIconExist = [];
    this.newModulUrlInfoList = [];

    this.menuSettingsForm = this.fb.group({
      parentMenuForm: this.parentMenuForm,
      childMenuForm: this.childMenuForm,
      syncMenuIconForm: this.syncMenuIconForm
    });

    this.copyFileTSContentForm = this.fb.group(
      {
        content: ''
      }
    );

    this.showSyncMenuIcon();
  }

  ngOnInit(): void {
    this.parentMenuStructures.push(
      {
        menuId: '',
        menuSequence: '',
        menuDesc: '',
        modulId: '',
        iconClass: '',
        routingPath: '',
        variable: ''
      }
    );

    this.parentMenuForm.addControl('form_', this.fb.group(
      {
        menuId: '',
        menuSequence: '',
        menuDesc: '',
        iconClass: '',
        variable: ''
      }
    ));
  }

  protected showSyncMenuIcon(): void {
    this.buttonSyncMenuIconClass = this.buttonTabActiveClass;
    this.isSyncMenuIconAppear = true;

    this.buttonParentCurrentClass = this.buttonTabInactiveClass;
    this.isParentMenuAppear = false;

    this.buttonChildCurrentClass = this.buttonTabInactiveClass;
    this.isChildMenuAppear = false;
  }

  protected showParentMenu(): void {
    this.buttonParentCurrentClass = this.buttonTabActiveClass;
    this.isParentMenuAppear = true;

    this.buttonSyncMenuIconClass = this.buttonTabInactiveClass;
    this.isSyncMenuIconAppear = false;

    this.buttonChildCurrentClass = this.buttonTabInactiveClass;
    this.isChildMenuAppear = false;
  }

  protected showChildMenu(): void {
    this.buttonParentCurrentClass = this.buttonTabInactiveClass;
    this.isParentMenuAppear = false;

    this.buttonSyncMenuIconClass = this.buttonTabInactiveClass;
    this.isSyncMenuIconAppear = false

    this.buttonChildCurrentClass = this.buttonTabActiveClass;
    this.isChildMenuAppear = true;
  }

  protected showListParentMenuAll() {
    this.parentTempMenuStructures = [...this.parentMenuStructures];
  }

  protected showListParentMenuWithoutIcon() {
    this.parentTempMenuStructures = this.parentMenuStructures.filter(
      (val) => {
        let iconClass: string = this.parentMenuForm
          .controls[`form_${val.modulId}`].value.iconClass;

        return iconClass === null || iconClass === undefined || iconClass.trim() === '';
      }
    );
  }

  protected onSearchParentMenu(event: any) {
    const keyword = event.target.value;
    if (keyword !== undefined && keyword !== null) {
      const keywordEl = keyword.trim().split(/\s+/g);
      const menuId = keywordEl[0];
      const menuSeq = keywordEl[1];

      if (keyword.trim().length > 0) {
        this.parentTempMenuStructures = this.parentMenuStructures.filter(
          (prMS) => {
            if (prMS.menuId?.includes(menuId)) {
              if (menuSeq) {
                return prMS.menuSequence?.includes(menuSeq);
              } else {
                return true;
              }
            }

            return false;
          }
        );
      } else {
        this.parentTempMenuStructures = [...this.parentMenuStructures]
      }
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

  protected upload(file: any, uploadParam?: UploadParam): void {
    let frMenuInfo: FileReader = new FileReader();
    let frModulUrlInfo: FileReader = new FileReader();
    let menuInfoList: MenuInfo[] = [];
    let modulUrlInfoList: ModulUrlInfo[] = [];
    let isMenuInfoListReady: boolean = false;
    let isModulUrlInfoListReady: boolean = false;


    this.menuStructureService.getAll(this.urlApi).subscribe({
      next: (res) => {
        this.menuStructures = MenuStructure.fromApiResponses(res.data);
      },
      error: (err) => {
        this.toastMessageService.error(err);
      }
    })

    frMenuInfo.onload = (ev) => {
      if (typeof ev.target?.result === 'string'
        && uploadParam?.menuListVariableName !== undefined) {

        menuInfoList = readMenuData(ev.target?.result,
          uploadParam?.menuListVariableName);
      }

      isMenuInfoListReady = true;
    }

    frModulUrlInfo.onload = (ev) => {
      if (typeof ev.target?.result === 'string'
        && uploadParam?.modulUrlListVariableName !== undefined) {

        modulUrlInfoList = readModulUrlData(ev.target?.result,
          uploadParam?.modulUrlListVariableName);
      }

      isModulUrlInfoListReady = true;
    }

    let doMapMenuInfoData = () => {
      if (isMenuInfoListReady && isModulUrlInfoListReady) {
        this.loadingAnimationService.showAnimation();

        this.parentMenuStructures = [];
        this.parentTempMenuStructures = [];
        let menuData = mapMenuInfoData(menuInfoList, modulUrlInfoList);
        this.newModulUrlInfoList = menuData.modulUrlInfoList;

        menuData.menuInfoList.forEach(
          (menuInfo) => {
            this.syncMenuIconForm.addControl(
              `sync_form_${menuInfo.menuId}${menuInfo.menuSequence}`,
              this.fb.group(
                {
                  menuId: menuInfo.menuId,
                  menuSequence: menuInfo.menuSequence,
                  iconClass: menuInfo.iconClass,
                  newMenu: null
                }));
          }
        )

        this.menuStructuresWithIconExist = menuData.menuInfoList;

        this.menuStructureService.getExistingMenuStructuresSettings(this.urlApi, menuData)
          .subscribe(
            {
              next: (res) => {
                let menus: any[] = [];

                if (res.data) {
                  menus = res.data;
                  console.log(res.data);
                }

                menus.forEach(
                  (menuStructEl) => {
                    if (menuStructEl.modulType !== undefined
                      && menuStructEl.modulType === ModulType.M.toString()) {
                      if (menuStructEl.iconClass === undefined
                        || menuStructEl.iconClass === null
                        || menuStructEl.iconClass.trim().length === 0) {

                        this.parentMenuStructures.push(
                          MenuStructure.fromApiResponse(menuStructEl));

                        this.parentTempMenuStructures = [...this.parentMenuStructures];

                        this.parentMenuForm.addControl(`form_${menuStructEl.modulId}`,
                          this.fb.group(
                            {
                              menuId: menuStructEl.menuId,
                              menuSequence: menuStructEl.menuSequence,
                              menuDesc: menuStructEl.menuDesc,
                              iconClass: menuStructEl.iconClass
                            }
                          ));
                      }
                    }
                  }
                )

                this.loadingAnimationService.hideAnimation();

                this.uploadSectionClass = ' transition duration-500 ease-out -translate-x-full opacity-0 ';
                this.generatorSectionClass = ' transition duration-500 ease-in translate-x-0 opacity-100 ';

              },
              error: (err) => {
                this.toastMessageService.error(err);
                this.loadingAnimationService.hideAnimation();
              }
            }
          )
      } else {
        setTimeout(doMapMenuInfoData, 1000);
      }
    }

    doMapMenuInfoData();

    if (uploadParam?.fileMenuInfo !== undefined
      && uploadParam?.fileMenuInfo !== null) {
      frMenuInfo.readAsText(uploadParam?.fileMenuInfo);
    } else {
      isMenuInfoListReady = true;
    }

    frModulUrlInfo.readAsText(uploadParam?.fileModulUrlInfo);
  }

  protected generate(pData: any): void {
    let newSyncMenuStructures: MenuStructure[] = [];
    let syncMenuStructures: any[] = [];

    this.loadingAnimationService.showAnimation();

    for (const key in pData.syncMenuIconForm) {
      if (Object.prototype.hasOwnProperty.call(pData.syncMenuIconForm, key)) {
        syncMenuStructures.push(pData.syncMenuIconForm[key])
      }
    }

    syncMenuStructures.forEach(
      (syncMenuStructure) => {
        let newSyncMenuStructure: MenuStructure = {};

        if (syncMenuStructure.newMenu !== null) {
          let newMenu = syncMenuStructure.newMenu;
          newSyncMenuStructure.menuId = newMenu.menuId;
          newSyncMenuStructure.menuSequence = newMenu.menuSequence;
          newSyncMenuStructure.iconClass = syncMenuStructure.iconClass;
        } else {
          let isNewMenuHasNotPresent = newSyncMenuStructures.findIndex((el) => {
            return el.menuId === syncMenuStructure.menuId
              && el.menuSequence === syncMenuStructure.menuSequence;
          }) === -1;

          if (!isNewMenuHasNotPresent) {
            return;
          }

          newSyncMenuStructure.menuId = syncMenuStructure.menuId;
          newSyncMenuStructure.menuSequence = syncMenuStructure.menuSequence;
          newSyncMenuStructure.iconClass = syncMenuStructure.iconClass;
        }

        newSyncMenuStructures.push(newSyncMenuStructure)
      }
    );

    for (const key in pData.parentMenuForm) {
      if (Object.prototype.hasOwnProperty.call(pData.parentMenuForm, key)) {
        let parentMenuStructure = pData.parentMenuForm[key];
        if (parentMenuStructure.iconClass !== undefined
          && parentMenuStructure.iconClass !== null
          && parentMenuStructure.iconClass.trim().length > 0) {

          let newSyncMenuStructure: MenuStructure = {};
          newSyncMenuStructure.menuId = parentMenuStructure.menuId;
          newSyncMenuStructure.menuSequence = parentMenuStructure.menuSequence;
          newSyncMenuStructure.iconClass = parentMenuStructure.iconClass;
          newSyncMenuStructures.push(newSyncMenuStructure);

        }
      }
    }



    this.menuStructureService.downloadMenuInfoTS(this.urlApi, {
      menuInfoList: newSyncMenuStructures,
      modulUrlInfoList: this.newModulUrlInfoList
    }).subscribe(
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
          this.loadingAnimationService.hideAnimation();
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
  }

  protected download() {
    saveAs(this.fileTS, 'menu-info.ts');
  }

  protected copyText(content: string) {
    navigator.clipboard.writeText(content);
  }

  protected onUpload(uploadParam: UploadParam) {
    this.urlApi = uploadParam.table;

    if (uploadParam.modulUrlListVariableName === undefined
      || uploadParam.modulUrlListVariableName.trim().length === 0) {
      this.toastMessageService.error(null, true, {
        code: 'Nama Variable Kosong',
        description: `Nama variable modul-url-info.ts wajib diisi!`
      });
      return;
    }

    if ((uploadParam.fileMenuInfo !== undefined
      || uploadParam.fileMenuInfo !== null) &&
      (uploadParam.menuListVariableName === undefined
        || uploadParam.menuListVariableName.trim().length === 0)) {
      this.toastMessageService.error(null, true, {
        code: 'Nama Variable Kosong',
        description: `Nama variable menu-info.ts wajib diisi!`
      });
      return;
    }

    if (uploadParam.fileModulUrlInfo === undefined
      || uploadParam.fileModulUrlInfo === null) {
      this.toastMessageService.error(null, true, {
        code: 'File Belum Diunggah.',
        description: `Anda harus menggungah file modul-url-info.ts terlebih dahulu!`
      });
      return;
    }

    if (!uploadParam.fileModulUrlInfo.name.split('.')[1].match('ts')
      && !uploadParam.fileModulUrlInfo.type.match('text/vnd.qt.linguist')) {
      this.toastMessageService.error(null, true, {
        code: 'Ektensi File Salah.',
        description: `Ektensi file harus '.ts' dengan tipe 'text/vnd.qt.linguist'!`
      });

      throw `Wrong file type. Extension should be '.ts' with type 'text/vnd.qt.linguist' ! `;
    }

    this.upload(uploadParam.fileMenuInfo, uploadParam);
  }

  protected onSelectAutoCompleteSyncMenuIcon(data: any) {
    let parMenIdx = this.parentMenuStructures.findIndex(
      (parMenEl) => {
        return parMenEl.menuId === data.menuId
          && parMenEl.menuSequence === data.menuSequence;
      }
    );

    if (parMenIdx !== -1) {
      this.parentMenuStructures.splice(parMenIdx, 1);
      this.parentMenuForm.removeControl('form_' + data.modulId)
    }
  }

  protected onBlurAutoCompleteSyncMenuIcon(data: any) {
    if (data !== undefined && data !== null) {
      this.parentMenuStructures.push(
        MenuStructure.fromApiResponse(data));

      this.parentMenuForm.addControl(`form_${data.modulId}`,
        this.fb.group(
          {
            menuId: data.menuId,
            menuSequence: data.menuSequence,
            menuDesc: data.menuDesc,
            iconClass: data.iconClass
          }
        ));
    }
  }

  protected backToUploadSection() {
    this.generatorSectionClass = ' transition duration-500 ease-out translate-x-full opacity-0 ';
    this.uploadSectionClass = ' transition duration-500 ease-in translate-x-0 opacity-100 ';
  }

  protected backToGenerateSection() {
    this.downloadSectionClass = ' transition duration-500 ease-out translate-x-full opacity-0 ';
    this.generatorSectionClass = ' transition duration-500 ease-in translate-x-0 opacity-100 ';
  }

  log(data: any) {
    console.log(data);
  }
}
