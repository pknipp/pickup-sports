import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import AuthContext from '../../auth';

const EditReservation = ({ match }) => {
  const resGameId = match.params.resGameId;
  const [reservationId, gameId] = resGameId.split('-').map(id => Number(id));
  const { fetchWithCSRF, currentUser, rerender, setRerender } = useContext(AuthContext);
  const [bools, setBools] = useState([[]]);
  const nullReservation = bools.reduce((pojo, prop) => {
    return {...pojo, [prop]: false};
  }, {id: 0, playerId: 0, gameId: 0, game: {address: '', dateTime: ''}});
  const [reservation, setReservation] = useState({...nullReservation,
    playerId: currentUser.id,
    id: reservationId,
    gameId
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      const res = await fetch(`/api/reservations/${resGameId}`);
      let newReservation = {...reservation, ...(await res.json()).reservation};
      Object.keys(newReservation).forEach(key => {
        if (newReservation[key] === null) newReservation[key] = key === 'extraInfo' ? '' : false;
      })
      newReservation.game.dateTime = moment(newReservation.game.dateTime).local().format().slice(0,-9);

      setReservation(newReservation);
      const newBools = newReservation.game.bools || [];
      for (let i = 0; i < newBools.length; i++) {
        const boolVal = newReservation.bools % 2;
        newBools[i] = [newBools[i], !!boolVal];
        newReservation.bools -= boolVal;
        newReservation.bools /= 2;
      }
      setBools(newBools);
    })();
  }, [reservation.id]);



  const handlePutPost = async e => {
    reservation.bools = [...bools].reverse().reduce((tot, bool) => {
      return 2 * tot + Number(bool[1]);
    }, 0);
    e.preventDefault();
    const res = await fetch(`/api/reservations${reservation.id ? ('/' + reservation.id) : ''}`, { method: reservation.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    });
    let newReservation = (await res.json()).reservation;
    if (reservation.id) {
      // PUT route
      setMessage("Success");
    } else {
      // POST route
      history.push('/');
    }
    setReservation(newReservation);
    // Is the following line necessary?
    setRerender(rerender + 1);
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch(`/api/reservations/${reservation.id}`, { method: 'DELETE'});
    if (res.ok) {
      setReservation(JSON.parse(JSON.stringify(nullReservation)));
      // Is the following unnecessary?
      setRerender(rerender + 1);
      history.push('/');
    }
  }

  return (
    <div className="simple">
      <form className="auth" onSubmit={handlePutPost}>
        <h4>
          {reservation.id ? "Change" : "Choose"} your reservation details for the {reservation.game.name} game at {reservation.game.address} on &nbsp;
          {reservation.game.dateTime.split('T')[0]} at &nbsp;
          {reservation.game.dateTime.split('T')[1]}.
        </h4>
        <span>Your preferences:</span>
        <div>
        {bools.map((bool, index) => (
          <div key={index}>
            <span>{bool[0]}:</span>
            <input
              name={bool[0]}
              type="checkbox"
              checked={bool[1]}
              onChange={e => {
                const newBools = [...bools];
                newBools[index][1] = e.target.checked;
                setBools(newBools);
              }}
            />
          </div>
        ))}
        </div>

        <span>Extra info about your reservation (optional):</span>
        <input
          type="text" placeholder="Extra Info" name="extraInfo" value={reservation.extraInfo}
          onChange={e => setReservation({...reservation, extraInfo: e.target.value})}
        />

        <button color="primary" variant="outlined" type="submit">
          {reservation.id ? "Modify" : "Make"} reservation
        </button>
        <span style={{color: "red", paddingLeft:"10px"}}>{message}</span>
      </form>
      {!reservation.id ? null :
        <form className="auth" onSubmit={handleDelete}>
          <button color="primary" variant="outlined" type="submit">
            Cancel reservation
          </button>
        </form>
      }
    </div>
  );
}

export default EditReservation;
