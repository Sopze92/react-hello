import React from "react";
import PropTypes from "prop-types";

const Jumbotron = (props) => {

  // there's no jumbotron on BootStrap 5

  return (
    <div className="p-4 mb-4 bg-body-secondary rounded-3">
      <div className="container-fluid py-5">
        <h1 className="display-2 fw-medium">{props.title}</h1>
        <p className="fs-5 fw-medium">{props.text}</p>
        <button className="btn btn-primary btn-lg fw-semibold">{props.buttonLabel}</button>
      </div>
    </div>
  )
}

Jumbotron.propTypes= {
  title: PropTypes.string,
  text: PropTypes.string,
  buttonLabel: PropTypes.string,
}

export default Jumbotron;