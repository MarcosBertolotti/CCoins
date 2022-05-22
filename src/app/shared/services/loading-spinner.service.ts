import { DOCUMENT } from "@angular/common";
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Inject, Injectable, Injector } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LoadingSpinnerComponent } from "../components/loading-spinner/loading-spinner.component";

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService {
  /**
   * BehaviorSubject that emits when the spinner is shown or hidden.
   */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  /**
   * This attribute is used to store the spinner component reference.
   */
  private spinnerComponentRef!: ComponentRef<LoadingSpinnerComponent>;
  
  /**
   * This method is used to get the observable that emits when the
   * spinner is shown or hidden.
   */
  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
  
  /**
   * This method is used to set the loading state.
   */
  set isLoading(value: boolean) {
    this.loadingSubject.next(value);
  }
  
  /**
   * This method is used to get the loading state.
   */
  get isLoading(): boolean {
    return this.loadingSubject.value;
  }
  
  customColor: boolean = false;

  constructor(
  private injector: Injector,
  private applicationRef: ApplicationRef,
  private resolver: ComponentFactoryResolver,
  @Inject(DOCUMENT) private document: Document,
  ) {}
  
  /**
   * This method is used to show or hide the spinner.
   */
  toggleSpinner(): void {
    if (this.isLoading) {
      this.hideSpinner();
    } else {
      this.showSpinner();
    }
  }
  
  /**
   * This method is used to show the spinner.
   * It will create the spinner component and attach it to the DOM.
   */
  private showSpinner(): void {
    if (!this.isLoading) {
      this.isLoading = true;

      this.spinnerComponentRef = this.resolver
        .resolveComponentFactory(LoadingSpinnerComponent)
        .create(this.injector);
        
      this.applicationRef.attachView(this.spinnerComponentRef.hostView);
      
      const domElement = (this.spinnerComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    if(this.customColor) this.setCustomColor(domElement);

      this.document.body.appendChild(domElement);
    }
  }
  
  /**
   * This method is used to hide the spinner.
   * It will remove the spinner component from the DOM and destroy it.
   */
  private hideSpinner(): void {
    if (this.isLoading) {
      this.isLoading = false;
      this.applicationRef.detachView(this.spinnerComponentRef.hostView);
      this.spinnerComponentRef.destroy();
    }
  }

  private setCustomColor(domElement: HTMLElement) {
    const loaderSpinnerColor = localStorage.getItem('loaderSpinnerColor') || '#ffffff';
    const loaderBackgroundColor = localStorage.getItem('loaderSpinnerBackgroundColor') || 'rgba(41, 41, 59, 0.75)';

    domElement.style.background = loaderBackgroundColor;

    const loadingSpinner = domElement.querySelectorAll('.spinner > div');

    loadingSpinner.forEach(element => {
      const el = (element as HTMLElement);
      el.style.background =  loaderSpinnerColor;
    });
  }
}

