import Cycle from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import intent from './intent';
import model from './model';
import view from './view';

Cycle.run(
  ((responses) => view(model(intent(responses)))),
  {
    DOM: makeDOMDriver('#app')
  }
);
