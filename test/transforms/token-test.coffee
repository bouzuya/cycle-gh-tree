assert = require 'power-assert'
Rx = require 'rx'
token = require '../../src/transforms/token'

describe 'transforms/token', ->
  it 'works', ->
    actions =
      token:
        save$: Rx.Observable.empty()
        update$: Rx.Observable.empty()
    transform$ = token actions
    state =
      token: {}
    Rx.Observable
      .just state
      .merge transform$
      .scan (state, transform) -> transform state
      .subscribe (state) ->
        assert.deepEqual state,
          token: {}

  it 'works', ->
    actions =
      token:
        save$: Rx.Observable.empty()
        update$: Rx.Observable.from ['abc', 'def']
    transform$ = token actions
    state =
      token: {}
    Rx.Observable
      .just state
      .merge transform$
      .scan (state, transform) -> transform state
      .toArray()
      .subscribe (a) ->
        assert a.length is 3
        [s1, s2, s3] = a
        assert.deepEqual s1,
          token: {}
        assert.deepEqual s2,
          token:
            value: 'abc'
        assert.deepEqual s3,
          token:
            value: 'def'

  it 'works', ->
    actions =
      token:
        save$: Rx.Observable.just()
        update$: Rx.Observable.empty()
    transform$ = token actions
    state =
      token:
        value: 'abc'
    Rx.Observable
      .just state
      .merge transform$
      .scan (state, transform) -> transform state
      .toArray()
      .subscribe (a) ->
        assert a.length is 2
        [s1, s2] = a
        assert.deepEqual s1,
          token:
            value: 'abc'
        assert.deepEqual s2,
          settings:
            token: 'abc'
          token:
            value: null
