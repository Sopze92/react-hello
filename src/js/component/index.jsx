import React from "react";

import Header from "./navbar.jsx";
import Footer from "./footer.jsx";
import Home from "./home.jsx";

let pageCurrent= <Home />;

const Index = () => {
	return (
    <React.Fragment>
		  <Header />
			<div className="container-fluid bg-light">
		  	{pageCurrent}
			</div>
		  <Footer />
    </React.Fragment>
  );
};

export default Index;