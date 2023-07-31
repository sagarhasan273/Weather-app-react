import axios from "axios";

export default function weather() {
  if ("geolocation" in navigator) {
    // Get the current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Latitude: ", latitude);
        console.log("Longitude: ", longitude);

        // Do something with the latitude and longitude here
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3d0b0f87e3168c0c4e1230ddd21cfea5`;
          axios.get(url).then((response) => {
            const data = response.data;
            console.log(data)
            return data;
          });
        } catch (error) {
          console.error("Error fetching location info:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not available in this browser.");
  }
  return {};
};
