import React, { Component } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import "./../assets/styles/style.scss";

import Room from "./Room";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import CalendarContext from "./CalendarContext";
import BookingHelper from "../helpers/BookingHelper";
import BookingPopup from "./popups/BookingPopup";

class Calender extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        rooms: this.props.rooms,
        bookings: this.props.bookings,
        dates: [],
        cellWith: 50,
        startDate: this.props.dateStart ? this.props.dateStart : null,
        endDate: this.props.dateEnd ? this.props.dateEnd : null,
        popup: {
          show: false,
          booking: null,
        },
        filterStatus: "rooms",
        viewStartDate: this.props.viewStartDate ? this.props.viewStartDate : null,
      };
      this.actionMoveBooking = this.actionMoveBooking.bind(this);
      this.actionOpenPopup = this.actionOpenPopup.bind(this);
      this.actionClosePopup = this.actionClosePopup.bind(this);
      this.actionCanExistBooking = this.actionCanExistBooking.bind(this);
      this.actionCreateBooking = this.actionCreateBooking.bind(this);
      this.actionRemoveGuest = this.actionRemoveGuest.bind(this);

    }

    componentDidMount() {
      this.fillupDates();
    }

    componentDidUpdate(prevProps) {

      if ( (prevProps.dateStart !== this.props.dateStart) || (prevProps.dateEnd !== this.props.dateEnd) ) {
        if(this.props.dateStart !== undefined && this.props.dateEnd !== undefined) {
          if(this.props.dateStart !== null && this.props.dateEnd !== null) {
          
            const emptyDates = [];      
            let newState = { ...this.state, dates: emptyDates };
            this.setState(newState);

            let newDateStart = this.props.dateStart;
            let newDateEnd = this.props.dateEnd;

            let newDateEndParsed = newDateEnd.getFullYear()+'-'+(newDateEnd.getMonth()+1)+'-'+newDateEnd.getDate();
            let newDateStartParsed = newDateStart.getFullYear()+'-'+(newDateStart.getMonth()+1)+'-'+newDateStart.getDate();

            let allDates = this.getDatesBetweenDates(newDateStartParsed,newDateEndParsed);

            let newState2 = { ...this.state, dates: allDates };
            this.setState(newState2);
          }
        }
      }

      
      if (prevProps.rooms.length !== this.props.rooms.length) {
        let newState = { ...this.state, rooms: this.props.rooms };
        this.setState(newState);
      }
    }

    deleteRezervation(bookId) {
      const newBookings = this.state.bookings.filter(
        (book) => book.id !== bookId
      );

      let newState = { ...this.state, bookings: newBookings };
      this.setState(newState);
      this.renderTableBody();
    }

    /**
     * Fill up dates in component state
     **/
    fillupDates() {
      let day = new Date();
      if (this.state.viewStartDate != null) {
        day = new Date(this.state.viewStartDate);
      }

      this.state.dates.push(new Date(day.setDate(day.getDate())));
      for (let i = 0; i < 120; i++) {
        let newDay = new Date(day.setDate(day.getDate() + 1));
        this.state.dates.push(newDay);
      }

      this.setState((oldState) => {
        return this.state;
      });
    }

    /**
     * Render thead of the calendar table
     */
    renderHeaderDate() {
      let datesHtml = this.state.dates.map((date) => {
        // @todo move it to common helper
        Date.locale = {
          en: {
            month_names: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            month_names_short: [
              "Ian",
              "Feb",
              "Mar",
              "Apr",
              "Mai",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          },
        };

        return (
          <th key={date.getTime()}>
            <span className="r-calendar-head-date">{date.getDate()}</span>
            <div className="r-calendar-head-month">
              {Date.locale.en.month_names_short[date.getMonth()]}
            </div>
          </th>
        );
      });

      return (
        <thead>
          <tr>
            <th>
              <div className="text-right">CAMERE</div>
            </th>
            {datesHtml}
          </tr>
        </thead>
      );
    }

    /**
     * Render room component
     * @param {} room
     */
    renderRooms(room) {
      return (
        <Room
          key={room.id}
          room={room}
          bookings={this.state.bookings}
          dates={this.state.dates}
          cellWith={this.state.cellWith}
        ></Room>
      );
    }

    /**
     * Render tbody part of calendar table
     */
    renderTableBody() {
      let body = this.state.rooms.map((room) => {
        return this.renderRooms(room);
      });

      return <tbody>{body}</tbody>;
    }

    /**
     * Move single booking to different date
     * @param {*} singleBooking
     * @param {*} newStartDate
     * @param {*} newEndDate
     */
    actionMoveBooking(singleBooking, room, newStartDate, newEndDate) {
      let allBookings = BookingHelper.moveBooking(
        singleBooking,
        room,
        newStartDate,
        newEndDate,
        this.state.bookings
      );
      if (allBookings === false) {
        console.log("Unable to move to target date");
      } else {
        this.setState((oldState) => {
          oldState.bookings = allBookings;
          return oldState;
        });
      }
    }

  /**
   * Create a new booking
   * @param {*} singleBooking
   */
  actionCreateBooking(singleBooking) {
    //console.log(singleBooking);
    if ( BookingHelper.canExistBooking( singleBooking, singleBooking.room_id, singleBooking.startDate, singleBooking.endDate, this.state.bookings)) {
      this.setState((oldState) => {
        oldState.bookings.push(singleBooking);
        return oldState;
      });
    } else {
      console.log("Cannot create booking");
    }
  }

    actionRemoveGuest(bk) {
      this.state.bookings.filter((booking) => {
        if (booking.id === bk.id) {
          booking.guests = bk.guests;
        }
      });
    }

    /**
     * Can Move single booking to different date
     * @param {*} singleBooking
     * @param {*} newStartDate
     * @param {*} newEndDate
     */
    actionCanExistBooking(singleBooking, room, newStartDate, newEndDate) {
      return BookingHelper.canExistBooking(
        singleBooking,
        room,
        newStartDate,
        newEndDate,
        this.state.bookings
      );
    }

    /**
     * Open popup
     */
    actionOpenPopup(booking) {
      this.setState((oldState) => {
        oldState.popup.show = true;
        oldState.popup.booking = booking;
        return oldState;
      });
    }

    /**
     * Close popup
     */
    actionClosePopup() {
      this.setState((oldState) => {
        oldState.popup.show = false;
        return oldState;
      });
    }

    getDatesBetweenDates = (startDate, endDate) => {
      let dates = []
      //to avoid modifying the original date
      const theDate = new Date(startDate)
      while (theDate < new Date(endDate)) {
        dates = [...dates, new Date(theDate)]
        theDate.setDate(theDate.getDate() + 1)
      }
      dates = [...dates, new Date(endDate)]
      return dates
    }

    render() {
      let head = this.renderHeaderDate();
      let body = this.renderTableBody();

      // create context, to make data available to other child components
      const contextValue = {
        data: this.state,
        actionMoveBooking: this.actionMoveBooking,
        actionCanExistBooking: this.actionCanExistBooking,
        actionOpenPopup: this.actionOpenPopup,
        actionClosePopup: this.actionClosePopup,
        actionCreateBooking: this.actionCreateBooking,
        actionRemoveGuest: this.actionRemoveGuest,
      };

      // show hide booking popup
      let bookingPopup = this.state.popup.show ? (
        <BookingPopup
          deleteGuest={() => this.deleteGuest("22")}
          bookings={this.state.bookings}
          deleteRezervation={() =>
            this.deleteRezervation(this.state.popup.booking.id)
          }
          data={this.state.popup}
        ></BookingPopup>
      ) : null;

      // check if callback is set inorder to get booking data
      if (this.props.bookingDataCallback) {
        this.props.bookingDataCallback(this.state.bookings);
      }

      return (
        <CalendarContext.Provider value={contextValue}>
          
          <div className="r-calendar">
            <DndProvider backend={HTML5Backend}>
              <ScrollContainer className="scroll-container" ignoreElements="td">
                <table className="table table-striped r-calendar-main-table">
                  {head}
                  {body}
                </table>
              </ScrollContainer>
            </DndProvider>
            {bookingPopup}
          </div>
        </CalendarContext.Provider>
      );
    }
}

export default Calender;
