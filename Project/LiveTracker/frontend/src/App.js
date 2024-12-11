import React from 'react'
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom'

import Home from "./page/Home"
import Leaflet from './page/Leaflet'


const router=createBrowserRouter([  /// install react router https://medium.com/@adebayosilas/introduction-to-react-router-v6-4-6-11-1-f56c7710282e
  {
  path:"/",
  element: <Home/>,
 
  },


  {
    path:"/let",
    element: <Leaflet/>,
   
    },
  

  
])


function App(){
  return <RouterProvider router={router} />
}
export default App
