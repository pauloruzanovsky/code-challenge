import React, { useEffect, useState } from 'react';
import { People } from '../people/people';
import { Meteor } from 'meteor/meteor';

export function Summary(props) {
    const { currentEvent, people } = props;
    const [totalPeopleInCurrentEvent, setTotalPeopleInCurrentEvent] = React.useState(0);
    const [peopleByCompany, setPeopleByCompany] = useState([]);
    const [peopleNotCheckedIn, setPeopleNotCheckedIn] = useState([]);

    /* Method snippet shamelessly copied from the Methods tutorial video from Filipe Névola (https://youtu.be/2uoeBq8SF9E) */
    const methodCall = (methodName, ...args) =>
        new Promise((resolve, reject) => {
            Meteor.call(methodName, ...args, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

    /* This useEffect runs every time the people collection changes, updating the state of total people in the current event,
    people not checked in yet and the list of total people by company in the current event.     */
    useEffect(() => {
        setTotalPeopleInCurrentEvent(People.find({ checkInDate: { $exists: true }, checkOutDate: { $exists: false }, communityId: currentEvent }).count());
        setPeopleNotCheckedIn(People.find({ checkInDate: { $exists: false }, communityId: currentEvent }).count());
        methodCall('aggregatePeopleByCompany', currentEvent).then(res => setPeopleByCompany(res));
    }, [people]);

    if (currentEvent) {
        return (
            <div>
                <div>
                    <p>People in the event right now: {totalPeopleInCurrentEvent} </p>
                   {peopleByCompany.length > 0 && <p>People by company in the event right now:</p>}
                </div>
                <div>
                    { peopleByCompany.map(company => `${company._id} (${company.count}), `)}
                </div>
                <p>People not checked-in: {peopleNotCheckedIn}</p>
            </div>
        );
    }
    return (
        <p>
            Please select an event.
        </p>
    );
}
