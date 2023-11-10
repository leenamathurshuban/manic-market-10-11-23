import {Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy, AfterViewInit }from "@angular/core";
import { CdkPortal, DomPortalHost } from "@angular/cdk/portal";
import { Title } from "@angular/platform-browser";
  

@Component({
selector: "window",
template: `
    <ng-container *cdkPortal>
    <ng-content></ng-content>
    </ng-container>
`
})

export class WindowComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(CdkPortal) portal: CdkPortal;
    externalWindow: any;

    constructor (
        private titleService: Title,
        private componentFactoryResolver: ComponentFactoryResolver,
        private applicationRef: ApplicationRef,
        private injector: Injector
    ) {
        
    }

    ngOnInit() {
         
    }
    
    ngAfterViewInit() {
         
        this.externalWindow = window.open('','',"toolbar=yes,scrollbars=yes,resizable=yes,top=80,left=300,width=700,height=529",);
        this.externalWindow.document.write('<html><head><title>Manic Market</title><link rel="icon" sizes="16x16" type="image/x-icon" href="favicon.ico"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"><link rel="stylesheet" type="text/css" href="/assets/css/style.css" ><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" /></head><body><script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script><script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"></script></body></html>');
        this.externalWindow.document.write('<html><head><link rel="icon" sizes="16x16" type="image/x-icon" href="favicon.ico"><link rel="stylesheet" href="/assets/css/font-awesome.min.css" type="text/css"><link rel="stylesheet" type="text/css" href="/assets/css/style.css"></head><body class="chat_windows">');
        const host = new DomPortalHost(
        this.externalWindow.document.body,
        this.componentFactoryResolver,
        this.applicationRef,
        this.injector
        
        );
        
        host.attach(this.portal);
        
    }

    ngOnDestroy() {
        this.externalWindow.close();
    }

}
  