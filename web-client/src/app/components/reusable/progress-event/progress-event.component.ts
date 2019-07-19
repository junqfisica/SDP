import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { ServerUrl } from '../../../statics/server-url';
import { LocalStorage } from 'src/app/statics/local-storage';

@Component({
  selector: 'app-progress-event',
  templateUrl: './progress-event.component.html',
  styleUrls: ['./progress-event.component.css']
})
export class ProgressEventComponent implements OnInit, OnDestroy {

  processEventSource: EventSource;

  // Used at the html.
  private progress: number = 0;

  @Input() url: string = ServerUrl.rootUrl + "/api/sse/progress/";
  
  @Output() onProgress = new EventEmitter<number>();
  
  @Output() progressEvent = new EventEmitter<ProgressEventComponent>();

  @Output() onComplete = new EventEmitter<void>();
  
  constructor() {}

  ngOnInit() {
    this.progressEvent.emit(this);
  }

  ngOnDestroy() {
    this.close();
  }

  public startListenProgress(eventId: string, progress?: (value: number) => void, complete?: () => void): void {
    if (this.processEventSource){
      if (this.processEventSource.readyState === this.processEventSource.CONNECTING 
        || this.processEventSource.readyState === this.processEventSource.OPEN) {
        return;
      }
    }
    
    this.progress = 0;
    this.processEventSource = new EventSource(this.url + eventId);
    // Listen to complete event.
    this.processEventSource.addEventListener('complete', e => {
      const msg: MessageEvent = new MessageEvent('complete', e);
      this._onComplete(msg);
      if (complete){
        complete();
      }
    });
    // Listen to messagen events
    this.processEventSource.addEventListener('message', message => {
      this._onProgress(message);
      if (progress){
        progress(message.data);
      }
    });
  }

  private _onComplete(msg: MessageEvent) {
      this.onProgress.emit(msg.data);
      this.progress = msg.data;
      this.close();
      this.onComplete.emit();
  }

  private _onProgress(msg: MessageEvent) {
    if (msg && msg.data){      
      const value = Number(msg.data);
      this.progress = value;
      this.onProgress.emit(value);
    }

    // Connection must be open at this point.
    if( this.processEventSource.readyState !== this.processEventSource.OPEN){
      console.log("Connection with server was closed.");
      this.processEventSource.close();
    }
  }

  get isListenProgress(): boolean {
    if (this.processEventSource){      
      return this.processEventSource.readyState === this.processEventSource.CONNECTING || 
        this.processEventSource.readyState === this.processEventSource.OPEN;
    }
    return false;
  }

  close(){
    if (this.processEventSource){
      this.processEventSource.close();
      this.processEventSource = null;
      // console.log("Event closed");
    }
  }

  setProgress(value: number) {
    this.progress = value;
  }

}
