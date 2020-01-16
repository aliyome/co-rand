import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { RoomEffects } from './room.effects';

describe('RoomEffects', () => {
  let actions$: Observable<any>;
  let effects: RoomEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoomEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<RoomEffects>(RoomEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
