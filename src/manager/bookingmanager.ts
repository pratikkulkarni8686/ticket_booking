import { category } from './../models/travelclass';
import { Passenger } from './../models/passenger';
import { readRecords, saveRecords } from "./../dao/bookingdao";
var uuid = require("uuid");

export const fetchTickets = async (): Promise<Passenger[]> => {
  const all = await readRecords();
  if(all.length===0){
    return Promise.reject("Not able to fetch tickets")
  }else{
    return all.sort((a,b)=>{
      let c:number =a.TotalFare;
      let d:number =b.TotalFare;
      return d-c
    })
  }
};

export const fetchData = async (id: any): Promise<Passenger[]> => {
  const all = await readRecords();
  const found = all.filter(
    (c) =>
      c.BookingId === id ||
      c.OwnerId === id ||
      c.DepartureTime === id ||
      c.BookedOn === id ||
      c.Status.toLowerCase() ===id.toLowerCase() ||
      c.Category.toLowerCase().replace(/\s/g,'')===id.toLowerCase().replace(/\s/g,'')
  );
  if (!found) {
    return Promise.reject("Record not found");
  }
  return found;
};

export const createTicket = async (passenger: Passenger[]) => {
  const all = await readRecords();
  let arr = [];
  
  for (let i = 0; i < passenger.length; i++) {
    if (passenger.length > 1) {
      return ("Cannot add multiple data");
    }
    if (passenger[i].Category.toLowerCase() != "business class" && passenger[i].Category.toLowerCase() != "premium class" && passenger[i].Category.toLowerCase() != "economy class") {
      return  ("You can only choose between economy , business and premium classes");
    }
    if (passenger[i].PassengerDetails.length > 6) {
      return ("Only booking of 6 passengers allowed at a time");
    }
    if (passenger[i].PassengerDetails.length < 1) {
      return ("You should add atleast one passenger for booking");
    }
    if (passenger[i].Source === undefined || passenger[i].Source.length ==0) {
      return Promise.reject("Source is require field");
    }
    if (passenger[i].Destination === undefined || passenger[i].Destination.length ==0) {
      return Promise.reject("Destination is require field");
    }
    if(passenger[i].DepartureTime> new Date().toString()){
      console.log(passenger[i].DepartureTime> new Date().toString());
      return Promise.reject("Departure")
    }
    
    for (let j = 0; j < passenger[i].PassengerDetails.length; j++) {
      if(passenger[i].PassengerDetails[j].Name === undefined || passenger[i].PassengerDetails[j].Name.length === 0) {
        return Promise.reject("Name is require field");
      }
      if (passenger[i].PassengerDetails[j].Gender === undefined ||passenger[i].PassengerDetails[j].Gender.length === 0) {
        return Promise.reject("Gender is require field");
      }
      if(passenger[i].PassengerDetails[j].Age === undefined || passenger[i].PassengerDetails[j].Age === 0) {
        return Promise.reject("Age is require field");
      }

      if (passenger[i].PassengerDetails[j].Age < 1 || passenger[i].PassengerDetails[j].Age > 150) {
        return Promise.reject("Age should be between 1 and 150");
      }
      if (passenger[i].PassengerDetails[j].Gender.toLowerCase() != "male" &&passenger[i].PassengerDetails[j].Gender.toLowerCase() != "female" &&passenger[i].PassengerDetails[j].Gender.toLowerCase() != "other") {
        return Promise.reject("Gender should be male,female or other");
      }
      if(all.find((c) =>c.PassengerDetails[i].SeatNo ===passenger[i].PassengerDetails[j].SeatNo)) {
        return Promise.reject("Seat number you are trying to book is already taken by other passenger");
      } else if (passenger[i].PassengerDetails[j].SeatNo < 1 ||passenger[i].PassengerDetails[j].SeatNo > 60) {
        return Promise.reject("Seat number are available between 1 and 60");
      }
    }
    const fareAmount = (Passenger)=>{
      for(let i=0;i<Passenger.length;i++) {
        for(let j=0;j<category.length;j++){
          if(passenger[i].Category.toLowerCase().replace(/\s/g,'') ===category[j].category.toLowerCase().replace(/\s/g,'')){
            const fare= passenger[i].PassengerDetails.length*category[j].fare
            return fare
          }
        }
      }
    }

    let calculatedFare=fareAmount(passenger)
    let fare=calculatedFare.toFixed(2)
    let currentDate= new Date()
    let date=currentDate.toString()
    var newData = {
      OwnerId: uuid.v1(),
      BookingId: uuid.v1(),
      BookedOn: date,
      TotalFare: fare,
      Status: "Booked"
    };
    const newArr = Object.assign(newData, passenger[i]);
    arr.push(newArr);
  }
  const merArr = arr.concat(all);
  return saveRecords(merArr);
};


export const statusChange =async (data: Passenger, id: string , comment: string) =>{
  const all = await readRecords();
  for(let i=0;i<all.length;i++){
    const newDate1 :any= new Date(all[i].DepartureTime);
    const newDate2 :any= new Date(all[i].BookedOn);
    const calHour = Math.abs(newDate2 - newDate1);
    const found = all.find((c) => c.OwnerId === id);
    if (!found) {
      return Promise.reject("record not found");
    }
    else if(calHour < 21600000)
    {
      return Promise.reject("Cannot modify the ticket prior 6hours");
    }
    else {
        const index = all.findIndex((c) => c.OwnerId === found.OwnerId);
        const updatedRecord = { ...found, ...data , comment };
        all.splice(index, 1, updatedRecord);
      return saveRecords(all);
    }
  }

}

export const ticketsUpdate=async (data:Passenger[],id: string) => {
  const all= await readRecords();
    for(let i=0;i<data.length;i++){ 
      for(let j=0; j<data[i].PassengerDetails.length;j++){
        if(data[i].PassengerDetails[j].Gender||
          data[i].BookingId||
          data[i].Comments||
          data[i].DepartureTime||
          data[i].Destination||
          data[i].ModifiedOn||
          data[i].OwnerId||
          data[i].Source||
          data[i].Status||
          data[i].TotalFare){
          return Promise.reject("You can only modify Name,age seatNo and Category")
        } 
      } 
      var index = all.findIndex((ticket) => ticket.OwnerId === id)
      if(index!==-1){
        const updatedRecord = { ...all[index],...data[0], ModifiedOn: new Date()}
        all.splice(index, 1, updatedRecord);
      }  
      const ticket = all.filter((b) => b.OwnerId === id);
 
    }
    return saveRecords(all);
};

// for(let k=0;k<data[j].PassengerDetails.length;k++){
//   if(!data[j].PassengerDetails[k].Name&&
//     !data[j].PassengerDetails[k].Age&&
//     !data[j].PassengerDetails[k].SeatNo&&
//     !data[j].Category){
//     return "You can only modify Name,age seatNo and Category"
//   } 
// }

