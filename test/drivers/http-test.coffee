assert = require 'power-assert'
Rx = require 'rx'
Fetch = require 'node-fetch'
{ Promise } = require 'es6-promise'
{ makeHTTPDriver } = require '../../src/drivers/http'

describe 'drivers/http', ->
  context 'single request', ->
    beforeEach ->
      # https://fetch.spec.whatwg.org/#response-class
      # type, url, ok, headers, body ...
      status = 200
      statusText = 'OK'
      @response = { status, statusText }
      @requests = [
        id: 1
        url: 'http://example.com'
      ]
      # mock response
      Fetch.Promise = =>
        Promise.resolve @response

    it 'works', (done) ->
      driver = makeHTTPDriver()
      request$ = Rx.Observable.from @requests
      response$ = driver request$
      response$.toArray().subscribe ([response1, response2]) =>
        { request, response } = response1
        assert request is @requests[0]
        assert response is @response
        done()
      , done
      null

  context 'multiple request', ->
    beforeEach ->
      # https://fetch.spec.whatwg.org/#response-class
      # type, url, ok, headers, body ...
      status = 200
      statusText = 'OK'
      @response = { status, statusText }
      @requests = [
        id: 1
        url: 'http://example.com'
      ,
        # duplicated (should be ignored)
        id: 1
        url: 'http://example.com'
      ,
        # null (should be ignored)
        null
      ,
        id: 2
        url: 'http://example.com'
      ]
      # mock response
      Fetch.Promise = =>
        Promise.resolve @response

    it 'works', (done) ->
      driver = makeHTTPDriver()
      request$ = Rx.Observable.from @requests
      response$ = driver request$
      response$.toArray().subscribe ([response1, response2]) =>
        { request, response } = response1
        assert request is @requests[0]
        assert response is @response
        { request, response } = response2
        assert request is @requests[3]
        assert response is @response
        done()
      , done
      null
