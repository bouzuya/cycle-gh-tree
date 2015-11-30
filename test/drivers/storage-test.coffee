assert = require 'power-assert'
sinon = require 'sinon'
{ Observable } = require 'rx'
{ Storage } = require '../../src/utils/storage'
{ makeStorageDriver } = require '../../src/drivers/storage'

describe 'drivers/storage', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()
    @getItem = @sinon.spy Storage.prototype, 'getItem'
    @setItem = @sinon.spy Storage.prototype, 'setItem'

  afterEach ->
    @sinon.restore()

  context 'get initial state', ->
    it 'works', (done) ->
      data = [null]
      data$ = Observable.from data
      driver = makeStorageDriver()
      response$ = driver data$
      response$.toArray().subscribe (a) =>
        assert a.length is 1
        [d1] = a
        assert.deepEqual d1, {}
        assert @getItem.callCount is 0
        assert @setItem.callCount is 0
        done()
      , done
      null

  context 'get initial state (no data)', ->
    it 'works', (done) ->
      data = [null]
      data$ = Observable.from data
      driver = makeStorageDriver()
      response$ = driver data$
      response$.toArray().subscribe (a) =>
        [d1] = a
        assert a.length is 1
        assert.deepEqual d1, {}
        assert @getItem.callCount is 0
        assert @setItem.callCount is 0
        done()
      , done
      null

  context 'get initial state (data exists)', ->
    it 'works', (done) ->
      data = [null]
      data$ = Observable.from data
      driver = makeStorageDriver(baz: 123)
      response$ = driver data$
      response$.toArray().subscribe (a) =>
        [d1] = a
        assert a.length is 1
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
      data$ = Observable.from data
      driver = makeStorageDriver()
      response$ = driver data$
      response$.toArray().subscribe (a) =>
        [d1] = a
        assert a.length is 1 # latest only
        assert.deepEqual d1, baz: 123
        done()
      , done
      null

  context 'set data (duplication)', ->
    it 'works', (done) ->
      data = [
        foo: 'bar'
      ,
        foo: 'bar'
      ]
      data$ = Observable.from data
      driver = makeStorageDriver()
      response$ = driver data$
      response$.toArray().subscribe (a) =>
        [d1] = a
        assert a.length is 1
        assert.deepEqual d1, foo: 'bar'
        assert @getItem.callCount is 0
        assert @setItem.callCount is 1
        assert.deepEqual @setItem.getCall(0).args, ['foo', '"bar"']
        done()
      , done
      null
