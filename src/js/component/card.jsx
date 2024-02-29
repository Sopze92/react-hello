import React from "react";
import PropTypes from "prop-types";

const Card = (props) => {

  const dimensions= props.imageDimensions?? [640,360];

  const styles={
    aspectRatio: `1/${dimensions[1]/dimensions[0]}`,
  };

  const imageElement= props.imageURL ? (
      <img src={props.imageURL} className="img-thumbnail w-100" style={styles}/>
    ) : ( 
      <div className="w-100 bg-secondary-subtle d-flex justify-content-center align-items-center user-select-none" style={styles}>
        <span className="fs-3 fw-medium text-body-tertiary opacity-50">{`${dimensions[0]} x ${dimensions[1]}`}</span>
      </div>
    )


  return (
    <div className="card">
      <ul className="list-group list-group-flush">
        {imageElement}
        <li className="list-group-item text-center">
          <p className="fw-semibold fs-3">{props.title?? "Card Title"}</p>
          <p className="fw-medium">{props.text?? "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel sit praesentium laudantium voluptas ipsa tempora labore minima temporibus debitis non beatae placeat a facere soluta error accusantium, cupiditate ea quis!"}</p>
        </li>
        <li className="list-group-item d-flex justify-content-center py-3">
          <button className="btn btn-primary fw-semibold">{props.buttonLabel?? "Find Out More!"}</button>
        </li>
      </ul>
    </div>
  )
}

Card.propTypes= {
  title: PropTypes.string,
  text: PropTypes.string,
  imageURL: PropTypes.string,
  imagDimensions: PropTypes.string,
  buttonLabel: PropTypes.string,
}

export default Card;