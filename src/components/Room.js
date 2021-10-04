import React from 'react';
import Booking from './Booking';
import RoomDate from './RoomDate';

/**
 * Render a single room, i.e. single row in a table
 * @param {*} props 
 */
function Room(props) {

    let count = -1;
    let daysTd = props.dates.map((day, index) => {
        
        // get all booking for current day
        let bookinksToday = props.bookings.filter(singleBook => {
            let from_date = new Date(singleBook.from_date);
            return (from_date.toDateString() === day.toDateString() && singleBook.room_id === props.room.id) ? true : false;
        });
        
        let bookinksTodayJsx = "";

        if(bookinksToday.length > 1) {
            
            bookinksTodayJsx = bookinksToday.map((singleBook, index) => {
                
                count++;
                if(index > 0)
                    return <Booking book={singleBook} key={singleBook.id} count={0} />;
                else
                    return <Booking book={singleBook} key={singleBook.id} count={count} />;
            });
        } else {
            if(bookinksToday.length > 0) {
                bookinksTodayJsx = bookinksToday.map((singleBook) => {
                    count++;
                    return <Booking book={singleBook} key={singleBook.id} count={count} />;
                });
            }
            
        }

        return <RoomDate key={index} day={day} room={props.room} cellWidth={props.cellWidth}>{bookinksTodayJsx}</RoomDate>
    })

    return (<tr key={props.room.id}>
        <td><div>{props.room.title}</div></td>
        {daysTd}
    </tr>);

}

export default Room;