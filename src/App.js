import React from 'react';
import './App.css';
import Calender from './components/Calender';
import bookingData from './data/bookings';
import BookingHelper from './helpers/BookingHelper';
import RoomComponent from './components/RoomComponent';
import {Tabs, Tab} from 'react-bootstrap';
import {useReducer} from 'react';

function reducer(state, action) {

  let newState;

  switch(action.method) {
    case "addRoom":
      let room = {id:10,title:action.room.name,beds: action.room.beds};
      state.rooms.push(room);
      newState = { rooms: state.rooms };
      break;
    case "deleteRoom": 
      let newRoom = state.rooms.filter( room => room.id !== action.roomId );
      newState = { rooms: newRoom }; break;
    case "updateRoom": 
      newState = { rooms: state.rooms }; break;
    default: 
      newState = { rooms: state.rooms }; break;
  }
  
  return newState;
}

function App() {

  const [state, dispatch] = useReducer(reducer, {rooms: [
    {
      id:1,
      title:"Studio (20)",
      beds: 40
    },
    {
      id:2,
      title:"Double (30)",
      beds: 30
    }]}
  );

  let bookings = bookingData;

  bookings = bookings.map((book, index) => {

    let today = new Date();
    today.setDate(today.getDate() + 2 * index  + Math.floor(Math.random() * 10) % 2 + 1);
    book.from_date = BookingHelper.formatDate(today);
    today.setDate(today.getDate() + Math.floor(Math.random() * 10) % 5 + 1);
    book.to_date = BookingHelper.formatDate(today);
    return book;
  });


  let currentDate = new Date();
  //let viewStartDate = BookingHelper.formatDate(currentDate.setDate( currentDate.getDate() - 100 ));
  let viewStartDate = BookingHelper.formatDate(currentDate);
  //console.log(viewStartDate);

  let dataCallback = (data) => {
    //console.log('Exported Booking Data :: ', data);
  }

  function addNewRoom(roomName, beds) {
    dispatch({method: "addRoom", room: { name: roomName, beds: beds }});
    //console.log(roomName, beds);
  }

  function updateRooms() {
    dispatch({method: "updateRoom"});
  }

  function deleteRoom(row) {
    dispatch({roomId: row.id, method: "deleteRoom"});
  }

  return (
      <div className="App">
        <h2>Mănăstirea Sihăstria</h2>
          <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="home" title="Rezervari">
              <Calender rooms={state.rooms} bookings={bookings} bookingDataCallback={dataCallback} viewStartDate={viewStartDate} ></Calender>
            </Tab>
            <Tab eventKey="contact" title="Camere">
              <RoomComponent roomsData={state.rooms} deleteRoom={deleteRoom} updateRooms={updateRooms} addNewRoom={addNewRoom}/>
            </Tab>
          </Tabs>
      </div>
  );
}

export default App;
