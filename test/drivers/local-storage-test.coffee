assert = require 'power-assert'
sinon = require 'sinon'
Rx = require 'rx'
{ Storage } = require '../../src/utils/storage'
{ makeStorageDriver } = require '../../src/drivers/local-storage'

describe 'drivers/local-storage', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()
    @getItem = @sinon.spy Storage.prototype, 'getItem'
    @setItem = @sinon.spy Storage.prototype, 'setItem'

  afterEach ->
    @sinon.restore()

  context 'get initial state', ->
    it 'works', (done) ->
      data = [null]
      data$ = Rx.Observable.from data
      driver = makeStorageDriver()
      response$ = driver data$
      response$.toArray().subscribe ([d1, d2]) =>
        assert.deepEqual d1, {}
        assert @getItem.callCount is 0
        assert @setItem.callCount is 0
        done()
      , done
      null

  context 'get initial state (no data)', ->
    it 'works', (done) ->
      data = [null]
      data$ = Rx.Observable.from data
      driver = makeStorageDriver()
      response$ = driver data$
      response$.toArray().subscribe ([d1, d2]) =>
        assert.deepEqual d1, {}
        assert @getItem.callCount is 0
        assert @setItem.callCount is 0
        done()
      , done
      null

  context 'get initial state (data exists)', ->
    it 'works', (done) ->
      data = [null]
      data$ = Rx.Observable.from data
      driver = makeStorageDriver(baz: 123)
      response$ = driver data$
      response$.toArray().subscribe ([d1]) =>
        assert.deepEqual d1, baz: 123
        assert @getItem.callCount is 1
        assert.deepEqual @getItem.getCall(0).args, ['baz']
        assert @setItem.callCount is 0
        done()
      , done
      null

  context 'set data', ->
    it 'works', (done) ->
      data = [
        null
      ,
        foo: 'bar'
      ,
        baz: 123
      ]
      data$ = Rx.Observable.from data
      driver = makeStorageDriver()
      response$ = driver data$
      response$.toArray().subscribe ([d1, d2, d3]) =>
        assert.deepEqual d1, {}
        assert.deepEqual d2, foo: 'bar'
        assert.deepEqual d3, baz: 123
        assert @getItem.callCount is 0
        assert @setItem.callCount is 2
        assert.deepEqual @setItem.getCall(0).args, ['foo', '"bar"']
        assert.deepEqual @setItem.getCall(1).args, ['baz', '123']
        done()
      , done
      null
