import { Polygon, Popup} from "react-leaflet";

function PolygonWrapper({ id, positions, pathOptions, infoBox}) {
  // You can use the ID for any custom logic or styling
  // within this wrapper component
  return(
  <Polygon positions={positions} pathOptions={pathOptions} >
   <Popup>
       <ul> {infoBox} </ul>
    </Popup>
  </Polygon>
  );
}

export default PolygonWrapper;