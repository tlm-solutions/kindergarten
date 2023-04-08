import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{provide: NG_VALUE_ACCESSOR, multi: true, useExisting: CheckboxComponent}],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class CheckboxComponent implements ControlValueAccessor, AfterViewInit {

  @Input() public label: string | undefined;

  protected onChangeFn: ((checked: boolean | undefined) => void) | undefined;
  protected onTouchedFn: (() => void) | undefined;
  private cachedValue: boolean | undefined;
  private cachedDisabledState: boolean | undefined;

  @ViewChild('input') private input: ElementRef<HTMLInputElement> | undefined;

  constructor(
    private readonly renderer2: Renderer2,
  ) {
  }

  public ngAfterViewInit(): void {
    if (this.input?.nativeElement) {
      if (this.cachedValue) this.renderer2.setProperty(this.input.nativeElement, "checked", this.cachedValue);
      if (this.cachedDisabledState) this.renderer2.setProperty(this.input.nativeElement, "disabled", this.cachedDisabledState);
    }
  }

  public registerOnChange(fn: (checked: boolean | undefined) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  public writeValue(checked: boolean): void {
    if (!this.input) this.cachedValue = checked;
    else this.renderer2.setProperty(this.input.nativeElement, "checked", checked);
  }

  public setDisabledState(disabled: boolean) {
    if (!this.input) this.cachedDisabledState = disabled;
    else this.renderer2.setProperty(this.input.nativeElement, "disabled", disabled);
  }

  protected onInput(): void {
    this.onChangeFn?.(this.input?.nativeElement?.checked);
    this.onTouchedFn?.();
  }
}
