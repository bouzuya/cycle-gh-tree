assert = require 'power-assert'
{ Storage } = require '../../src/utils/storage'

describe 'utils/storage', ->
  it 'works', ->
    storage = new Storage()

    # initial state
    assert storage.length is 0

    # add value
    storage.setItem('foo', 123)
    assert storage.length is 1
    assert storage.key(0) is 'foo'
    assert storage.getItem('foo') is 123

    # add value
    storage.setItem('bar', '456')
    assert storage.length is 2
    assert storage.key(0) is 'foo'
    assert storage.key(1) is 'bar'
    assert storage.getItem('foo') is 123
    assert storage.getItem('bar') is '456'

    # remove value
    storage.removeItem('foo')
    assert storage.length is 1
    assert storage.key(0) is 'bar'
    assert storage.getItem('bar') is '456'

    # update value
    storage.setItem('bar', '789')
    assert storage.length is 1
    assert storage.key(0) is 'bar'
    assert storage.getItem('bar') is '789'

    # clear values
    storage.setItem('baz', 123)
    storage.clear()
    assert storage.length is 0
