
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://rest:rest25@ds046667.mlab.com:46667/mosh-rest', { useNewUrlParser: true })
  .then(() => console.log('Connected to mLab...'))
  .catch(err => console.error('Couldnt connect to mLab...', err));

let genres = [
  { id: 1, name: 'Thriller' },
  { id: 2, name: 'Action' },
  { id: 3, name: 'Drama' }
];


router.get('/', (req, res) => {
  res.send(genres);
});

router.get('/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send('Such genre was not found');

  res.send(genre);
});

router.post('/', (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre = {
    id: genres.length + 1,
    name: req.body.name
  }

  genres = [...genres, newGenre];

  res.send(newGenre);
});

router.put('/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send('Such genre was not found');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  genre.name = req.body.name;

  res.send(genre);
});

router.delete('/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send('Such genre was not found');

  genres = genres.filter(g => g !== genre);

  res.send(genre);
});

function validate(body) {
  const schema = {
    name: Joi.string().min(2).required()
  }

  return Joi.validate(body, schema);
}

module.exports = router;
