express = require 'express'
path = require 'path'
mongoose = require 'mongoose'
get = require  './back-end/get'
auth = require 'http-auth'
bodyParser = require 'body-parser'
app = express()

basic =auth.basic({
	realm : "Simon Area.",
	file : __dirname + "/htpasswd"
});
#Config du port d'écoute
app.set "port", 8080
app.use bodyParser.json()

require './Model/user'

app.set 'storage-uri',
  process.env.MONGOHQ_URL or
  process.env.MONGOLAB_URI or
  'mongodb://localhost/sites'

mongoose.Promise = global.Promise
mongoose.connect app.get('storage-uri'),{db:{safe:true}},(err)->
  console.log "Mongoose - connection error" + err if err?
  console.log "Mongoose - connection OK"


app.use (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'
  next()
  return

app.use('/static', express.static(__dirname+'/Public'))
app.use('/static', express.static(__dirname+'/node_modules'))

app.get '/toto', auth.connect(basic),(req,res) -> res.sendFile path.join __dirname+'/Public/views/index.html'
app.get '/stat', (req,res) -> res.sendFile path.join __dirname+'/Public/views/stat.html'
app.get '/get', get.test
app.post '/json', get.createUser
app.get '/site', get.retrieve


#Lancement du serveur
app.listen app.get('port')
