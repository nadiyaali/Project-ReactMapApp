//Packages needed
//npm install leaflet
//npm install react-leaflet

//Add CSS for displaying map in App.css

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";

//Convert encoded polygon shapes to Array of LatLng points
import { decodePoints } from "./decodePoints";
import React, { useState, useEffect } from "react";
//Added additional properties to the default Polygon component
import PolygonWrapper from './PolygonWrapper';

export default function Map() {
    //This will store the output polygons
    const [polygons, setPolygons] = useState([]);
    
    // Fetch data from both API endpoints
    const fetchData = () => {
        Promise.all([
          fetch('http://geo-exercise.id.com.au/api/data'),
          fetch('http://geo-exercise.id.com.au/api/geo')
        ])
          .then(([response1, response2]) => Promise.all([response1.json(), response2.json()]))
          .then(([data1, data2]) => {
            //Store data from first endpoint in this array
            const data1Arr = [];
            for (const obj of data1.data) {
                //only GeoID, color and infobox is needed 
                const pData = {
                    GeoID: obj.GeoID,
                    Color: obj.color,
                    InfoBox : obj.InfoBox
                }
                data1Arr.push(pData);
            }
            //console.log(data1Arr);
            //For polygon shapes, get data from second API point
            for (const shape of data2.shapes) {
                const polygon = decodePoints(shape.points);
                //Match ID to GeoID of previous data
                const resultPoly = data1Arr.find((poly) => poly.GeoID === shape.id);
                //console.log(resultPoly);
                //Format infobox data into a HTML list items
                const propertyList = [];
                Object.keys(resultPoly.InfoBox).forEach((key) => {
                    propertyList.push(
                      <li key={key}>
                        <strong>{key}:</strong> {resultPoly.InfoBox[key]}
                      </li>
                    );
                  });
                  //Create polygon object and save it into React state
                const polygonColor = {
                    id: shape.id,
                    positions: polygon,
                    pathOptions : { color: resultPoly.Color },
                    infoBox : propertyList
                }
                
                //console.log(polygonColor);
                setPolygons(polygons => [...polygons, polygonColor]);
            }
            })
            .catch((error) => {
              console.log(error);
            });
        };


  useEffect(() => {
    fetchData();
  }, []);

  const position = [-37.90874, 145.0791]
  return(
    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
     
     
        {
        polygons.map((p) => (
        <PolygonWrapper id={p.id} pathOptions={p.pathOptions} positions={p.positions} infoBox={p.infoBox}/>
      ))} 

    </MapContainer>
  );

 }
 