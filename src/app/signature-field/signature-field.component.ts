import { Component, ViewChild, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SignaturePad }                            from 'angular2-signaturepad/signature-pad';
import {Platform}                                  from 'ionic-angular';

import { ScreenOrientation } from 'ionic-native';

/*
  Generated class for the SignatureField component.
  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

@Component({
  selector: 'signature-field',
  templateUrl: 'signature-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureFieldComponent),
      multi: true,
    },
  ],
})
export class SignatureFieldComponent implements ControlValueAccessor {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  @Input()
  public options: Object = {};

  public _signature: any = null;


  @Input()
  public t: any;
  
  // public platform: any;

  // constructor(platform: Platform) {
  //   this.platform = platform;
  // };

  // ngOnInit() {
  //   try{
  //     ScreenOrientation.lockOrientation('landscape');
  //   }catch(e){}
  //   let _this = this;
  //   window.addEventListener("orientationchange", function() {
  //     _this.signaturePad.set('canvasWidth', _this.platform.width() * 0.9);
  //   }, false);
  // }


  get signature(): any {
    return this._signature;
  }

  set signature(value: any) {
    this._signature = value;
    //this.propagateChange(this.signature);
  }

  public writeValue(value: any): void {
    if (!value) {
      return;
    }
    this._signature = value;
    this.signaturePad.fromDataURL(this.signature);
  }

  public registerOnChange(fn: any): void {
    //this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // no-op
  }

  public ngAfterViewInit(): void {
    this.signaturePad.clear();
    this.t.setSignatureFieldComponent(this);
  }

  public drawBegin(): void {
  }

  public drawComplete(): void {
    this.signature = this.signaturePad.toDataURL();
  }

  public setComp(t: any){
  }

  public clearSignature(): void{
    this.signaturePad.clear();
    this.signature = null;
  }

}