
import React, { useState } from 'react';

function Home() {

    const [latitude , setLatitude] = useState(null);

    const [longitude, setLongitube] = useState(null);

    const geo=navigator.geolocation

    // get user  current  location
    geo.getCurrentPosition(usercodes)

 
    function usercodes(position){

    let lat=position.coords.latitude

    let long=position.coords.longitude
    console.log(lat , long)

    setLatitude(lat)
    setLongitube(long)

    // 32°46'53.8"N 74°49'17.6"E
    }




  return (
    <div>
     
     <h1>{latitude}</h1>
     <h1>{longitude}</h1>
    </div>
  )
}

export default Home



// import React, { useEffect, useState } from 'react';

// function Home() {
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => setError(error.message)
//       );
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   return (
//     <div>
//       <h1>Jugal Sharma's Home</h1>
//       {error ? (
//         <p>Error: {error}</p>
//       ) : (
//         <p>
//           {location.latitude && location.longitude ? (
//             <>
//               Latitude: {location.latitude}, Longitude: {location.longitude}
//             </>
//           ) : (
//             "Getting location..."
//           )}
//         </p>
//       )}
//     </div>
//   );
// }

// export default Home;


