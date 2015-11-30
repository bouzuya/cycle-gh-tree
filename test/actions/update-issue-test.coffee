assert = require 'power-assert'
Rx = require 'rx'
updateIssue = require '../../src/actions/update-issue'

describe 'actions/update-issue', ->
  beforeEach ->
    issues1 = [
      html_url: 'https://github.com/bouzuya/blog.bouzuya.net/issues/1'
      title: 'title 1-1'
      number: 1
      body: 'body 1-1'
      assignee: null
      labels: []
    ,
      html_url: 'https://github.com/bouzuya/blog.bouzuya.net/issues/2'
      title: 'title 1-2'
      number: 2
      body: 'body 1-2'
      assignee:
        avatar_url: 'https://github.com/images/error/octocat_happy.gif'
        login: 'octocat'
      labels: []
    ]
    issues2 = [
      html_url: 'https://github.com/bouzuya/bouzuya.net/issues/1'
      title: 'title 2-1'
      number: 1
      body: 'body 2-1'
      assignee:
        avatar_url: 'https://github.com/images/error/octocat_happy.gif'
        login: 'octocat'
      labels: []
    ,
      html_url: 'https://github.com/bouzuya/bouzuya.net/issues/2'
      title: 'title 2-2'
      number: 2
      body: 'body 2-2'
      assignee:
        avatar_url: 'https://github.com/images/error/octocat_happy.gif'
        login: 'octocat'
      labels: []
    ]
    HTTP = Rx.Observable.from [
      request:
        url: 'https://api.github.com/repos/bouzuya/blog.bouzuya.net/issues'
      response:
        json: ->
          Promise.resolve issues1
    ,
      request:
        url: 'https://api.github.com/repos/bouzuya/bouzuya.net/issues'
      response:
        json: ->
          Promise.resolve issues2
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
        user: 'bouzuya'
        repo: 'blog.bouzuya.net'
      ,
        url: 'https://github.com/bouzuya/blog.bouzuya.net/issues/2'
        title: 'title 1-2'
        number: 2
        body: 'body 1-2'
        user: 'bouzuya'
        repo: 'blog.bouzuya.net'
      ,
        url: 'https://github.com/bouzuya/bouzuya.net/issues/1'
        title: 'title 2-1'
        number: 1
        body: 'body 2-1'
        user: 'bouzuya'
        repo: 'bouzuya.net'
      ,
        url: 'https://github.com/bouzuya/bouzuya.net/issues/2'
        title: 'title 2-2'
        number: 2
        body: 'body 2-2'
        user: 'bouzuya'
        repo: 'bouzuya.net'
      ]
