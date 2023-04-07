import {AfterViewInit, Component, Input, ViewChild,} from "@angular/core";
import {ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TextFieldModule} from "@angular/cdk/text-field";
import {CommonModule} from "@angular/common";

export type FieldType = "text" | "multiline" | "number" | "date" | "password" | "datetime-local";

@Component({
  selector: "app-text-field",
  templateUrl: "./text-field.component.html",
  styleUrls: ["./text-field.component.scss"],
  // see https://github.com/angular/angular/blob/master/packages/forms/src/directives/default_value_accessor.ts
  providers: [{provide: NG_VALUE_ACCESSOR, multi: true, useExisting: TextFieldComponent}],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextFieldModule],
})
export class TextFieldComponent implements ControlValueAccessor, AfterViewInit {

  @Input() public label: string | undefined;
  @Input() public type: FieldType = "text";

  @ViewChild(DefaultValueAccessor) private delegate: ControlValueAccessor | undefined;

  private cachedOnChangeFn: (() => void) | undefined;
  private cachedOnTouchedFn: (() => void) | undefined;
  private cachedValue: unknown | undefined;
  private cachedDisabledState: boolean | undefined;

  public ngAfterViewInit(): void {
    if (this.delegate) {
      if (this.cachedOnChangeFn !== undefined) this.delegate.registerOnChange(this.cachedOnChangeFn);
      if (this.cachedOnTouchedFn !== undefined) this.delegate.registerOnTouched(this.cachedOnTouchedFn);
      if (this.cachedValue !== undefined) this.delegate.writeValue(this.cachedValue);
      if (this.cachedDisabledState !== undefined) this.delegate.setDisabledState?.(this.cachedDisabledState);
    }
  }

  public registerOnChange(fn: () => void): void {
    if (!this.delegate) this.cachedOnChangeFn = fn;
    else this.delegate.registerOnChange(fn);
  }

  public registerOnTouched(fn: () => void): void {
    if (!this.delegate) this.cachedOnTouchedFn = fn;
    else this.delegate.registerOnTouched(fn);
  }

  public writeValue(value: unknown): void {
    if (!this.delegate) this.cachedValue = value;
    else this.delegate.writeValue(value);
  }

  public setDisabledState(disabled: boolean) {
    if (!this.delegate) this.cachedDisabledState = disabled;
    else this.delegate.setDisabledState?.(disabled);
  }
}
