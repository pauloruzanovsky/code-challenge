import { Meteor } from 'meteor/meteor';
import { loadInitialData } from '../infra/initial-data';
import { Communities } from '../communities/communities';
import { People } from '../people/people';

// Publishing the data to make it accessible on the client side.
Meteor.publish('communities', () => Communities.find());
Meteor.publish('people', () => People.find());

Meteor.methods({
  // Method for checking in a person on it's respective event.
  checkInPerson(person) {
    People.update(person._id, { $set: { checkInDate: person.checkInDate } });
  },

  // Method for checking out a person on it's respective event.
  checkOutPerson(person) {
    People.update(person._id, { $set: { checkOutDate: person.checkOutDate } });
  },

  // Method for getting an array that shows the total of people that is in the event, by company.
  aggregatePeopleByCompany(communityId) {
    const aggregateByCompany = People.aggregate([
      { $match: { communityId, companyName: { $exists: true }, checkInDate: { $exists: true }, checkOutDate: { $exists: false } } },
      { $group: { _id: '$companyName', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);
    return aggregateByCompany;
  },
});

Meteor.startup(() => {
  // DON'T CHANGE THE NEXT LINE
  loadInitialData();

  // YOU CAN DO WHATEVER YOU WANT HERE
});
