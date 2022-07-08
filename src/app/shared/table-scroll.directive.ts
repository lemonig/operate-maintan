import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
@Directive({
  selector: '[appTableScroll]'
})
export class TableScrollDirective implements AfterViewInit, OnDestroy {
  // 滚动元素
  tableHeadEl: any;
  // 滚动元素所在页面的高度
  tableHeadHeight: any;
  constructor(
    public el: ElementRef,
  ) {
  }
  ngAfterViewInit() {
    // 滚动到顶部
    // 防止表格滚动错乱
    window.scrollTo(0, 0);

    this.tableHeadEl = this.el.nativeElement;
    // 页面有两个滚动时兼容
    setTimeout(() => {
      this.tableHeadHeight = this.el.nativeElement.getBoundingClientRect().top;
    })
    window.document.addEventListener('scroll', this.scrollFn);
  }
  ngOnDestroy() {
    window.document.removeEventListener('scroll', this.scrollFn);
  }
  scrollFn = () => {
    this.scrollPage();
  }
  scrollPage() {
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop >= (this.tableHeadHeight - 64)) {
      this.tableHeadEl.style.transform = `translateY( ${scrollTop - (this.tableHeadHeight - 64)}px )`;
    } else {
      this.tableHeadEl.style.transform = `translateY( 0px )`;
    }
  }



}
