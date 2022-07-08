import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
@Directive({
  selector: '[appMultiTitleScroll]'
})
export class MultiTitleScrollDirective implements AfterViewInit, OnDestroy {
  tableHeadEl: any;
  tableHeadHeight: any;
  siblingHead: any[] = [];
  constructor(
    public el: ElementRef,
  ) {
  }
  ngAfterViewInit() {
    // 滚动到顶部
    // 防止表格滚动错乱
    window.scrollTo(0, 0);

    this.tableHeadEl = this.el.nativeElement;
    this.siblingHead = Array.from(this.tableHeadEl.parentNode.children).reverse();
    // 页面有两个滚动时兼容
    setTimeout(() => {
      this.tableHeadHeight = this.el.nativeElement.getBoundingClientRect().top;
    })
    window.document.addEventListener('scroll', this.scrollFn);
  }
  ngOnDestroy() {
    window.document.removeEventListener('scroll', this.scrollFn)
  }
  scrollFn = () => {
    this.scrollPage();
  }
  scrollPage() {
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop >= (this.tableHeadHeight - 64)) {
      this.siblingHead.map((item: any) => {
        item.style.transform = `translateY( ${scrollTop - (this.tableHeadHeight - 64)}px )`;
      })
      // this.tableHeadEl.style.transform = `translateY( ${scrollTop - (this.tableHeadHeight - 64)}px )`;
    } else {
      this.siblingHead.map((item: any) => {
        item.style.transform = `translateY( 0px )`;
      })
      // this.tableHeadEl.style.transform = `translateY( 0px )`;
    }
  }

}
