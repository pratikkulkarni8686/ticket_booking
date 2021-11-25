import { createTicket, fetchData, statusChange, ticketsUpdate } from "./../manager/bookingmanager";
import { fetchTickets } from "../manager/bookingmanager";
import { Passenger } from "../models/passenger";
import { validationResult } from "express-validator";

export const getAllTickets = (req, res) => {
  fetchTickets().then((tickets) => {
    res.statusCode = 200;
    res.send(tickets);
  }),
    (failure) => {
      res.statusCode = 500;
      res.send(failure);
    };
};

export const addPassenger = (req, res) => {
  const passenger = <Passenger[]>req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send(error);
  }
  createTicket(passenger).then((success) => {
    res.statusCode = 201;
    res.send(success);
  }),
    (failure) => {
      res.statusCode = 500;
      res.send(failure);
    };
};

export const getByData = (req, res) => {
    const id = req.params.id;
    fetchData(id).then((success) => {
        res.statusCode = 201;
        res.send(success);
    }),
    (failure)=>{
        res.statusCode = 500;
        res.send(failure);
    }
}

export const deleteData =(req, res)=>{
    const id=req.params.id;
    const data: any={Status:"Cancelled"};
    const passengers = req.body;
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.send('Need to add the comments for cancallation')
    }
    for(let i=0; i<req.body.length; i++) {
        const comment = req.body[i].Comments;
        if(comment===undefined || comment===null || comment.length==0) {
            res.send("Need to add the comments for cancallation")
        }else if(req.body[i]===undefined){
            res.send("Need to add the comments for cancallation")
        }
        else{
            statusChange(data , id , comment).then(
                (data) => {
                console.log(data);
                res.statusCode = 200;
                res.send(data);
                },
                (err) => {
                res.statusCode = 500;
                res.send(err);
                }
            ) 
        }
    }   
}

export const updateDetails = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    ticketsUpdate(data, id).then(
        (data) => {
        res.statusCode = 200;
        res.send(data);
        },
        (err) => {
        res.statusCode = 500;
        res.send(err);
        }
    ) 
}
