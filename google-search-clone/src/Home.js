/* Home.js */

import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import logoImage from './logo.jpg';
import doodleIconImage from './DoodleIcon.png';
import pic1Image from './pic1.png';
import pic2Image from './pic2.png';
import pic3Image from './pic3.png';
import p4Image from './p4.jpg';

import './Home.css';

const Home = () => {
  // Configuration for the react-slick slider
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Adjust the autoplay speed as needed (in milliseconds),
    centerMode: true,
    centerPadding: '0',
  };

  return (
    <>
      <header>
        <img src={logoImage} alt="Dawn Logo" id="dawn-logo" />
        <h1>Dawn News Archive 2010-2021</h1>
      </header>

      <div className="carousel-section">
        <Slider {...sliderSettings} className="black-carousel">
          {/* Slide 1 */}
          <div className="news-container">
            <div className="news-item">
              <Link to="https://www.dawn.com/news/1075893/subjective-choice">
                <div className="card">
                  <div className="caption right-caption">
                    The earliest formal establishment of higher learning was perhaps Academy, founded in roughly 387 BC by Plato in Athens, Greece.<br /><br />
                  </div>
                  <img src={pic1Image} alt="Pic 1" className="news-img" />
                </div>
              </Link>
            </div>
          </div>

          {/* Slide 2 (removed) */}

          {/* Slide 3 */}
          <div className="news-container">
            <div className="news-item">
              <Link to="https://www.dawn.com/news/1077523/samsung-to-top-tv-market-for-8th-yea">
                <div className="card">
                  <div className="caption right-caption">
                    <span className="seoul-text">SEOUL:</span> Samsung Electronics is expected to maintain the global top TV manufacturer that sold the most number of flat-screen TVs for the eighth consecutive year, according to a source.<br /><br />
                  </div>
                  <img src={pic2Image} alt="Pic 2" className="news-img" />
                </div>
              </Link>
            </div>
          </div>

          {/* Slide 4 */}
          <div className="news-container">
            <div className="news-item">
              <Link to="https://www.dawn.com/news/1077537/2013s-biggest-moments-in-sports">
                <div className="card">
                  <div className="caption right-caption">
                    <span className="seoul-text">SEOUL:</span> Victoria Azarenka managed to win the second Grand Slam title of her young<br /> career during the Australian Open, despite being persistently skewered by the media<br /> in the two days leading up to the final, due to her controversial call <br />for a medical time out in a previous match.
                  </div>
                  <img src={pic3Image} alt="Pic 3" className="n-img" />
                </div>
              </Link>
            </div>
          </div>
        </Slider>

        {/* Doodle Icon Section */}
        <div className="doodle-section">
          <div className="news-item">
            <Link to="/app">
              <img src={doodleIconImage} alt="Doodle Icon" id="doodle-icon" />
            </Link>
            <p>
              <Link to="/app" className="dawn-doodle-btn">Explore the Search Retrieval System</Link>
            </p>
            <div className="caption">
              This project is dedicated to enhancing the user experience in navigating the extensive Dawn News Archive, covering news from 2010 to 2021. Employing sophisticated technologies like Python, Flask, React, and MongoDB, our objective is to develop a robust and user-friendly search retrieval system. A noteworthy aspect of this endeavor involves the strategic integration of Natural Language Processing (NLP) techniques, augmenting the system's capacity to comprehend and process user queries in a natural language context.
            </div>
          </div>
        </div>
      </div>

       <div className="news-container">
        <ul className="more-links">
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1076862/treason-the-real-test">Treason: The Real Test</Link></li>
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1076465/pm-sharif-among-billionaire-lawmakers">PM Sharif Among Billionaire Lawmakers</Link></li>
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1059366/gen-raheel-sharif-gets-baton-of-command">Gen Raheel Sharif Gets Baton of Command</Link></li>
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1060629/pakistan-cant-win-war-against-india-says-singh">Pakistan Can't Win War Against India, Says Singh</Link></li>
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1059731/sharif-assures-karzai-of-access-to-baradar">Sharif Assures Karzai of Access to Baradar</Link></li>
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1076716/pm-offers-special-plane-to-bring-home-musharrafs-ailing-mother">PM Offers Special Plane to Bring Home Musharraf's Ailing Mother</Link></li>
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1059731/sharif-assures-karzai-of-access-to-baradar">Treason: the real test</Link></li>
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1075498/us-diplomat-row-overlooks-indian-mai">US Diplomat Row Overlooks Indian Maize</Link></li>
          <li><img src={p4Image} alt="Pic 4" /> <Link to="https://www.dawn.com/news/1060662/nsa-tracks-mobile-phone-locations-without">NSA Tracks Mobile Phone Locations Without</Link></li>
        </ul>
      </div>

      <div className="footer">
        <p>ALL RIGHTS RESERVED BY AMARA HABIB & AYESHA JABBAR</p>
      </div>
    </>
  );
};

export default Home;