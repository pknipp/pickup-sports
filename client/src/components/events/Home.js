import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';

import Context from '../../context';
// import fetch from "node-fetch";

const Home = () => {
    const options = [
        ["events organized by you", "Manage event details", "View event details"],
        ["events for which you are registered", "Manage reservation"],
        ["events for which you are not registered", "Create reservation"]
    ];
    const { user, genders } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [allEvents, setAllEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [sportsLength, setSportsLength] = useState(null);
    const [keys, setKeys] = useState([]);
    const [selectedOption, setSelectedOption] = useState(1);
    const [columns, setColumns] = useState(keys.map(key => ({dataField: key, text: key, sort: true})));
    const [message, setMessage] = useState('');

    const defaultSorted = [{dataField: 'Sport', order: 'asc'}];

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/events`);
            let data = await response.json();
            if (response.ok) {
                setSportsLength(data.sportsLength);
                let newAllEvents = data.events;
                newAllEvents.forEach(event => {
                    let [EventDate, EventTime] = moment(event.dateTime).local().format().split("T");
                    EventTime = EventTime.slice(0, 5);
                    let minutes = Math.round(event.duration.value / 60);
                    let hours = Math.floor(minutes / 60);
                    hours = (hours < 10 ? "0" : "") + hours;
                    minutes -= hours * 60;
                    minutes = (minutes < 10 ? "0" : "") + minutes;
                    event["Travel time"] = hours + ":" + minutes;
                    event["Event date"] = EventDate;
                    event["Event time"] = EventTime;
                    ['dateTime', 'duration'].forEach(key => delete event[key]);
                    event['Extra info'] = event['Extra info'] &&
                        <span className="ttip" data-toggle="tooltip" title={event['Extra info']}>
                            yes (hover)
                        </span>;
                    event["Player reservations"] = event && <span className="ttip" data-toggle="tooltip" title={event.Nicknames}>
                        {event["Player reservations"]}
                    </span>;
                    ['Maximum skill', 'Minimum skill'].forEach(key => {
                        event[key] = event.Skills[event[key]];
                    });
                });
                setAllEvents(newAllEvents);
            } else {
                setMessage(data.message || data.error.errors[0]);
            }
            setLoading(false);
        })()
    }, [user.id]);

    useEffect(() => {
        let newEvents = allEvents.filter((event, i) => {
            let bool;
            if (selectedOption) {
                bool = (!(selectedOption - 1) !== !event.reservationId);
            } else {
                bool = (event["Event organizer"] === user.Nickname);
            }
            return bool;
        });
        newEvents.forEach(event => {
            let editPath;
            if (selectedOption) {
                editPath = `/reservations/${event.reservationId}-${event.id}`;
            } else {
                editPath = `/editEvents/${event.id}`;
            }
            let viewPath = `/viewEvents/${event.id}`;
            event.edit = (
                <NavLink
                    exact to={editPath}
                    className="nav"
                    activeClassName="active"
                >
                    {options[selectedOption][1]}
                </NavLink>
            );
            event.view = (
                <NavLink
                    exact to={viewPath}
                    className="nav"
                    activeClassName="active"
                >
                    {options[selectedOption][2]}
                </NavLink>
            )
        });
        setEvents(newEvents);
        if (newEvents.length) {
            let headings = (!newEvents.length ? [] : Object.keys(newEvents[0])).filter(col => {
                return !["id", "reservationId", "Skills", "Nicknames"].includes(col);
            });
            // order of columns to appear in table
            let newColumns = [4,5,7,2,8,9,6,3,0,1,10,11].map(index => headings[index]).filter(col => {
                // We want to omit one column, depending upon whether or no User "owns" the event.
                return ![selectedOption ? 'view' : 'Event organizer'].includes(col);
            }).map(col => {
                // Make clickable columns un-headed, to prevent sort-ability, among other reasons.
                let text = ['edit', 'view'].includes(col) ? '' : col
                // It makes no sense to sort on clickable columns.
                return {dataField: col, text, sort: !!text};// && !text.includes("skill")};
            });
            setColumns(newColumns);
        }
    }, [allEvents, selectedOption]);

    return (
        <div className="simple wide">
            <div className="welcome">
                <h3>{!loading ? (sportsLength ? "Below are tabulated the events which may interest you." : "You are presently following no sports.  You should click on  'Manage Favorites' in order to choose some to follow.") : ""}</h3>
            </div>
            <br/>
            <div>
                {options.map((option, i) => (
                    <span key={i}>
                        <input
                            type="radio"
                            value={i}
                            checked={i === selectedOption}
                            onChange={e => setSelectedOption(Number(e.target.value))}
                        />
                        <span>{option[0]}</span>
                    </span>
                ))}
            </div>
            <br/>
            {!selectedOption &&
                <div>
                    <NavLink exact to={"/editEvents/0"} className="nav" activeClassName="active">
                        <div>Create new event</div>
                    </NavLink>
                </div>
            }
            {loading ? <h2>Loading data</h2> :
                !columns.length || !events.length ? <h3>no events in this category</h3> :
                    <>
                        <h4>Click any column heading in order to sort the table on that column.</h4>
                        <BootstrapTable keyField='id' data={events} columns={columns} defaultSorted={defaultSorted}/>
                    </>
            }
        </div>
    )
}
export default Home;
