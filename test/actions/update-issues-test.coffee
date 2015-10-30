assert = require 'power-assert'
Rx = require 'rx'
updateIssue = require '../../src/actions/update-issue'

describe 'actions/update-issues', ->
  beforeEach ->
    issues1 = [
      html_url: 'https://github.com/bouzuya/blog.bouzuya.net/issues/1'
      title: 'title 1-1'
      number: 1
      body: 'body 1-1'
    ,
      html_url: 'https://github.com/bouzuya/blog.bouzuya.net/issues/2'
      title: 'title 1-2'
      number: 2
      body: 'body 1-2'
    ]
    response1$ = Rx.Observable.just body: JSON.stringify issues1
    response1$.request =
      url: 'https://api.github.com/repos/bouzuya/blog.bouzuya.net/issues'
    issues2 = [
      html_url: 'https://github.com/bouzuya/bouzuya.net/issues/1'
      title: 'title 2-1'
      number: 1
      body: 'body 2-1'
    ,
      html_url: 'https://github.com/bouzuya/bouzuya.net/issues/2'
      title: 'title 2-2'
      number: 2
      body: 'body 2-2'
    ]
    response2$ = Rx.Observable.just body: JSON.stringify issues2
    response2$.request =
      url: 'https://api.github.com/repos/bouzuya/bouzuya.net/issues'
    HTTP = Rx.Observable.from [
      response1$
      response2$
    ]
    @response = { HTTP }

  it 'works', ->
    { updateIssue$ } = updateIssue @response
    updateIssue$
    .take(4)
    .reduce(((a, i) -> a.concat i), [])
    .subscribe (a) ->
      assert.deepEqual a, [
        url: 'https://github.com/bouzuya/blog.bouzuya.net/issues/1'
        title: 'title 1-1'
        number: 1
        body: 'body 1-1'
      ,
        url: 'https://github.com/bouzuya/blog.bouzuya.net/issues/2'
        title: 'title 1-2'
        number: 2
        body: 'body 1-2'
      ,
        url: 'https://github.com/bouzuya/bouzuya.net/issues/1'
        title: 'title 2-1'
        number: 1
        body: 'body 2-1'
      ,
        url: 'https://github.com/bouzuya/bouzuya.net/issues/2'
        title: 'title 2-2'
        number: 2
        body: 'body 2-2'
      ]
