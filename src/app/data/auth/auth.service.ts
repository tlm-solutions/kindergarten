import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {BehaviorSubject, Observable, Subscription, tap} from "rxjs";
import {AuthResponse, LoginResponse} from "./auth.data";
import {NotificationService} from "@feel/notification";
import {RegionService} from "../region/region.service";
import {StationService} from "../station/station.service";
import {TrackService} from "../track/track.service";
import {UserService} from "../user/user.service";
import {User} from "../user/user.domain";
import {DATACARE_BASE_PATH} from "../api.domain";

const MAX_CACHE_AGE = 1000 * 60 * 5;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private readonly user = new BehaviorSubject<User | null>(null);
  private readonly roles = new BehaviorSubject<Record<string, unknown> | null>(null);

  private lastUpdate = 0;

  private updateSubscription: Subscription | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService,
    private readonly regionService: RegionService,
    private readonly stationService: StationService,
    private readonly trackService: TrackService,
    private readonly userService: UserService,
  ) {
  }

  public ngOnDestroy(): void {
    this.updateSubscription?.unsubscribe();
    this.user.complete();
    this.roles.complete();
  }

  public isUpdateInProgress(): boolean {
    return !!this.updateSubscription;
  }

  public getUser(): Observable<User | null> {
    if (this.lastUpdate < (Date.now() - MAX_CACHE_AGE)) {
      this.forceUpdateCache();
    }

    return this.user.asObservable();
  }

  public getRoles(): Observable<Record<string, unknown> | null> {
    if (this.lastUpdate < (Date.now() - MAX_CACHE_AGE)) {
      this.forceUpdateCache();
    }

    return this.roles.asObservable();
  }

  public login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${DATACARE_BASE_PATH}/auth/login`, {email, password}, {withCredentials: true})
      .pipe(tap(() => this.invalidateCache()));
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${DATACARE_BASE_PATH}/auth/logout`, undefined, {withCredentials: true})
      .pipe(tap(() => this.invalidateCache()));
  }

  public invalidateCache(): void {
    this.lastUpdate = 0;
  }

  private forceUpdateCache(): void {
    if (this.updateSubscription) {
      return;
    }

    this.updateSubscription = this.http.get<AuthResponse>(`${DATACARE_BASE_PATH}/auth`, {withCredentials: true})
      .subscribe({
        next: response => {
          this.lastUpdate = Date.now();

          if (this.user.value?.id !== response.user.id) {
            this.regionService.invalidateCache();
            this.stationService.invalidateCache();
            this.userService.invalidateCache();
          }

          this.user.next(response.user);
          this.roles.next(response.roles);
          this.updateSubscription = undefined;
        },
        error: (err: HttpErrorResponse) => {
          // user is not logged in
          if (err.status == 401) {
            this.lastUpdate = Date.now();
          } else {
            this.notificationService.error($localize`Unable to retrieve login state. See browser console for details.`);
            console.error("Error while retrieving login state: ", err);
          }

          if (this.user.value?.id) {
            this.regionService.invalidateCache();
            this.stationService.invalidateCache();
            this.userService.invalidateCache();
          }

          this.user.next(null);
          this.roles.next(null);
          this.updateSubscription = undefined;
        }
      });
  }
}
