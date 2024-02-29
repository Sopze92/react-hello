import React from "react";

// home.jsx is no longer the main page, now is index.jsx

import Jumbotron from "./jumbotron.jsx";
import Card from "./card.jsx";

const cardThumbnailDimensions= [500,325];

const Home = () => {

	return (
		<main className="container-fluid p-4 gap-4">
			<div className="row">
				<Jumbotron 
					title="A Warm Welcome!"
					text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia quae distinctio qui. Tempora atque voluptatem enim nostrum, iure corrupti! Saepe officia non dolore veritatis error consequatur magnam, voluptates quos aperiam."
					buttonLabel="Call to action!"
				/>
			</div>
			<div className="row gap-4 flex-column flex-xl-row">
				<div className="col d-flex m-0 p-0 gap-4 flex-column flex-md-row flex-xl-row">
					<div className="col m-0 p-0">
						<Card 
							title="First Card"
							imageDimensions={cardThumbnailDimensions}/
						>
					</div>
					<div className="col m-0 p-0">
						<Card 
							title="Second Card"
							imageDimensions={cardThumbnailDimensions}/
						>
					</div>
				</div>
				<div className="col d-flex m-0 p-0 gap-4 flex-column flex-md-row flex-xl-row">
					<div className="col m-0 p-0">
						<Card 
							title="Third Card"
							imageDimensions={cardThumbnailDimensions}/
						>
					</div>
					<div className="col m-0 p-0">
						<Card 
							title="Fourth Card"
							imageDimensions={cardThumbnailDimensions}/
						>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Home;
