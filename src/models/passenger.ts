export interface Passenger{
    BookingId: string;
    PassengerDetails:[{
        Name: string;
        Age: number;
        Gender: string;
        SeatNo: number;
    }];
    Source: string;
    Destination: string;
    Category: string;
    TotalFare: number;
    Status: string;
    Comments: string;
    OwnerId: string;
    DepartureTime: string;
    BookedOn: string;
    ModifiedOn: Date;
}