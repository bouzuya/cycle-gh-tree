assert = require 'power-assert'
Rx = require 'rx'
updateIssues = require '../../src/actions/update-issues'

describe 'actions/update-issues', ->
  beforeEach ->
    @url = 'https://github.com/bouzuya/blog.bouzuya.net/issues/1'
    @title = 'title 1'
    @number = 1
    issues = [
      html_url: @url
      title: @title
      number: @number
    ]
    response$ = Rx.Observable.just body: JSON.stringify issues
    response$.request =
      url: 'https://api.github.com/repos/bouzuya/blog.bouzuya.net/issues'
    HTTP = Rx.Observable.just response$
    @response = { HTTP }

  it 'works', ->
    { updateIssues$ } = updateIssues @response
    updateIssues$.subscribe (i) =>
      assert.deepEqual i.issues, [
        url: @url
        title: @title
        number: @number
      ]
