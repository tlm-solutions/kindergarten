import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private shown = new BehaviorSubject(false);

  public isShown(): Observable<boolean> {
    return this.shown.asObservable();
  }

  public isCurrentlyShown(): boolean {
    return this.shown.value;
  }

  public show() {
    setTimeout(() => this.shown.next(true), 50);
  }

  public hide() {
    this.shown.next(false);
  }
}
