import { Component, OnInit } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styles: ['.hasColor { color: #1890ff; }', '.hasBorder { border-bottom: 2px solid #fff;}']
})
export class HeaderComponent implements OnInit {
  // menuList: any[] = [
  //   {
  //     link: 'error',
  //     title: '异常任务',
  //     children: [
  //       {
  //         title: '异常任务',
  //         children: [
  //           {
  //             link: '/error',
  //             title: '异常任务',
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     link: 'materials',
  //     title: '物料管理',
  //     children: [
  //       {
  //         title: '试剂管理',
  //         children: [
  //           {
  //             link: '/materials/reagent',
  //             title: '试剂管理',
  //           },
  //           {
  //             link: '/materials/record',
  //             title: '申请记录',
  //           },
  //           {
  //             link: '/materials/useRecord',
  //             title: '使用记录',
  //           },
  //         ]
  //       },
  //       {
  //         title: '配件管理',
  //         children: [
  //           {
  //             link: '/materials/helpManage',
  //             title: '配件管理',
  //           },
  //           {
  //             link: '/materials/helpRecord',
  //             title: '申请记录',
  //           },
  //           {
  //             link: '/materials/helpUseRecord',
  //             title: '使用记录',
  //           },
  //         ]
  //       },
  //       {
  //         title: '工具管理',
  //         children: [
  //           {
  //             link: '/materials/tool',
  //             title: '工具管理',
  //           },
  //           {
  //             link: '/materials/toolRecord',
  //             title: '借用记录',
  //           },
  //         ]
  //       }
  //     ]
  //   }
  // ];
  // activeUrl: string = '';
  constructor(
    public settings: SettingsService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }
  ngOnInit() {
    // 监听路由的活动
    // this.router.events.subscribe((res: any) => {
    //   if (res instanceof NavigationEnd) {
    //     this.activeUrl = this.activatedRoute.snapshot['_routerState'].url;
    //   }
    // })
    // setTimeout(() => {
    //   this.activeUrl = this.activatedRoute.snapshot['_routerState'].url;
    // })
  }
  // goUrl(url: any) {
  //   this.router.navigateByUrl(url);
  // }

}
