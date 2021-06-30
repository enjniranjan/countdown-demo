import { Component, VERSION, Input } from '@angular/core';
import { formatDate } from '@angular/common';

import { BehaviorSubject, timer } from 'rxjs';
import { switchMap, map, takeWhile, pairwise } from 'rxjs/operators';

import {
  trigger,
  transition,
  animate,
  keyframes,
  style
} from '@angular/animations';
@Component({
  selector: 'count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss'],
  animations: [
    trigger('flip', [
      transition('*=>*', [
        animate(
          '.6s',
          keyframes([
            style({ transform: 'rotateX(130deg)', offset: 0 }),
            style({ transform: 'rotateX(0deg)', offset: 0.45 }),
            style({ transform: 'rotateX(7deg)', offset: 0.5 }),
            style({ transform: 'rotateX(0deg)', offset: 0.53 }),
            style({ transform: 'rotateX(5deg)', offset: 0.56 }),
            style({ transform: 'rotateX(0deg)', offset: 0.6 }),
            style({ transform: 'rotateX(0deg)', offset: 0.95 }),
            style({ transform: 'rotateX(0deg)', offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class CountDownComponent {
  change: boolean = false;
  showShadow = [];
  name = 'Angular ' + VERSION.major;
  initialMinutes$ = new BehaviorSubject(20160);

  @Input()
  set minutes(val:any) {
    this.initialMinutes$.next(val);
  }
  value = 0;
  timer$ = this.initialMinutes$.pipe(
    map(minutes => minutes * 60000 + new Date().getTime()),
    switchMap(minutes =>
      timer(0, 1000).pipe(
        takeWhile(() => minutes - new Date().getTime() > 0),
        map(t =>
          formatDate(
            minutes - new Date().getTime(),
            'ddHHmmss',
            'en-US',
            '+0000'
          ).split('')
        ),
        pairwise(),
        map(([old, value]) => {
          return value.map((x, index) => ({ value: x, old: old[index] }));
        })
      )
    )
  );
}
