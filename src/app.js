const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {url, title, techs} = request.body
  const repository = {
    id: uuid(),
    url, 
    title,
    techs,
    likes: 0
  }
  repositories.push(repository);
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body

  const key = repositories.findIndex(item => item.id === id);
  if(key < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }
  const repository = {id, title, url, techs, likes: repositories[key].likes};
  repositories[key] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const key = repositories.findIndex(item => item.id === id);

  if(key < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  repositories.splice(key, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const key = repositories.findIndex(item => item.id === id);
  
  if(key < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  const repository = repositories[key];
  repository.likes = repository.likes + 1;
  repositories[key] = repository;
  response.json(repository)
});

module.exports = app;
