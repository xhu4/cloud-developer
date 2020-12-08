import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

function ListCars(cars: Car[]) {
  let ret = `
  <table>
  <tr>
  <th>ID</th>
  <th>Make</th>
  <th>Type</th>
  <th>Model</th>
  <th>Cost</th>
  </tr>
  `;
  for (let car of cars) {
    ret += `<tr>
    <td>${car.id}</td>
    <td>${car.make}</td>
    <td>${car.type}</td>
    <td>${car.model}</td>
    <td>${car.cost}</td>
    </tr>`;
  }
  ret += "</table>";
  return ret;
}

(async () => {
  let cars: Car[] = cars_list;

  //Create an express applicaiton
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name",
    (req: Request, res: Response) => {
      let { name } = req.params;

      if (!name) {
        return res.status(400)
          .send(`name is somehow required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    let { name } = req.query;

    if (!name) {
      return res.status(400)
        .send(`name is required`);
    }

    return res.status(200)
      .send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post("/persons",
    async (req: Request, res: Response) => {

      const { name } = req.body;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get("/cars", (req: Request, res: Response) => {
    let { make } = req.query;

    return make ?
      res.status(200).send(cars.filter(car => car.make === make)) : res.status(400).send("make is required");
  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id", (req: Request, res: Response) => {
    let { id } = req.params;

    let car = cars.find(c => c.id == id);
    if (!car) {
      return res.status(404).send(`No car with id ${id} was found.`);
    }
    return res.status(200).send(ListCars([car]));
  })

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/cars", async (req: Request, res: Response) => {
    let { id, type, model, cost } = req.body;
    if (!id || !type || !model || !cost) {
      return res.status(400).send("Need id, type, model and cost.");
    }
    cars.push({ id: id, type: type, model: model, cost: cost } as Car);
    return res.status(200).send(ListCars(cars));
  })

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();