import { Directive, OnInit, ElementRef, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[stickyHeaderDirective]'
})
export class StickyHeaderDirective {
    @Output() appScrollToEnd = new EventEmitter();
    constructor() { }
    ngOnInit() {
    }
    @HostListener('scroll', ['$event']) private onScroll($event: Event): void {
        var el = $event.srcElement as HTMLDivElement;
        //console.log(el.scrollTop + el.offsetHeight, el.scrollHeight);
        if (el.scrollTop + el.offsetHeight + 1 >= el.scrollHeight) {
            this.appScrollToEnd.emit("scrollToEnd");
        }
    }
}
