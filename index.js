const express = require("express");
const app = express();
var morgan = require("morgan");

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.content(req, res),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const currentTime = new Date().toString();

  const output = `Phonebook has info for ${persons.length} people
  <br />
  <br />  
  ${currentTime}`;
  console.log(output);

  response.send(output);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  if (persons.filter((person) => person.name === body.name).length > 0) {
    return response.status(400).json({
      error: "Duplicate Name!",
    });
  }

  if (persons.filter((person) => person.number === body.number).length > 0) {
    return response.status(400).json({
      error: "Duplicate Number!",
    });
  }

  const newId = Math.floor(Math.random() * 10000);

  const newPerson = {
    id: newId,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  response.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
