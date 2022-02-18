import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import JsBarcode from 'jsbarcode';
import { Subscription } from 'rxjs';
import { barcodeTypes } from './barcode-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  barcodeSelections = barcodeTypes;

  barcodeOptsForm!: FormGroup;

  formChangeSub$!: Subscription;

  invalidMsgHidden = true;
  barcodeDataUrl = '';
  barcodeFileName = 'barcode.png';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    this.formChangeSub$ = this.barcodeOptsForm.valueChanges.subscribe((val) =>
      this.refreshBarcode(val),
    );

    this.refreshBarcode(this.barcodeOptsForm.value);
  }

  ngOnDestroy(): void {
    this.formChangeSub$?.unsubscribe();
  }

  initForm(): void {
    this.barcodeOptsForm = this.fb.group({
      barWidth: [2, [Validators.min(1), Validators.max(4)]],
      barHeight: [100, []],
      barMargin: [10, []],
      bcBgColor: ['#FFFFFF', []],
      bcBarColor: ['#000000', []],
      barTextMargin: [0, [Validators.min(-15), Validators.max(40)]],
      bcFontSize: [20, [Validators.min(8), Validators.max(36)]],
      barcodeType: [this.barcodeSelections[0].symbology, []],
      toEncode: [this.barcodeSelections[0].sampleVal, []],
    });
  }

  refreshBarcode(formValue: any): void {
    const canvas = document.getElementById('barcode-cnv') as HTMLCanvasElement;

    JsBarcode(canvas, formValue.toEncode, {
      width: formValue.barWidth,
      height: formValue.barHeight,
      format: formValue.barcodeType,
      displayValue: true,
      fontSize: 24,
      background: '#ffffff',
      lineColor: '#000000',
      valid: (valid) => {
        this.invalidMsgHidden = valid;
      },
    });

    this.barcodeDataUrl = canvas.toDataURL('image/png');
    this.barcodeFileName = `${formValue.barcodeType}_${formValue.toEncode}.png`;
  }
}
