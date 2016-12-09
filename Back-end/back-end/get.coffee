mongoose = require 'mongoose'
fs = require 'fs'
phantom = require 'phantom'



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

exports.sendPage = (req, res) ->

  pageTable = 'https://www.facebook.com/INSAdeLyon/?fref=ts'
  res.send pageTable

exports.fbConnect = (req, res) ->

  log = req.query.log
  pass = req.query.pass
  cookiePath = './cookies.txt'



  phantom.create([
    '--ignore-ssl-errors=true'
    '--ssl-protocol=any'
    '--web-security=false'
    '--cookies-file=' + cookiePath
  ]).then (ph) ->

    ph.createPage().then (page) ->
      try
        page.setting.userAgent = "mozilla/5.0 (x11; linux x86_64) applewebkit/537.36 (khtml, like gecko) chrome/54.0.2840.59 safari/537.36"
      catch err
        console.log err.message
      page.open('https://www.facebook.com').then (status) ->
        console.log status
        page.evaluate((login, password)->
          frm = document.getElementById('login_form')
          frm.elements['email'].value = login
          frm.elements['pass'].value = password
          frm.submit()
          return frm.elements['email'].value
        , log, pass).then (html) ->
          console.log "submitted to facebook"
          return

        setTimeout (->
          try
            page.property('content').then (content) ->
              if content.indexOf('Se connecter à Facebook') > -1
                console.log 'Connexion échouée : erreur d\'identifiants'
                res.send("false")
                page.open('https://www.facebook.com').then (status) ->
                  console.log "redirect page accueil"
                  page.close()
                  ph.exit()
                  return
              else
                console.log 'Connexion réussie : identifiants valides'
                res.send("true")
                page.evaluate(->
                  try
                    t = document.getElementById('userNavigationLabel')
                    click = (elm) ->
                      event = document.createEvent('MouseEvent')
                      event.initMouseEvent 'click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
                      elm.dispatchEvent event
                      return
                    click t
                  catch err
                    console.log err.message
                  return "hh"
                  ).then (html) ->
                    try
                      console.log html
                    catch err
                      console.log err.message
                    setTimeout (->
                      console.log "Déconnexion"
                      page.close()
                      ph.exit()
                      return
                    ), 3000

                    return


          catch err
            console.log err.message
          return
        ), 3000

        return
      return
    return
#  res.send(200)
