const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views') //We have changed the name of VIEWS folder into template so we have to write this to avoid failings
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup handebars engine and (below) views location
app.set('view engine', 'hbs')
app.set('views', viewsPath) //this point the once-called View folder
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// with .render we can render one the handlebars in Views, the files in .hbs
// 1st parameter is the page (view) we want to render (es.index, without .hbs), the second is an object
// with all the values we want that view to access.
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Morwen Dohriel'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Morwen Dohriel'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        adjective: 'cool',
        name: 'Morwen Dohriel'
    })
})

app.get('/weather', (req, res) => { 
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send ({ error })
            }   
        
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

// This is when we want a 404 page after a specific route, like help
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Valeria Ragonese',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Valeria Ragonese',
        errorMessage: 'Page not found'
    })
})

app.listen(PORT, () => {
    console.log('Server is up on port' + port)
})