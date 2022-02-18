import React, { useContext } from "react";
import CalendarContext from "./CalendarContext";

function Booking(props) {

    const context = useContext(CalendarContext);

    // generate random background color for a booking
    const bgColor = () => {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    };

    // get inner content of the booking
    const getContent = () => {
        let title = `${props.book.name} - ${props.book.noBeds} paturi`;
        return title;
    };

    // get title attribute of the booking
    const getTitle = () => {
        let title = `${props.book.name}\n${props.book.noBeds} paturi`;
        return title;
    };

    // calculate number of days for which booking is done
    let number_of_days = (new Date(props.book.endDate).getTime() - new Date(props.book.startDate).getTime()) / (60 * 60 * 24 * 1000) + 1;

    if (number_of_days > 0) {
      let style = {
        width: number_of_days * 100 + "%",
        backgroundColor: bgColor(),
        marginTop: props.count * 48 + "px",
      };
    return (
        <div
          onClick={(event) => {
            context.actionOpenPopup(props.book);
            event.stopPropagation();
            event.preventDefault();
          }}
          className="booking"
          style={style}
        >
          <div title={getTitle()} className="booking-inner">
            {getContent()}
          </div>
        </div>
    );
    } else {
      return <></>;
    }
}

export default Booking;
