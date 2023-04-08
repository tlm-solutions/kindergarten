import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild,} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
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

  protected onChangeFn: ((checked: string | number | Date | null | undefined) => void) | undefined;
  protected onTouchedFn: (() => void) | undefined;
  private cachedValue: string | number | Date | null | undefined;
  private cachedDisabledState: boolean | undefined;

  @ViewChild('textarea') private textarea: ElementRef<HTMLTextAreaElement> | undefined;
  @ViewChild('input') private input: ElementRef<HTMLInputElement> | undefined;

  constructor(
    private readonly renderer2: Renderer2,
  ) {
  }

  public ngAfterViewInit(): void {
    const field = this.type === 'multiline' ? this.textarea : this.input;

    if (field) {
      if (this.cachedValue) this.setValue(this.cachedValue);
      if (this.cachedDisabledState) this.renderer2.setProperty(field.nativeElement, "disabled", this.cachedDisabledState);
    }
  }

  public registerOnChange(fn: (checked: string | number | Date | null | undefined) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  public writeValue(value: string | number | Date | null | undefined): void {
    const field = this.type === 'multiline' ? this.textarea : this.input;

    if (!field) this.cachedValue = value;
    else this.setValue(value);
  }

  public setDisabledState(disabled: boolean) {
    const field = this.type === 'multiline' ? this.textarea : this.input;
    if (!field) this.cachedDisabledState = disabled;
    else this.renderer2.setProperty(field.nativeElement, "disabled", disabled);
  }

  protected onBlur(): void {
    this.onTouchedFn?.();
  }

  protected onInput(): void {
    this.onChangeFn?.(this.getValue());
  }

  private getValue(): string | number | Date | null | undefined {
    switch (this.type) {
      case "multiline":
        return this.textarea?.nativeElement?.value;
      case "text":
      case "password":
        return this.input?.nativeElement?.value;
      case "number":
        return this.input?.nativeElement.valueAsNumber;
      case "date":
      case "datetime-local":
        return this.input?.nativeElement.valueAsDate;
    }
  }

  private setValue(value: string | number | Date | null | undefined) {
    switch (this.type) {
      case "multiline":
        this.renderer2.setProperty(this.textarea?.nativeElement, "value", value);
        break;
      case "text":
      case "password":
        this.renderer2.setProperty(this.input?.nativeElement, "value", value);
        break;
      case "number":
        this.renderer2.setProperty(this.input?.nativeElement, "valueAsNumber", value);
        break;
      case "date":
      case "datetime-local":
        this.renderer2.setProperty(this.input?.nativeElement, "valueAsDate", value);
        break;
    }
  }
}
