import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
// import { DelonChartModule } from '@delon/chart';
// import { DelonACLModule } from '@delon/acl';
// import { DelonFormModule } from '@delon/form';
// i18n
// import { TranslateModule } from '@ngx-translate/core';

// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
// import { CountdownModule } from 'ngx-countdown';
// import { UEditorModule } from 'ngx-ueditor';
// import { NgxTinymceModule } from 'ngx-tinymce';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzIconModule } from 'ng-zorro-antd/icon';
// const THIRDMODULES = [NgZorroAntdModule, CountdownModule, UEditorModule, NgxTinymceModule];
const THIRDMODULES = [NgZorroAntdModule];
// #endregion

// #region your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// #endregion
import { TableScrollDirective } from './table-scroll.directive';
import { MultiTitleScrollDirective } from './multi-title-scroll.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    // DelonChartModule,
    // DelonACLModule,
    // DelonFormModule,
    // third libs
    ...THIRDMODULES,
    NzIconModule,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    TableScrollDirective,
    MultiTitleScrollDirective,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    NgxEchartsModule,
    // DelonChartModule,
    // DelonACLModule,
    // DelonFormModule,
    // i18n
    // TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    TableScrollDirective,
    MultiTitleScrollDirective,
    NzIconModule,
  ],
})
export class SharedModule { }
