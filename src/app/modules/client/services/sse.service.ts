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

  constructor(
    private _zone: NgZone,
    private clientService: ClientService,
  ) {}

  /*
  subscribe(url: string): Subject<any> {
    let eventSource = new EventSource(url);
    let subscription = new Subject();

    eventSource.addEventListener("ACTUAL_SONG_SPTF", event => {
        console.info("Got event: " + event);
        subscription.next(event);
    });
    return subscription;
}
*/
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
}