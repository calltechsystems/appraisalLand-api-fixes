// pages/event.js
import React from "react";
// import styles from "../styles/Event.module.css";

const Event = () => {
  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <h1>Annual Appraisal Event</h1>
        <p>Date: November 10, 2024 | Location: Grand Ballroom</p>
      </header>

      {/* Event Details Section */}
      <section className="details">
        <h2>Event Details</h2>
        <p>
          Join us for the Annual Appraisal Event where we celebrate the
          achievements of our team and recognize outstanding contributions. This
          event will feature guest speakers, award ceremonies, and networking
          opportunities.
        </p>
      </section>

      {/* Speakers Section */}
      <section className="speakers">
        <h2>Speakers</h2>
        <div className="speakerList">
          <div className="speaker">
            <h3>Jane Doe</h3>
            <p>CEO, Inspiring Innovations</p>
          </div>
          <div className="speaker">
            <h3>John Smith</h3>
            <p>Head of Product, Tech Solutions</p>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="rsvp">
        <h2>RSVP</h2>
        <p>Please confirm your attendance by registering below:</p>
        <button className="button">Register Now</button>
      </section>
    </div>
  );
};

export default Event;
