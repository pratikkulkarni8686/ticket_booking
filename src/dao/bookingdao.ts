import { readFile, writeFile } from "fs";
import { Passenger } from "../models/passenger";

export const readRecords = (): Promise<Passenger[]>=>{
    return new Promise<Passenger[]>((resolve, reject) =>{
        readFile(process.env.FILE_PATH , (err, data) =>{
            if(err){
                reject("Not able to get the records")
            }
            if(data){
                const all = <Passenger[]>JSON.parse(data.toString());
                resolve(all);
            }
        })
    })
}

export const saveRecords = (passenger: Passenger[]): Promise<string>=>{
    return new Promise<string>((resolve, reject) =>{
        writeFile(process.env.FILE_PATH ,JSON.stringify(passenger) , (err)=>{
            if(err){
                reject("Details not written into the file")
            }else{
                resolve("Details are written successfully")
            }
        })
    })
}