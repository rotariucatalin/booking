import React, {useContext, useState} from 'react';
import CalendarContext from './../CalendarContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingHelper from './../../helpers/BookingHelper';
 

function BookingPopup(props) {
    
    // enter default from_date
    if (props.data.booking && props.data.booking.startDate != null) {
        props.data.booking.startDate = new Date(props.data.booking.startDate);
        props.data.booking.endDate = new Date(props.data.booking.endDate);   
    }

    let booking = Object.assign({
        id : null,
        room_id: null,
        name:'New resv',
        additionalInformation:'',
        startDate:new Date(),
        endDate: new Date(),
        noBeds: 0,
        checkAvailability: true
    }, props.data.booking, );

    const [state, setState] = useState( booking );

    const onChangeHandler = (event) => {
        let newBooking = {...state};
        newBooking[event.target.name] = event.target.value;
        setState(newBooking);
    }

    const dateChangeHandler = (property, date) => {
        let newBooking = {...state};
        newBooking[property] = date;
        newBooking.checkAvailability = true;
        setState(newBooking);
    }

    const context = useContext(CalendarContext);

    const checkAvailabilityHandler = (e) => {

        let varAux = document.querySelectorAll('.card-header.text-center')[0].childNodes[0].childNodes[0].innerText;

        let available = true;
        let currentRoom = context.data.rooms.filter( room => room.id === context.data.popup.booking.room_id );
        let bookingsForCurrentRoom = props.bookings.filter( (booking)  => booking.room_id === context.data.popup.booking.room_id);
        let daysForCurrentBooking = getDates(state.startDate, state.endDate);

        daysForCurrentBooking.forEach( (day) => {

            let currentDateTime = new Date(convertDate(day)).getTime();
            let totalOcupatedBeds = 0;

            bookingsForCurrentRoom.forEach( bk => {
                
                let datesBooking = BookingHelper.getAllBookingDates(bk);
                
                datesBooking.forEach( (bkDay) => {
                    let currentBkDay = new Date(convertDate(bkDay)).getTime();
                    
                    if(currentBkDay === currentDateTime) {
                        
                        // bk.guests.forEach( guest => {

                        //     totalOcupatedBeds = parseInt(guest.beds) + parseInt(totalOcupatedBeds);
                            
                        // })
                        if(varAux !== "Editeaza Rezervare") {
                            // state.guests.forEach( currentBk => {
                            //     totalOcupatedBeds = parseInt(currentBk.beds) + parseInt(totalOcupatedBeds);
                            // });
                        }
                    }
                });
            })
            if(totalOcupatedBeds > currentRoom[0].beds) {
                available = false;
                
            }

        } );
    
        //let status = context.actionCanExistBooking(state, state.room_id, state.from_date, state.to_date);
        if (available === false) {
            alert('Paturi indisponibile');
        } else {
            let newState = {...state};
            newState.checkAvailability = false;
            setState(newState);
        }

        e.preventDefault();
    }

    // Returns an array of dates between the two dates
    function getDates (startDate, endDate) {

        const dates = []
        let currentDate = startDate
        const addDays = function (days) {
            const date = new Date(this.valueOf())
            date.setDate(date.getDate() + days)
            return date
        }
        while (currentDate <= endDate) {
            dates.push(currentDate)
            currentDate = addDays.call(currentDate, 1)
        }
        return dates;

    }

    function convertDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }

    const confirmBookingHandler = (e) => {

        let varAux = document.querySelectorAll('.card-header.text-center')[0].childNodes[0].childNodes[0].innerText;
        let available = true;
        let currentRoom = context.data.rooms.filter( room => room.id === context.data.popup.booking.room_id );
        let bookingsForCurrentRoom = props.bookings.filter( (booking)  => booking.room_id === context.data.popup.booking.room_id);
        let daysForCurrentBooking = getDates(state.startDate, state.endDate);

        daysForCurrentBooking.forEach( (day) => {

            let currentDateTime = new Date(convertDate(day)).getTime();
            let totalOcupatedBeds = 0;

            bookingsForCurrentRoom.forEach( bk => {
                
                let datesBooking = BookingHelper.getAllBookingDates(bk);
                
                datesBooking.forEach( (bkDay) => {
                    let currentBkDay = new Date(convertDate(bkDay)).getTime();
                    
                    if(currentBkDay === currentDateTime) {
                        
                        // bk.guests.forEach( guest => {

                        //     totalOcupatedBeds = parseInt(guest.beds) + parseInt(totalOcupatedBeds);
                            
                        // })

                        if(varAux !== "Editeaza Rezervare") {
                            // state.guests.forEach( currentBk => {
                            //     totalOcupatedBeds = parseInt(currentBk.beds) + parseInt(totalOcupatedBeds);
                            // });
                        }
                    }
                });
            })
            if(totalOcupatedBeds > currentRoom[0].beds) {
                available = false;
                
            }

        } );
        
        if (available === false) {
            alert('Paturi indisponibile');
        } else {
            if (props.data.booking.id == null) {
                //if(state.guests.length === 0) {
                if(false) {
                    alert("Adauga cel putin 1 persoana in camera");
                } else {
                    state.id = BookingHelper.guid();
                    state.name = document.querySelector('[name=name]').value;
                    state.noBeds = document.querySelector('[name=noBeds]').value;
                    state.phone = document.querySelector('[name=phone]').value;
                    state.county = document.querySelector('[name=county]').value;
                    state.checkAvailability = true;
                    context.actionCreateBooking(state);
                    context.actionClosePopup();
                    
                }
                
            } else {
                context.actionMoveBooking(state, state.room_id, state.startDate, state.endDate);
                context.actionClosePopup();
            }
        }
        
        e.preventDefault();
    }

    let style = props.data.show === false ? {display:"none",zIndex:-1} : {display:'block',zIndex:10};

    const deleteRezervation = (e) => {
        
        setState(null);
        context.actionClosePopup();
        props.deleteRezervation();
        e.preventDefault();
    }

    function setInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
          textbox.addEventListener(event, function() {
            if (inputFilter(this.value)) {
              this.oldValue = this.value;
              this.oldSelectionStart = this.selectionStart;
              this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
              this.value = this.oldValue;
              this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
              this.value = "";
            }
          });
        });
      }
    
    function validateInput(e) {
        setInputFilter(document.getElementById("nrOfBeds"), function(value) {
            return /^\d*$/.test(value) && (parseInt(value) > 0); 
        });

    }

    let bottomActionButton = null;
    if (state.checkAvailability) {
        bottomActionButton = <button className="btn btn-danger" onClick={(e) => checkAvailabilityHandler(e)}>Verifica disponibilitate</button>;
    } else {
        bottomActionButton = <button className="btn btn-success" onClick={(e) => confirmBookingHandler(e)}>Confirma rezervare</button>;
    }

    let deleteButton = null;
    if(state.id !== null)
        deleteButton = <button id="deleteButton" className="btn btn-warning" onClick={(e) => deleteRezervation(e)}>Sterge rezervare</button>;


    let heading = (state.id == null) ? 'Rezervare Noua' : 'Editeaza Rezervare';
    let guestJsx = "";
    if(state.id != null) {
        guestJsx =  <tr>
                        <td></td>
                        <td>
                            <input type="text" className="form-control" value={state.name} name="name" placeholder="Nume" />
                        </td>
                        <td>
                            <input type="text" className="form-control" value={state.noBeds} name="noBeds" onKeyPress={validateInput} id="nrOfBeds" placeholder="Paturi" />
                        </td>
                        <td>
                            <input type="text" className="form-control" value={state.phone} name="phone" placeholder="Telefon" />
                        </td>
                        <td>
                            <input type="text" className="form-control" value={state.county} name="county" placeholder="Judet/Localitate" />
                        </td>
                    </tr>;
    } else {
        guestJsx =  <tr>
                        <td></td>
                        <td>
                            <input type="text" className="form-control" name="name" placeholder="Nume" />
                        </td>
                        <td>
                            <input type="text" className="form-control" name="noBeds" onKeyPress={validateInput} id="nrOfBeds" placeholder="Paturi" />
                        </td>
                        <td>
                            <input type="text" className="form-control" name="phone" placeholder="Telefon" />
                        </td>
                        <td>
                            <input type="text" className="form-control" name="county" placeholder="Judet/Localitate" />
                        </td>
                    </tr>;
    }
    
    return (
        <div className="popup-wrapper" style={style}>
            <div className="popup booking-popup">
                <div className="card">
                    <div className="card-header text-center">
                        <h5>
                            <span>{heading}</span>
                            <button onClick={() => context.actionClosePopup()} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </h5>
                    </div>
                    <div className="card-body">
                        <form action="" className="form" autoComplete="off">

                            <div className="row">
                                <div className="col-md-4 ">
                                    <h5>Data Rezervarii : </h5>
                                </div>
                                <div className="col-md-3 ">
                                        <DatePicker
                                        selected={state.startDate}
                                        dateFormat="dd.MM.yyyy"
                                        onChange={date => dateChangeHandler('startDate', date)}
                                        />
                                </div>
                                <div className="col-md-1"> &nbsp; &nbsp;- </div>
                                <div className="col-md-3">
                                    <DatePicker
                                        selected={state.endDate}
                                        dateFormat="dd.MM.yyyy"
                                        onChange={date => dateChangeHandler('endDate', date)}
                                        />
                                </div>
                            </div>
                            <hr/>

                            <h5>Persoane</h5>
                            <table className="table table-striped table-bordered table-sm" id="guest-list-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nume</th>
                                        <th>Paturi</th>
                                        <th>Telefon</th>
                                        <th>Judet/Localitate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guestJsx}
                                </tbody>
                            </table>
                            <hr/>

                            <div className="row">
                                <div className="col-md-2"><h5>Informatii:</h5> </div>
                                <div className="col-md-10">
                                    <textarea name="additionalInformation" id=""  rows="3" className="form-control" onChange={(event) => onChangeHandler(event)} defaultValue={state.additionalInformation}></textarea>
                                </div>
                            </div>
                            <hr />

                            <div className="text-center">
                                {bottomActionButton}
                                {deleteButton}
                            </div>
                            
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingPopup;