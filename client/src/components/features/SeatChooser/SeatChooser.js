import React from 'react';
import {Button, Progress, Alert} from 'reactstrap';
import {io} from 'socket.io-client';

import './SeatChooser.scss';

class SeatChooser extends React.Component {
  componentDidMount() {
    const {loadSeats, seatsUpdated} = this.props;

    this.socket = io(process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : 'localhost:8000', {cors: {origin: 'http://localhost8000'}});

    this.socket.on('connect', () => console.log('Consected as: ', this.socket.id));
    this.socket.on('connect_error', () => {
      console.error("ERROR - can't connect to socket.io server");
      setTimeout(() => this.socket.connect(), 10000);
    });

    this.socket.on('seatsUpdated', seats => {
      seatsUpdated(seats);
    });

    this.socket.on('disconnect', () => console.log('server disconnected'));
    loadSeats();
    // setInterval(function () {
    //   loadSeats();
    // }, 120000);
  }

  isTaken = seatId => {
    const {seats, chosenDay} = this.props;
    return seats.some(item => item.seat === seatId && item.day === chosenDay);
  };

  freeseats = () => {
    const {seats} = this.props;
    this.props.takenSeats = seats.length;
  };
  prepareSeat = seatId => {
    const {chosenSeat, updateSeat} = this.props;
    const {isTaken} = this;

    if (seatId === chosenSeat)
      return (
        <Button key={seatId} className="seats__seat" color="primary">
          {seatId}
        </Button>
      );
    else if (isTaken(seatId))
      return (
        <Button key={seatId} className="seats__seat" disabled color="secondary">
          {seatId}
        </Button>
      );
    else
      return (
        <Button key={seatId} color="primary" className="seats__seat" outline onClick={e => updateSeat(e, seatId)}>
          {seatId}
        </Button>
      );
  };

  render() {
    const {prepareSeat} = this;
    const {requests, seats, chosenDay} = this.props;
    const takenSeats = seats.filter(seat => seat.day === chosenDay).length;

    return (
      <div>
        <h3>Pick a seat</h3>
        <small id="pickHelp" className="form-text text-muted ml-2">
          <Button color="secondary" /> – seat is already taken
        </small>
        <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4">
          <Button outline color="primary" /> – it's empty
        </small>
        {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success && <div className="seats">{[...Array(50)].map((x, i) => prepareSeat(i + 1))}</div>}
        {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending && <Progress animated color="primary" value={50} />}
        {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error && <Alert color="warning">Couldn't load seats...</Alert>}
        <p className="text-center">Seats taken: {takenSeats}/50</p>
      </div>
    );
  }
}

export default SeatChooser;
