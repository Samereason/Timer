import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {fromEvent, Observable } from 'rxjs';
import {filter, buffer, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  @ViewChild('waitBtn') waitBtn;

  title = 'Timer';

  public timeValue = "00:00:00";
  private countDown = null;
  private count = 1;
  private intervalId = null;

  constructor() {}

  displayCounter(sec: number) {
    const h = sec/3600 ^ 0;
    const m = (sec-h*3600)/60 ^ 0;
    const s = sec-h*3600-m*60;

    this.timeValue = (h < 10 ? "0" + h : h) + ":" + ( m < 10 ? "0" + m : m) + ":" + ( s < 10 ? "0" + s : s);
  }

  clearCount() {
    clearInterval(this.intervalId);
    this.countDown = null;
    this.intervalId = null;
  }

  startCount() {
    if (!this.countDown) {
      this.countDown = new Observable(subscriber => {
        this.intervalId = setInterval(() => {
          subscriber.next(this.count);
          this.count++;
        }, 1000);
      });

      this.countDown.subscribe(
        value => this.displayCounter(value)
      );
    }
  }

  stopCount() {
    this.displayCounter(0);
    this.count = 1;

    if (this.countDown) {
      this.clearCount();
    }
  }

  reset() {
    this.stopCount();
    this.startCount();
  }

  ngAfterViewInit() {
    let waitBtnClick = fromEvent(this.waitBtn.nativeElement, 'click');

    const click = waitBtnClick.pipe(
      buffer(waitBtnClick.pipe(debounceTime(300))),
      filter(clickArray => clickArray.length === 2)
    );

    click.subscribe(() => {
      if (this.countDown) {
        this.clearCount();
      }
    })
  }
}
