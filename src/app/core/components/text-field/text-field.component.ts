import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {distinctUntilChanged, filter, map, mergeMap, Observable, Subject, Subscription, tap} from "rxjs";
import {CdkTextareaAutosize, TextFieldModule} from "@angular/cdk/text-field";
import {CommonModule} from "@angular/common";
import {IdHolder, NameHolder} from "../../../data/api.domain";
// see https://github.com/angular/angular/blob/master/packages/forms/src/directives/default_value_accessor.ts

export type FieldType = "text" | "multiline" | "number" | "date" | "password" | "datetime-local";
export type SearchFn = (value: string) => Observable<SearchResult>;
export type GetFn = (value: string) => Observable<Entity | undefined>;
export type CreateFn = (value: string) => Observable<Entity>;
export type Entity = IdHolder<any> & NameHolder;

type OnChangeFn = (_: any) => void;
type OnTouchedFn = () => void;

interface SearchRequest {
  query: string;
  silent?: boolean;
}

export interface SearchResult {
  exact?: Entity;
  result: Entity[];
  silent?: boolean;
}

@Component({
  selector: "app-text-field",
  templateUrl: "./text-field.component.html",
  styleUrls: ["./text-field.component.scss"],
  providers: [{provide: NG_VALUE_ACCESSOR, multi: true, useExisting: TextFieldComponent}],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextFieldModule],
})
export class TextFieldComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {

  /* -- input -- */
  @Input() public label?: string;
  // @Input() public disabled?: boolean;
  @Input() public type: FieldType = "text";
  @Input() @HostBinding("class.search") public search?: SearchFn;
  @Input() public get?: GetFn;
  @Input() public create?: CreateFn; // TODO:
  protected searchResult: Entity[] | null = null;
  protected selectedResult = 0;
  protected focus = false;
  protected createAvailable = false;
  protected valueToCreate?: string;
  @Output() private apply = new EventEmitter<Entity>();
  /* -- internal -- */
  @ViewChild(DefaultValueAccessor) private controlValueAccessor?: ControlValueAccessor;
  @ViewChild(CdkTextareaAutosize) private textareaAutoResize?: CdkTextareaAutosize;
  private doSearch = new Subject<SearchRequest>();
  private searchConsumer?: Subscription;
  private missedValue?: any;
  private missedDisabled?: boolean;
  private onChangeFn?: OnChangeFn;
  private onTouchFn?: OnTouchedFn;

  public ngOnInit(): void {
    this.doSearch
      .pipe(
        distinctUntilChanged(),
        // debounceTime(150),
        mergeMap(({query, silent}) => this.search!(query).pipe(map(result => ({...result, silent})))),
        tap(({result}) => {
          this.selectedResult = Math.min(this.selectedResult, result.length - 1);
          this.searchResult = result;
        }),
        filter(({exact, silent}) => {
          this.createAvailable = !exact;

          if (Boolean(this.onChangeFn) && Boolean(exact)) {
            return true;
          }

          if (!silent) this.onChangeFn?.(null);
          else if (!this.searchResult || this.searchResult.length < 2) {
            this.searchResult = null;
          }
          return false;
        }),
      )
      .subscribe(({exact}) => {
        if (!this.searchResult || this.searchResult.length < 2) {
          this.searchResult = null;
        }
        this.apply.emit(exact);
        this.writeValue0(exact!.name);
        this.onChangeFn!(exact!.id);
      });
  }

  public ngOnDestroy(): void {
    this.searchConsumer?.unsubscribe();
  }

  public ngAfterViewInit(): void {
    if (this.missedValue) {
      this.controlValueAccessor?.writeValue(this.missedValue);

      if (this.textareaAutoResize) {
        // without reset the textarea wouldn't shrink
        this.textareaAutoResize.reset();
        this.textareaAutoResize.resizeToFitContent();
      }
    }

    if (this.missedDisabled) {
      this.controlValueAccessor?.setDisabledState?.(true);
    }

    this.controlValueAccessor?.registerOnChange(this.onChange);
    if (this.onTouchFn) this.controlValueAccessor?.registerOnTouched(this.onTouchFn);
  }

  /* -- implementation: ControlValueAccessor - delegate to Angular Implementation -- */

  public writeValue(value: never): void {
    if (this.get && value) {
      this.get(value)
        .subscribe({
          next: entity => this.writeValue0(entity?.name ?? value),
          error: console.error,
        });
      return;
    }

    this.writeValue0(value);
  }

  public registerOnChange(fn: OnChangeFn): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    if (this.controlValueAccessor) this.controlValueAccessor.registerOnTouched(fn);
    else this.onTouchFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (this.controlValueAccessor) this.controlValueAccessor.setDisabledState?.(isDisabled);
    else this.missedDisabled = isDisabled;
  }

  protected trackBy<T>(index: number, {id}: IdHolder<T>): T {
    return id;
  }

  protected onKeydown(event: KeyboardEvent) {
    if (!this.search) {
      return;
    }

    switch (event.key) {
      case "Enter":
        this.selectResult(event, this.selectedResult);
        break;
      case "ArrowDown":
      case "ArrowRight":
        if (this.searchResult) {
          this.selectedResult++;
          event.preventDefault();

          // start from top
          const max = this.createAvailable ? this.searchResult.length + 1 : this.searchResult.length;

          if (this.selectedResult === max) {
            this.selectedResult = 0;
          }
        }
        break;
      case "ArrowUp":
      case "ArrowLeft":
        if (this.searchResult) {
          this.selectedResult--;
          event.preventDefault();

          // start from bottom
          if (this.selectedResult === -1) {
            this.selectedResult = this.createAvailable ? this.searchResult.length : this.searchResult.length - 1;
          }
        }
    }
  }

  protected hoverResult(i: number): void {
    this.selectedResult = i;
  }

  protected selectResult(event: Event, i: number): void {
    if (i === (this.searchResult?.length ?? 0) && this.create) {
      this.create(this.valueToCreate!)
        .subscribe(entity => {
          this.apply.emit(entity);
          this.onChangeFn?.(entity.id);
          this.writeValue0(entity.name);
          this.doSearch.next({query: entity.name, silent: true});
        });
      event.preventDefault();
      return;
    }

    const selected = this.searchResult?.[i];

    if (selected) {
      this.apply.emit(selected);
      this.onChangeFn?.(selected.id);
      this.writeValue0(selected.name);
      this.doSearch.next({query: selected.name, silent: true});
      event.preventDefault();
    }
  }

  protected onFocus(): void {
    this.focus = true;
  }

  protected onBlur(): void {
    // without timeout: autocomplete diapers before click event
    setTimeout(() => this.focus = false, 500);
  }

  private onChange = (value: any): void => {
    if (!this.search) {
      this.searchResult = null;
      this.onChangeFn?.(value);
      return;
    }

    if (this.create) {
      this.valueToCreate = value;
    }

    const trimmed = value.trim();

    if (!trimmed.length) {
      this.searchResult = null;
      this.onChangeFn?.(null);
      return;
    }

    this.doSearch.next({query: value.toLowerCase()});
  };

  private writeValue0(value: any): void {
    if (this.controlValueAccessor) {
      this.controlValueAccessor.writeValue(value);

      if (this.textareaAutoResize) {
        // without reset the textarea wouldn't shrink
        this.textareaAutoResize.reset();
        this.textareaAutoResize.resizeToFitContent();
      }
    }
    else this.missedValue = value;
  }
}
