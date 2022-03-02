import React from "react";
import "./App.css";
import Calender from "./components/Calender";
import bookingData from "./data/bookings";
import BookingHelper from "./helpers/BookingHelper";
import RoomComponent from "./components/RoomComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tabs, Tab } from "react-bootstrap";
import { useReducer, useState, useEffect } from "react";
import axios from 'axios';

const divStyle = {
  textAlign: 'right'
};

const divStyle2 = {
  textAlign: 'left'
};

const divStyle3 = {
  marginRight: '50px'
};

const divStyle4 = {
  marginLeft: '50px'
};

const divStyle5 = {
  marginBottom: '30px'
};

const divStyle6 = {
  marginBottom: '30px',
  marginRight: '0px',
  marginLeft: '0px'
};

function reducer(state, action) {
  let newState;

  switch (action.method) {
    case "addRoom":
      let room = { id: 10000, title: action.room.name, beds: action.room.beds };
      state.rooms.push(room);
      newState = { rooms: state.rooms };
      break;
    case "deleteRoom":
      let newRoom = state.rooms.filter((room) => room.id !== action.roomId);
      newState = { rooms: newRoom };
      break;
    case "updateRoom":
      newState = { rooms: state.rooms };
      break;
    case "showRooms":
      let showRoom = { id: action.room.roomData.id, title: action.room.roomData.roomName, beds: action.room.roomData.totalBeds };
      state.rooms.push(showRoom);
      newState = { rooms: state.rooms };
      break;
    default:
      newState = { rooms: state.rooms };
      break;
  }

  return newState;
}

function App() {
  const [state, dispatch] = useReducer(reducer, {rooms: []});

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {   
    
    axios.get(`http://localhost:8080/v1/api/room`)
      .then(res => {
        state.rooms = [];
        
        const rooms = res.data;
        rooms.forEach(function (room) {
          dispatch({ method: "showRooms", room: {roomData : room } });
        });
      })
  }, []);

  let bookings = bookingData;

  let currentDate = new Date();
  let viewStartDate = BookingHelper.formatDate(currentDate);

  let dataCallback = (data) => {
    //console.log('Exported Booking Data :: ', data);
  };

  function addNewRoom(roomName, beds) {
    //dispatch({ method: "addRoom", room: { name: roomName, beds: beds } });

    axios.post(`http://localhost:8080/v1/api/room`, {
      roomName: roomName,
      totalBeds: beds,
      inUse: 1,
    }).then(res => {
        //dispatch({ roomId: row.id, method: "deleteRoom" });

        axios.get(`http://localhost:8080/v1/api/room`)
        .then(res => {
          state.rooms = [];
          
          const rooms = res.data;
          rooms.forEach(function (room) {
            dispatch({ method: "showRooms", room: {roomData : room } });
          });
        })

    });

    //console.log(roomName, beds);
  }

  function updateRooms(roomData) {
    
    //dispatch({ method: "updateRoom" });

    axios.put(`http://localhost:8080/v1/api/room`, {
      id: roomData.id,
      roomName: roomData.title,
      totalBeds: roomData.beds
    }).then(res => {
      dispatch({ method: "updateRoom" });
    });
  }

  function deleteRoom(row) {
    axios.get(`http://localhost:8080/v1/api/room-soft-delete/${row.id}`)
      .then(res => {
        dispatch({ roomId: row.id, method: "deleteRoom" });
      })
  }

  return (
    <div className="App">
      <h2 style={divStyle5}>Mănăstirea Sihăstria</h2>
      <div style={divStyle6} className="row justify-content-md-center">
          <div className="col-lg-2" style={divStyle}>
            <h5 style={divStyle3}>Data start</h5><DatePicker selected={startDate} dateFormat="dd.MM.yyyy" onChange={(date) => setStartDate(date)} />
          </div>
          <div className="col-lg-2" style={divStyle2}>
            <h5 style={divStyle4}>Data sfarsit</h5><DatePicker selected={endDate} dateFormat="dd.MM.yyyy" onChange={(date2) => setEndDate(date2)} />
          </div>
      </div>
      <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Rezervari">
          <Calender
            rooms={state.rooms}
            bookings={bookings}
            bookingDataCallback={dataCallback}
            viewStartDate={viewStartDate}
            dateStart={startDate}
            dateEnd={endDate}
          ></Calender>
        </Tab>
        <Tab eventKey="contact" title="Camere">
          <RoomComponent
            roomsData={state.rooms}
            deleteRoom={deleteRoom}
            updateRooms={updateRooms}
            addNewRoom={addNewRoom}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
