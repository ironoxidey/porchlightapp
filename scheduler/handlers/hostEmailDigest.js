const _ = require('lodash');
const sendEmail = require('../../utils/email/sendEmail');
const addressGeocode = require('../../utils/maps/geocoding');

const User = require('../../models/User');
const Event = require('../../models/Event');
const Host = require('../../models/Host');

module.exports = async () => {
    let updatedEvents = 0;
    let yesterDate = new Date();
    yesterDate.setDate(yesterDate.getDate() - 1);
    let dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    try {
        let emailHostsCollection = [];
        let hostsToEmailArray = []; //for checking to see if we're already emailing a host, in order to add multiple events to a hosts email digest

        const deletePastEvents = await Event.deleteMany({
            bookingWhen: { $lt: dayBeforeYesterday }, //if we ask for $gte: new Date(), some of the events today won't show up because the time in the event's bookingWhen isn't the start time
            status: 'PENDING', //only pull PENDING events
        });

        const events = await Event.find({
            bookingWhen: { $gt: yesterDate }, //if we ask for $gte: new Date(), some of the events today won't show up because the time in the event's bookingWhen isn't the start time
            createdBy: 'ARTIST', //only pull ARTIST proposed events for the host email digest
            status: 'PENDING', //only pull PENDING events
        })
            .populate('artist')
            .populate('hostsInReach.host')
            .populate('offersFromHosts.host')
            .populate('confirmedHost')
            .sort({ bookingWhen: -1 }); //sort descending -- latest first, because hosts probably need more time to prepare, so show the most upcoming proposed concerts last

        let loopThruEvents = new Promise((resolve, reject) => {
            // console.log(
            //     'There are ' + events.length + ' events to loop through.'
            // );
            events.forEach(async (eventDetails, index, array) => {
                if (
                    !eventDetails.artistSlug &&
                    eventDetails.artist &&
                    eventDetails.artist.slug
                ) {
                    eventDetails.artistSlug = eventDetails.artist.slug;
                    await eventDetails.save();
                    updatedEvents++;
                }
                if (
                    ((eventDetails.latLong &&
                        eventDetails.latLong.coordinates &&
                        (eventDetails.latLong.coordinates.length == 0 || //if there is no latLong OR
                            (eventDetails.latLong.coordinates[0] === 0 &&
                                eventDetails.latLong.coordinates[1] === 0))) || //if latLong.coordinates are default OR
                        !eventDetails.geocodedBookingWhere || //if there is no geocodedBookingWhere OR
                        (eventDetails.geocodedBookingWhere && //if there IS a geocodedBookingWhere AND
                            eventDetails.bookingWhere.zip !==
                                eventDetails.geocodedBookingWhere.zip)) && // the zip doesn't match the bookingWhere.zip, then the location has changed since last geocoded
                    eventDetails.bookingWhere &&
                    eventDetails.bookingWhere.city &&
                    eventDetails.bookingWhere.state &&
                    eventDetails.bookingWhere.zip
                ) {
                    //if the event doesn't yet have a latLong attached to it, make one based on just the city, state zip they selected
                    const address =
                        eventDetails.bookingWhere.city +
                        ', ' +
                        eventDetails.bookingWhere.state +
                        ' ' +
                        eventDetails.bookingWhere.zip;
                    const geocodedAddress = await addressGeocode(address);

                    // eventDetails.createdBy &&
                    //     eventDetails.createdBy == 'ARTIST' &&
                    //     console.log(
                    //         eventDetails.artist.stageName +
                    //             ' wants to play a concert near ' +
                    //             address +
                    //             ': ',
                    //         geocodedAddress
                    //     );
                    // eventDetails.createdBy &&
                    //     eventDetails.createdBy == 'HOST' &&
                    //     console.log(
                    //         eventDetails.confirmedHost.firstName +
                    //             ' ' +
                    //             eventDetails.confirmedHost.lastName +
                    //             ' wants to host a concert near ' +
                    //             address +
                    //             ': ',
                    //         geocodedAddress
                    //     );

                    let hostsInReach = await Host.find({
                        adminActive: { $ne: false }, // $ne means "Not Equal" — I'm not sure every host has an "adminActive" field, but the ones that have been deactivated out should
                        active: { $ne: false }, // $ne means "Not Equal" — I'm not sure every host has an "active" field, but the ones that have opted out should
                        notificationFrequency: { $ne: 0 }, //don't email hosts who've opted out
                        latLong: {
                            $near: {
                                $maxDistance:
                                    eventDetails.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
                                $geometry: {
                                    type: 'Point',
                                    coordinates: geocodedAddress,
                                },
                            },
                        },
                    });
                    //console.log(await hostsInReach);
                    const hostsIDInReach = hostsInReach.map((hostInReach) => {
                        // console.log(
                        //     'Event City: ' +
                        //         eventDetails.city +
                        //         ' | Host: ' +
                        //         hostInReach.firstName +
                        //         ' ' +
                        //         hostInReach.lastName
                        // );
                        // console.log('hostInReach._id', hostInReach._id);
                        return { host: hostInReach._id };
                    });

                    let savedDetails = await eventDetails.updateOne(
                        {
                            $set: {
                                //$set added September 13, 20023
                                hostsInReach: hostsIDInReach,
                                'latLong.coordinates': geocodedAddress,
                                geocodedBookingWhere: eventDetails.bookingWhere,
                            },
                        },
                        { new: true }
                    );
                    if (savedDetails) {
                        // console.log('savedDetails:', savedDetails);
                        updatedEvents++;
                    }
                }
                if (
                    eventDetails.latLong &&
                    eventDetails.latLong.coordinates &&
                    eventDetails.latLong.coordinates.length > 0 &&
                    eventDetails.latLong.coordinates[0] !== 0 && //don't look for hostsInReach if eventDetails.latLong.coordinates are [0,0]
                    eventDetails.latLong.coordinates[1] !== 0 &&
                    eventDetails.hostReachRadius
                ) {
                    // console.log(
                    //     'new Date(eventDetails.createdAt)',
                    //     new Date(eventDetails.createdAt)
                    // );
                    let hostsToContact = await Host.find({
                        active: { $ne: false }, // $ne means "Not Equal" — I'm not sure every host has an "active" field, but the ones that have opted out should
                        notificationFrequency: { $ne: 0 }, //don't email hosts who've opted out
                        lastLogin: {
                            $not: { $gt: new Date(eventDetails.createdAt) }, //not greater than, so "less than or equal to", but this should also select documents where the lastLogin field doesn't exist yet -- https://www.mongodb.com/docs/manual/reference/operator/query/not/
                            // $lte: new Date(eventDetails.createdAt),
                        }, //if the host logged in before this event was created, they might not have seen it yet
                        lastEmailed: {
                            // $lte: new Date(eventDetails.createdAt),
                            $not: { $gt: new Date(eventDetails.createdAt) }, //not greater than, so "less than or equal to", but this should also select documents where the lastEmailed field doesn't exist yet -- https://www.mongodb.com/docs/manual/reference/operator/query/not/
                        }, //if we emailed the host before this event was created, they might not have seen it yet
                        latLong: {
                            $near: {
                                $maxDistance:
                                    eventDetails.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
                                $geometry: {
                                    type: 'Point',
                                    coordinates:
                                        eventDetails.latLong.coordinates,
                                },
                            },
                        },
                    });
                    //console.log(await hostsToContact);
                    const hostsIDToContact = hostsToContact.map(
                        async (hostToContact) => {
                            // console.log(
                            //     'Event City: ' +
                            //         eventDetails.bookingWhere.city +
                            //         ' | Host: ' +
                            //         hostToContact.firstName +
                            //         ' ' +
                            //         hostToContact.lastName
                            // );

                            // if (
                            //     hostToContact.notificationFrequency
                            //     //&& hostToContact.lastEmailed
                            // ) {
                            //this limits who we reach out to, until everyone has a "lastEmailed" ---- "notificationFrequency" defaults to 7
                            //hostToContact.notificationFrequency is never going to be 0, because we filtered that out in the database request
                            let today = new Date().getTime();
                            let hostLastEmailed = new Date(
                                hostToContact.lastEmailed || hostToContact.date //if !lastEmailed date just use the creation date of their profile——I think this is only going to be necessary for the first email we send to a host
                            ).getTime();
                            let differenceInDays =
                                (today - hostLastEmailed) / (1000 * 3600 * 24); //to calculate the no. of days between two dates, divide the time difference of both dates by no. of milliseconds in a day (1000*60*60*24) //https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
                            // console.log(
                            //     hostToContact.email +
                            //         ' last emailed ' +
                            //         differenceInDays +
                            //         ' days ago. notificationFrequency: ' +
                            //         hostToContact.notificationFrequency || 7
                            // );
                            if (
                                (hostToContact.notificationFrequency && //if the hostToContact has a notificationFrequency and the differenceInDays is greater than or equal to that number
                                    differenceInDays >=
                                        hostToContact.notificationFrequency) ||
                                (!hostToContact.notificationFrequency && //OR if the host has not specified their notificationFrequency, default to 7
                                    differenceInDays >= 7)
                            ) {
                                //if it's time to email this host
                                const theEventDate = new Date(
                                    eventDetails.bookingWhen
                                )
                                    .toDateString()
                                    .split(' ');
                                newEventDetails = {
                                    ...eventDetails._doc,
                                    bookingWhenFormatted: theEventDate,
                                };
                                // console.log(
                                //     'newEventDetails',
                                //     newEventDetails
                                // );
                                if (
                                    !hostsToEmailArray.includes(
                                        hostToContact.email
                                    )
                                ) {
                                    //if the hostToContact's email is not already in the array, add it

                                    const hostForCollection = {
                                        ...hostToContact._doc,
                                        createdAtGetTime: new Date(
                                            hostToContact.date
                                        ).getTime(),
                                        eventsForEmail: [newEventDetails],
                                    };
                                    //console.log('hostForCollection', hostForCollection);
                                    emailHostsCollection.push(
                                        hostForCollection
                                    );
                                    hostsToEmailArray.push(hostToContact.email);
                                } else {
                                    //if the hostToContact's email IS already in the array, append this event to the host's eventsForEmail
                                    _.map(emailHostsCollection, (host) => {
                                        if (
                                            host.email === hostToContact.email
                                        ) {
                                            _.assign(host, {
                                                eventsForEmail: [
                                                    ...host.eventsForEmail,
                                                    newEventDetails,
                                                ],
                                            });
                                        }
                                        return host;
                                    });
                                }
                            }
                            // }

                            //console.log('hostToContact._id', hostToContact._id);
                            return { host: hostToContact._id };
                        }
                    );

                    //Just to refresh the database daily
                    let hostsInReach = await Host.find({
                        // active: { $ne: false }, // $ne means "Not Equal" — I'm not sure every host has an "active" field, but the ones that have opted out should
                        latLong: {
                            $near: {
                                $maxDistance:
                                    eventDetails.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
                                $geometry: {
                                    type: 'Point',
                                    coordinates:
                                        eventDetails.latLong.coordinates,
                                },
                            },
                        },
                    });
                    const hostsIDInReach = hostsInReach.map((hostInReach) => {
                        //console.log('hostInReach._id', hostInReach._id);
                        return { host: hostInReach._id };
                    });

                    eventDetails.hostsInReach = hostsIDInReach;
                    eventDetails.markModified('hostsInReach');
                    // console.log('hostsIDInReach', await hostsIDInReach);
                    updatedEvents++;
                    //await eventDetails.save();
                    await eventDetails.updateOne({
                        $set: {
                            //$set added September 13, 20023
                            hostsInReach: hostsIDInReach,
                        },
                    });
                    //console.log('eventDetails', eventDetails);
                    //END daily database refresh
                }
                if (index === array.length - 1) resolve(); //so that we can return the results
            });
        });
        // console.log('updatedEvents:', await updatedEvents);

        loopThruEvents.then(() => {
            //console.log('hostsToEmailArray', hostsToEmailArray);
            //console.log('emailHostsCollection:', emailHostsCollection);
            // console.log(
            //     'emailHostsCollection.length',
            //     emailHostsCollection.length
            // );

            let loopThruHosts = new Promise((resolve, reject) => {
                emailHostsCollection.forEach(
                    async (hostToEmail, index, array) => {
                        console.log(
                            'sending to ' +
                                hostToEmail.email +
                                ': ' +
                                hostToEmail.firstName +
                                ' ' +
                                hostToEmail.lastName +
                                ' (' +
                                hostToEmail.eventsForEmail.length +
                                ' events)'
                        );

                        sendEmail(hostToEmail.email, {
                            event: 'HOST_EMAIL_DIGEST',
                            template: '5VAZYQK9RAM506GYRGYMMJ8X3D55',
                            ...hostToEmail,
                        });

                        let updatedHost = await Host.findOneAndUpdate(
                            //Update the Host's lastEmailed field, so that we can check it when we trigger the host email digest next time, to know if the host is ready for their next one
                            { _id: hostToEmail._id },
                            {
                                $set: { lastEmailed: new Date() },
                                $addToSet: { everyTimeEmailed: new Date() },
                            },
                            {
                                new: true, //return the new document (after the update) . . . the default is to return the original document before the update
                                rawResult: true,
                            } //https://mongoosejs.com/docs/tutorials/findoneandupdate.html#raw-result
                        ); //.select('-hadMeeting -sentFollowUp -notes');

                        if (index === array.length - 1) resolve(); //so that we can return the results
                    }
                );
            });

            loopThruHosts.then(() => {
                console.log(
                    'Sending host email digests to ' +
                        emailHostsCollection.length +
                        (emailHostsCollection.length > 1 ? ' hosts' : ' host') +
                        ' of the Porchlight Network.'
                );

                sendEmail('russellhein@gmail.com', {
                    event: 'ADMIN_EMAIL_DIGEST',
                    template: 'DX2C4B5H4XMMYDH7FB4YGNFRJDF5',
                    emailHostsCollection: [...emailHostsCollection],
                });

                // res.json(
                //     'Sending an email to ' +
                //         emailHostsCollection.length +
                //         (emailHostsCollection.length > 1 ? ' hosts' : ' host') +
                //         ' of the Porchlight Network.'
                // );
                //res.json(emailHostsCollection);
            });
            // if (emailHostsCollection.length === 0) {
            //     console.log("There aren't any hosts to email at this time.");
            //     // res.json("There aren't any hosts to email at this time.");
            // }
        });
    } catch (err) {
        console.error(err.message);
        // res.status(500).send('Server Error');
    }
};
