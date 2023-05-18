import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, Observer } from "rxjs";
import { environment } from "src/environments/environment";
import { SseEvents } from "../enums/sse-events.enum";

@Injectable({
  providedIn: "root"
})
export class SseService {

  baseApiURl = `${environment.API_URL}/sse`;

  newDemandSubject = new BehaviorSubject(false);

  get newDemand$(): Observable<boolean> {
    return this.newDemandSubject.asObservable();
  }

  constructor(
    private _zone: NgZone,
  ) {}

  getServerSentEvent(barId: number): Observable<Partial<MessageEvent<any>>> {
    if(!barId) {
      console.error("No se encontró el id del bar subscribirse a sse");
      return EMPTY;
    }
    return new Observable((observer: Observer<Partial<MessageEvent<any>>>) => {
      const eventSource = this.getEventSource(`${this.baseApiURl}/subscribe/owner?barId=${barId}`);

      eventSource.addEventListener(SseEvents.ACTUAL_SONG_SPTF, event => {
        observer.next(event);
      });

      eventSource.addEventListener(SseEvents.REQUEST_SPOTIFY_AUTHORIZATION, event => {
        observer.next(event);
      });

      eventSource.addEventListener(SseEvents.NEW_DEMAND, event => {
        this.newDemandSubject.next(true);
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