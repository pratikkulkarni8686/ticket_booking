import { addPassenger, deleteData, getAllTickets, getByData, updateDetails } from './../controller/bookingcontroller';
import {Router} from "express";
import validRequirement from '../validationmiddleware/validation';
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
import * as dotenv from 'dotenv';


const routerMiddleware = Router();
dotenv.config()
const PORT = process.env.PORT

const swaggerimp = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Ticket booking system by pratik",
        version: "1.0.0",
      },
      servers: [
        {
          url:'http://localhost:'+ process.env.PORT+'/',
        },
      ],
    },
    apis: ["./src/routes/apiroutes.ts"],
  };
  const swaggerSpec = swaggerJSDoc(swaggerimp);
  
  routerMiddleware.use(
    "/swagger-doc",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );

  /**

 * @swagger

 *  components:

 *      schemas:

 *          booking:

 *              type: object

 *              properties:

 *                  OwnerId:

 *                      type: string

 *                  BookingId:

 *                      type: string

 *                  BookedOn:        

 *                      type: string

 *                  Status:

 *                      type: integer'

 *                  PassengerDetails:

 *                      type: array

 *                  Source:

 *                      type: string

 *                  Destination:

 *                      type: string                      

 *                  Catagory:

 *                      type: string

 *                  DepartureTime:

 *                      type: number


 */


/**

 * @swagger

 * /booking/{id}:  

 *  get:

 *     summary: this api is used to check get method by id

 *     description: this api is used to check if get by id method is working or not

 *     parameters:

 *         - in: path

 *           name: id

 *           required: true

 *           description: Numeric ID required

 *           schema:

 *             type: string

 *     responses:

 *          200:

 *              description: To test Get method

 */
routerMiddleware.get('/booking/:id' , getByData)
/**

 * @swagger

 * /bookings:  
 *  get:
 *     summary: this api is used to check get method
 *     description: this api is used to check if get method is working or not
 *     responses:
 *          200:
 *              description: To test Get method
 */
routerMiddleware.get('/bookings', getAllTickets)

/**

 * @swagger

 * /bookings:  

 *  post:

 *     summary: this api is used to check post method

 *     description: this api is used to check if patch method is working or not

 *     requestBody:

 *         required: true

 *         content:

 *             application/json:

 *                 schema:

 *                     $ref: '#components/schemas/booking'

 *     responses:

 *          200:

 *              description: To test post method

 */
routerMiddleware.post('/bookings',validRequirement, addPassenger)
/**

 * @swagger

 * /bookings/{id}:  

 *  delete:

 *     summary: this api is used to check post method

 *     description: this api is used to check if patch method is working or not
 *     parameters:

 *         - in: path

 *           name: id

 *           required: true

 *           description: Numeric ID required

 *           schema:

 *             type: string

 *     requestBody:

 *         required: true

 *         content:

 *             application/json:

 *                 schema:

 *                     $ref: '#components/schemas/soft'

 *     responses:

 *          200:

 *              description: To test post method

 */
routerMiddleware.delete('/bookings/:id', deleteData)
/**

 * @swagger

 * /update/{id}:  

 *  patch:

 *     summary: this api is used to check patch method

 *     description: this api is used to check if patch method is working or not
 *     parameters:

 *         - in: path

 *           name: id

 *           required: true

 *           description: Numeric ID required

 *           schema:

 *             type: string


 *     requestBody:

 *         required: true

 *         content:

 *             application/json:

 *                 schema:

 *                     $ref: '#components/schemas/booking'

 *     responses:

 *          200:

 *              description: To test post method

 */
routerMiddleware.patch('/update/:id',  updateDetails)

routerMiddleware.get('/', (req,res) => {
  res.send("Booking Management System")
})

export default routerMiddleware;