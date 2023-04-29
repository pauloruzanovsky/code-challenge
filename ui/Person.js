import React from 'react';
import './style/Person.css';

export function Person(props) {
    const { person, checkInPerson, checkOutPerson } = props;
    const [checkInDate, setCheckInDate] = React.useState(person.checkInDate);
    const [checkOutDate, setCheckOutDate] = React.useState(person.checkOutDate);
    const [checkingIn, setCheckingIn] = React.useState(false);

    const handleCheckIn = (e) => {
        /* The luxon preset DATETIME_SHORT was not working as intended (it was returning the format "MM/DD/YYYY, HH:mm:ss"),
        so I did it in the old fashioned way, by concatenating strings. */
        const newCheckInDate = new Date();
        const checkInHours = newCheckInDate.getHours();
        const checkInMinutes = newCheckInDate.getMinutes();
        const updatedCheckInDate = `${newCheckInDate.toLocaleDateString('en-US')}, ${checkInHours}:${checkInMinutes}`;

        // Hide the check-in button
        e.target.style.display = 'none';

        // Show the checking in message
        setCheckingIn(true);

        // Creating a new person object with the check-in date
        const checkedInPerson = {
            ...person,
            checkInDate: updatedCheckInDate,
        };

        // After 5 seconds, check-in the person in the database, update the component check-in date and remove the checking-in message.
        setTimeout(() => {
            checkInPerson(checkedInPerson);
            setCheckInDate(updatedCheckInDate);
            setCheckingIn(false);
        }, 5000);
    };

    // Same logic as the check-in.
    const handleCheckOut = () => {
        const newCheckOutDate = new Date();
        const checkOutHours = newCheckOutDate.getHours();
        const checkOutMinutes = newCheckOutDate.getMinutes();
        const updatedCheckOutDate = `${newCheckOutDate.toLocaleDateString('en-US')}, ${checkOutHours}:${checkOutMinutes}`;

        const checkedOutPerson = {
            ...person,
            checkOutDate: updatedCheckOutDate,
        };

        checkOutPerson(checkedOutPerson);
        setCheckOutDate(updatedCheckOutDate);
    };

    return (
        <tr key={person._id}>
            <td>{person.firstName} {person.lastName}</td>
            {person.title ? <td>{person.title}</td> : <td>-</td>}
            {person.companyName ? <td>{person.companyName}</td> : <td>-</td>}
            {person.checkInDate ? <td>{person.checkInDate}</td> : <td>-</td>}
            {person.checkOutDate ? <td>{person.checkOutDate}</td> : <td>-</td>}
            <td>
                {!checkInDate && <button className="check-in-button" onClick={handleCheckIn}>Check-in {person.firstName} {person.lastName} </button>}
                {checkInDate && !checkOutDate && <button className="check-out-button" onClick={handleCheckOut}>Check-out {person.firstName} {person.lastName} </button>}
                {checkingIn && <div className="checking-in-message">Checking in...</div>}
                {checkInDate && checkOutDate && <div className="checked-out-message">Checked out</div>}
            </td>
        </tr>
    );
}
