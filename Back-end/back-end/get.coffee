mongoose = require 'mongoose'
fs = require('fs');


exports.test = (req,res) -> res.send('id: ' + req.query.id)

exports.getJson = (req,res) ->
  fields = req.body
  res.send(fields)

exports.createUser = (req,res) ->
  Resource = mongoose.model('sites')
  fields = req.body
  console.log(fields)
  r = new Resource(fields)
  r.save (err, resource) ->
    res.send(500, { error: err }) if err?
    res.send(resource)


exports.retrieve = (req, res) ->

  Resource = mongoose.model('sites')
  if req.params.id?
    Resource.findById req.params.id, (err, resource) ->
      res.send(500, { error: err }) if err?
      res.send(resource) if resource?
      res.send(404)
  else
    Resource.find {}, (err, coll) ->
      res.send(coll)


exports.update = (req, res) ->
  Resource = mongoose.model('sites')
  fields = req.body

  Resource.findByIdAndUpdate req.params.id, { $set: fields }, (err, resource) ->
    res.send(500, { error: err }) if err?
    res.send(resource) if resource?
    res.send(404)

exports.delete = (req, res) ->
  Resource = mongoose.model('sites')

  Resource.findByIdAndRemove req.params.id, (err, resource) ->
    res.send(500, { error: err }) if err?
    res.send(200) if resource?
    res.send(404)
