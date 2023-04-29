import React, { useState } from 'react';
import { Texts } from '../infra/constants';
import { Communities } from '../communities/communities';
import { People } from '../people/people';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Person } from './Person';
import { Summary } from './Summary';
import './style/App.css';


// Subscribing to the communities and people collections, to be able to read the data.
Meteor.subscribe('communities');
Meteor.subscribe('people');


export const App = () => {
  // State that holds the current event's ID.
  const [currentEvent, setCurrentEvent] = useState(null);

  // Array of all the event
  const communities = useTracker(() => Communities.find().fetch());

  // Array of all the people in the selected event
  const people = useTracker(() => People.find({ communityId: currentEvent }).fetch());

  // Method for checking in a person on it's respective event.
  const checkInPerson = (person) => {
    Meteor.call('checkInPerson', person);
  };

  // Method for checking out a person on it's respective event.
  const checkOutPerson = (person) => {
    Meteor.call('checkOutPerson', person);
  };

  return (
    <div>
      <h1>{Texts.HOME_TITLE}</h1>
      <select defaultValue="none" onChange={e => setCurrentEvent(e.target.value)} id="event-selector">
        <option value="none" disabled hidden>Select an event</option>
        {communities && communities.map(community => <option key={community._id} value={community._id}>{community.name}</option>)}
      </select>
      <Summary
              people={people}
              currentEvent={currentEvent}/>
      {currentEvent && <h2>{communities.filter(community => community._id === currentEvent)[0].name} Guest List</h2>}
      {/* I opted to create a table for better readability of each user */}
      {currentEvent &&
      <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Title</th>
              <th>Company</th>
              <th>Check-in date</th>
              <th>Check-out date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {people.map(person =>
                      <Person
                          person={person}
                          key={person._id}
                          checkInPerson={checkInPerson}
                          checkOutPerson={checkOutPerson}
                        />
                      )}
          </tbody>
      </table>}
    </div>
  );
};
