import React, {useContext, useState} from 'react';
import CalendarContext from './../CalendarContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingHelper from './../../helpers/BookingHelper';
 

function BookingPopup(props) {
    
    // enter default from_date
    if (props.data.booking && props.data.booking.from_date != null) {
        props.data.booking.from_date = new Date(props.data.booking.from_date);
        props.data.booking.to_date = new Date(props.data.booking.to_date);   
    }

    let booking = Object.assign({
        id : null,
        room_id: null,
        guest_name:'New resv',
        objective:'',
        unit:'',
        channel:null,
        adult_count:0,
        child_count:0,  
        from_date:new Date(),
        to_date: new Date(),
        guests:[],
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
        
        let status = context.actionCanExistBooking(state, state.room_id, state.from_date, state.to_date);
        if (status == false) {
            alert('This booking conflicts with other booking');
        } else {
            let newState = {...state};
            newState.checkAvailability = false;
            setState(newState);
        }

        e.preventDefault();
    }

    const confirmBookingHandler = (e) => {
        if (props.data.booking.id == null) {
            if(state.guests.length === 0) {
                alert("Adauga cel putin 1 persoana in camera");
            } else {
                state.id = BookingHelper.guid();
                context.actionCreateBooking(state);
                context.actionClosePopup();
                
            }
            
        } else {
            context.actionMoveBooking(state, state.room_id, state.from_date, state.to_date);
            context.actionClosePopup();
        }
        
        e.preventDefault();
    }

    const removeGuestHandler = (e, guestId) => {

        const filterGuest = state.guests.filter( (guest) => guest.id !== guestId);
        let newState = {...state, guests: filterGuest};
        setState(newState);

        e.preventDefault();
    }

    const addGuestHandler = (e) => {
        if (document.querySelector('[name=new_guest_name]').value != '' && document.querySelector('[name=new_guest_age]').value != '') {
            let newState = {...state};
            newState.guests.push({
                name:document.querySelector('[name=new_guest_name]').value,
                age:document.querySelector('[name=new_guest_age]').value,
                security_number: document.querySelector('[name=new_guest_security_no]').value
            });
            setState(newState);
            document.querySelector('[name=new_guest_name]').value = '';
            document.querySelector('[name=new_guest_age]').value = '';
            document.querySelector('[name=new_guest_security_no]').value = '';
        }
        e.preventDefault();
    };

    let style = props.data.show == false ? {display:"none",zIndex:-1} : {display:'block',zIndex:10};

    const changeCount = (name, direction, event) => {
        let input = document.querySelector('input[name='+name+']');
        let inputValue = input.value != "" ? input.value : 0;
        
        if (direction == 'up') {
            inputValue++;
        } else if (inputValue > 0) {
            inputValue--;
        }
        input.value = inputValue;
        
        let newState = {...state};
        newState[name] = inputValue;
        setState(newState);
        
        event.preventDefault();
    }

    const deleteRezervation = (e) => {
        
        //console.log(props);
        setState(null);
        context.actionClosePopup();
        props.deleteRezervation();
        e.preventDefault();
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

    let guestJsx = state.guests.map((guest, index) => {
        return <tr id={guest.id} key={index}>
                <td>{index + 1}</td>
                <td>{guest.name}</td>
                <td>{guest.age}</td>
                <td>{guest.security_number}</td>
                <td><button className="btn btn-danger" onClick={(e) => removeGuestHandler(e, guest.id)}>Sterge</button></td>
            </tr>;
    })

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
                        <form action="" className="form">

                            <div className="row">
                                <div className="col-md-4 ">
                                    <h5>Data Rezervarii : </h5>
                                </div>
                                <div className="col-md-3 ">
                                        <DatePicker
                                        selected={state.from_date}
                                        dateFormat="dd.MM.yyyy"
                                        onChange={date => dateChangeHandler('from_date', date)}
                                        />
                                </div>
                                <div className="col-md-1"> &nbsp; &nbsp;- </div>
                                <div className="col-md-3">
                                    <DatePicker
                                        selected={state.to_date}
                                        dateFormat="dd.MM.yyyy"
                                        onChange={date => dateChangeHandler('to_date', date)}
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
                                        <th>Telefon</th>
                                        <th>Judet/Localitate</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guestJsx}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="text" className="form-control" name="new_guest_name" placeholder="Nume" />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control" name="new_guest_age" placeholder="Telefon" />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control" name="new_guest_security_no" placeholder="Judet/Localitate" />
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="text-right">
                            <button onClick={(e) => addGuestHandler(e)} className="btn btn-success btn-block1">ADAUGA PERSOANA</button>

                            </div>

                            <hr/>

                            <div className="row">
                                <div className="col-md-2"><h5>Informatii:</h5> </div>
                                <div className="col-md-10">
                                    <textarea name="objective" id=""  rows="3" className="form-control" onChange={(event) => onChangeHandler(event)} defaultValue={state.objective}></textarea>
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