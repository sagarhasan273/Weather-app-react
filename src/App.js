/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Clock from './DateTime';
import { getRandomInt } from './GetRandomInteger';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [isDay, setIsDay] = useState(null);
  const [image, setImage] = useState(getRandomInt(1, 8));
  
  useEffect(() => {
    // Check if the Geolocation API is available in the browser
    if ("geolocation" in navigator) {
      // Get the current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // Do something with the latitude and longitude here
          try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3d0b0f87e3168c0c4e1230ddd21cfea5`;
            axios.get(url).then((response) => {
              const data = response.data;
              setData(data);
              if (data && data.sys) {
                const currentTime = new Date();
                const sunriseTime = new Date(data.sys.sunrise * 1000);
                const sunsetTime = new Date(data.sys.sunset * 1000);
                setIsDay(currentTime > sunriseTime && currentTime < sunsetTime);
              }
            });
          } catch (error) {
            console.error('Error fetching location info:', error);
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  }, [])

  const searchLocation = (event) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=3d0b0f87e3168c0c4e1230ddd21cfea5`;
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data)
        console.log(response.data)
        if (data && data.sys) {
          const currentTime = new Date(data.dt*1000);
          
          const sunriseTime = new Date(data.sys.sunrise * 1000);
          const sunsetTime = new Date(data.sys.sunset * 1000);
          setIsDay(currentTime > sunriseTime && currentTime < sunsetTime);
        }
      })
      setLocation('');
      setImage(getRandomInt(1, 8));
    }
  }

  return (
    <div className={`app ${isDay ? `day${image}` : "night"}`}>
      <div className='box'>
        <div className="search">
          <input
            value={location}
            onChange={event => setLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder='Enter Location'
            type="text" />
        </div>

        
        <div className="container">
          {data ? <Clock country={data.sys ? data.sys.country : null} /> : null}
          <div className="top">
            <div className="location">
              <div className='location_name'>{data.name}</div>
              <div className='country_name'>{data.sys ? data.sys.country : null}</div>
            </div>
            <div className="temp">
              {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>
          

          {data.name !== undefined &&
            <div className="bottom">
              <div className="feels">
                {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°C</p> : null}
                <p>Feels Like</p>
              </div>
              <div className="humidity">
                {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                <p>Humidity</p>
              </div>
              <div className="wind">
                {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
                <p>Wind Speed</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
