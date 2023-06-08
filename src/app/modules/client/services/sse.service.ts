import { Injectable, NgZone } from "@angular/core";
import { EMPTY, Observable, Observer, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { SseEvents } from "../enums/sse-events.enum";
import { ClientService } from "./client.service";

@Injectable({
  providedIn: "root"
})
export class SseService {

  baseApiURl = `${environment.API_URL}/sse`;

  newNotificationSubject = new Subject<string>();

  get newNotification$(): Observable<string> {
    return this.newNotificationSubject.asObservable();
  }

  newLeaderSubject = new Subject<void>();

  get newLeader$(): Observable<void> {
    return this.newLeaderSubject.asObservable();
  }

  constructor(
    private _zone: NgZone,
    private clientService: ClientService,
  ) {}

  getServerSentEvent(): Observable<Partial<MessageEvent<any>>> {
    const me = this.clientService.clientTable;

    if(!me) return EMPTY;

    return new Observable((observer: Observer<Partial<MessageEvent<any>>>) => {
      const eventSource = this.getEventSource(`${this.baseApiURl}/subscribe?partyId=${me?.partyId}&client=${me?.clientIp}`);

      eventSource.addEventListener(SseEvents.ACTUAL_SONG_SPTF, event => {
        observer.next(event);
      });

      eventSource.addEventListener(SseEvents.ACTUAL_VOTES_SPTF, event => {
        observer.next(event);
      });

      eventSource.addEventListener(SseEvents.NEW_WINNER_SPTF, event => {
        observer.next(event);
      });

      eventSource.addEventListener(SseEvents.YOU_WIN_SONG_VOTE_SPTF, event => {
        observer.next(event);
      });

      eventSource.addEventListener(SseEvents.UPDATE_COINS, event => {
        observer.next(event);
        this.sendNotificationEvent((event as any)?.data);
      });

      eventSource.addEventListener(SseEvents.NEW_PRIZE, event => {
        observer.next(event);
        this.sendNotificationEvent((event as any)?.data);
      });

      eventSource.addEventListener(SseEvents.NEW_CLIENT_TO_PARTY, event => {
        observer.next(event);
        this.sendNotificationEvent((event as any)?.data);
      });

      eventSource.addEventListener(SseEvents.NEW_LEADER, event => {
        observer.next(event);
        this.sendNotificationEvent((event as any)?.data);
      });

      eventSource.addEventListener(SseEvents.YOU_ARE_THE_LEADER, event => {
        observer.next(event);
        this.sendNotificationEvent((event as any)?.data);
      });

      eventSource.addEventListener(SseEvents.LOGOUT_CLIENT, event => {
        observer.next(event);
      });
      
      eventSource.addEventListener(SseEvents.LOGOUT_SPOTIFY, event => {
        observer.next(event);
      });

      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };

    });
  }

  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }

  private sendNotificationEvent(notification: string): void {
    if(notification && notification.length > 0)
      this.newNotificationSubject.next(notification);
  }
}