import React from 'react'
import Header from './Header';
import MapCounty from '../DataComponent/MapCounty.js';
import MapState from '../DataComponent/MapState.js';
import MapBox from '../DataComponent/MapBox.js';
import Footer from './Footer.js';

function MainComponent() {
    return (
      <div className="MainComponent">
          <Header />    
          <MapBox />
          <Footer />
      </div>
    );
  }
  
  export default MainComponent;