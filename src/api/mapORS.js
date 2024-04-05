import Openrouteservice from "openrouteservice-js";
import data from "../assets/ors.json";
import polyline from "@mapbox/polyline";
const ors_token = data["openRouteService_token"];

export async function getLocation(addresse) {
  const geocoding = new Openrouteservice.Geocode({ api_key: ors_token });
  try {
    let geocodeResponse = await geocoding.geocode({
      text: addresse,
      boundary_country: ["CA"],
    });
    //console.log(geocodeResponse);
    const coordinates =
      geocodeResponse["features"][0]["geometry"]["coordinates"];
    return coordinates;
  } catch (err) {
    console.error(await err);
    const coordinates = [0, 0];
    return coordinates;
  }
}

export async function setLocation(latitude, longitude) {
  const geocoding = new Openrouteservice.Geocode({ api_key: ors_token });
  try {
    let reverseGeocodeResponse = await geocoding.reverseGeocode({
      point: { lat_lng: [latitude, longitude] },
      size: 1,
      boundary_country: ["CA"],
    });
    const address =
      reverseGeocodeResponse["features"][0]["properties"]["label"];
    return address;
  } catch (err) {
    console.error(await err);
    const address = "address not found";
    return address;
  }
}

export async function getDirection(starting_address, end_address) {
  let routing = new Openrouteservice.Directions({ api_key: ors_token });
  try {
    let routingResponse = await routing.calculate({
      coordinates: [starting_address, end_address],
      profile: "driving-car",
      format: "json",
      maneuvers: "true",
    });
    //console.log(routingResponse);
    const polylinePoints = polyline.decode(
      routingResponse["routes"][0]["geometry"],
    );
    const steps = routingResponse["routes"][0]["segments"][0]["steps"];
    return { polylinePoints, steps };
  } catch (err) {
    console.error(await err);
    const polylinePoints = [];
    const steps = [];
    return { polylinePoints, steps };
  }
}
