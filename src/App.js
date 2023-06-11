import React, { useState, useEffect } from "react";
import { TextField, Grid, Typography, Box, Card, CardContent, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

//  API URLs
const API_PEOPLE = "https://swapi.dev/api/people/";
const API_VEHICLE = "https://swapi.dev/api/vehicles/";

//  Style settings
const useStyles = makeStyles((theme) => ({
  root: {
  },
  app: {
  },
  search: {
    margin: "30px"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "50px",
  },
  beingCircle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderRadius: "50%",
    backgroundColor: "#35617d",
    cursor: "pointer",
    margin: "16px",
    color: "#fff",
    textTransform: "uppercase",
    transition: "1s",
    "&:hover": {
      transform: "scale(1.25)",
    },
  },
  card: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1000px",
    height: "600px",
    border: "5px solid #ffff00",
    color: "#d2dad0",
    backgroundColor: "#9c9c9c",
    maxWidth: "90%",
  },
  cardName: {
    position: "absolute",
    top: "7%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    marginBottom: "10px",
    
  },
  cardData: {
    marginBottom: "10px",
  },
  cardDataBoxLeft: {
    position: "fixed",
    top: "20%",
    marginLeft: "30px",
  },
  cardDataBoxRight: {
    position: "fixed",
    marginLeft: "30px",
    left: "50%",
    top: "20%"
  },
  verticalLine: {
    position: "fixed",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1px",
    height: "70%",
    backgroundColor: "#35617d",
  },
}));

const App = () => {
  //  Variables
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [beings, setBeings] = useState([]);
  const [vehicleClicked, setVehicleClicked] = useState(null);
  const [beingClicked, setBeingClicked] = useState(null);

  //  On start all Star Wars beings will be fetched
  useEffect(() => {
    searchAllBeings(1, beings);
  }, []);
  
  //  Function that recursively collects all available beings going page after page
  const searchAllBeings = async (page, beings) => {
    try {
      const response = await fetch(`${API_PEOPLE}/?page=${page}&format=json`);
  
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
  
      const data = await response.json();
  
      const allBeings = [...beings, ...data.results];
  
      if (data.next) {
        setBeings(allBeings);
        await searchAllBeings(page + 1, allBeings);
      } else {
        setBeings(allBeings);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  //  Function that returns a box object of a single being
  const BeingCircle = ({ being }) => {
    return (
      <Box
        className={classes.beingCircle}
        onClick={() => handleBeingClick(being.name)}
      >
        <Typography variant="h6" fontSize="15px">{being.name}</Typography>
      </Box>
    );
  };
  //  Function that saves which being was clicked
  const handleBeingClick = (key) => {
    setBeingClicked(key);
  };

  //  Function that returns a beings card with their information
  const BeingCard = ({ being: { name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, homeworld, films, species, vehicles, starships } }) => {
    const data = [
      { label: "Height", value: height },
      { label: "Mass", value: mass },
      { label: "Hair color", value: hair_color },
      { label: "Skin color", value: skin_color },
      { label: "Eye color", value: eye_color },
      { label: "Birth year", value: birth_year },
      { label: "Gender", value: gender }
    ];
    return (
      <Card className={classes.card}>
        <CardContent>

          {/* Close Button */}
          <Button 
            style={{ position: "fixed", top: "100px", left: "50%", padding: "20px 20px", marginLeft: "29vw", marginTop: "-12vh", fontWeight: "bold" }} 
            color="primary" 
            padding="10x" 
            onClick={() => handleXClick()} 
            >
            X
          </Button>

          {/* Name of the being */}
          <Typography 
            variant="h5" 
            fontSize="3vw" 
            fontWeight="bold" 
            className={classes.cardName}
            >
            {name}
          </Typography>

          {/* Draws a vertical line in the middle and other information of a being */}
          <Box className={classes.cardDataBoxLeft}>
            <div className={classes.verticalLine}></div>
            {data.map(item => (
              <Typography 
                fontSize="2.5vw" 
                className={classes.cardData} 
                key={item.label}
              >
                <strong>{item.label}:</strong> {item.value}
              </Typography>
            ))}
          </Box>

          {/* Draws information and buttons to beings vehicles (if they exist) */}
          <Box className={classes.cardDataBoxRight}>
            {vehicles.length > 0 && (
              <>
                <Typography fontSize="2.5vw">
                  <strong>Vehicles:</strong>
                </Typography>
                
                {vehicles.map((vehicle, index) => (
                  <Button 
                    style={{ padding: "20px 12vw", margin: "15px" }} 
                    variant="contained" 
                    color="primary" 
                    padding="10x" 
                    onClick={() => handleVehicleClick(vehicle.substring(vehicle.length - 3, vehicle.length - 1))} 
                    className={classes.vehicleButton}
                  >
                    {vehicle.substring(vehicle.length - 3, vehicle.length - 1)}
                  </Button>
                ))}
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  } 
  //  Function that collects data for a specific vehicle
  const handleVehicleClick = async (key) => {
    const response = await fetch(`${API_VEHICLE}${key}/?format=json`);
    const data = await response.json();
    console.log(data);
    setVehicleClicked(data);
  };
  //  Function that returns a vehicles card with its information
  const VehicleCard = ({ vehicle: { name, model, manufacturer, cost_in_credits, length, max_atmosphering_speed, crew, passengers, cargo_capacity, consumables, vehicle_class } }) => {
    const data = [
      { label: "Model", value: model },
      { label: "Manufacturer", value: manufacturer },
      { label: "Cost", value: cost_in_credits },
      { label: "Length", value: length },
      { label: "Max speed", value: max_atmosphering_speed },
      { label: "Crew", value: crew },
      { label: "Passengers", value: passengers },
      { label: "Cargo", value: cargo_capacity },
      { label: "Consumables", value: consumables },
      { label: "Class", value: vehicle_class }
    ];
    return (
      <Card className={classes.card}>
        <CardContent>

          {/* Back Button */}
          <Button 
            style={{ padding: "20px 20px", fontWeight: "bold" }} 
            variant="text" 
            color="primary" 
            padding="10x" 
            onClick={() => handleBackClick()} 
          >
            <span>{"<-"}</span>
          </Button>

          {/* Close Button */}
          <Button 
            style={{ position: "fixed", top: "100px", left: "50%", padding: "20px 20px", marginLeft: "29vw", marginTop: "-12vh", fontWeight: "bold" }} 
            variant="text" 
            color="primary" 
            padding="10x" 
            onClick={() => handleXClick()} 
            >
            X
          </Button>

          {/* Draws name of the vehicle */}
          <Typography 
            variant="h5" 
            fontSize="3vw" 
            fontWeight="bold"  
            className={classes.cardName}
            >
            {name}
          </Typography>

          {/* Draws the vehicles information */}
          <Box className={classes.cardDataBoxLeft}>
            {data.map(item => (
              <Typography 
                fontSize="1.5vw" 
                className={classes.cardData} 
                key={item.label}
              >
                <strong>{item.label}:</strong> {item.value}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };
  //  Function that closes vehicle card to go back to being card
  const handleBackClick = () => {
    setVehicleClicked(null);
  };
  //  Function that closes opened cards
  const handleXClick = () => {
    setBeingClicked(null);
    setVehicleClicked(null);
  };


  return (
    <div className={classes.app}>
      {/* Draws pages title */}
      <Typography variant="h2" align="center" margin="30px" >STAR WARS</Typography>

      {/* Draws search bar */}
      <Box className={classes.search}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for Star Wars beings"
          variant="outlined"
          fullWidth
          />
      </Box>

      {/* If there is search input then shows beings that match the search, otherwise shows all (if data has been collected) */}
      {searchTerm.length > 0 ? (
        <Grid container className={classes.container}>
          {beings.map((being) => (
            being.name.toLowerCase().includes(searchTerm.toLowerCase()) && (
              <Grid item key={being.name}>
                <BeingCircle being={being} />
              </Grid>
            )
            ))}
        </Grid>
      ) : (beings.length > 0 ? (
        <Grid container className={classes.container}>
          {beings.map((being) => (
            <Grid item key={being.name}>
              <BeingCircle being={being} />
            </Grid>
          ))}
        </Grid>
      ) : (
        null
        ))}

      {/* If a being has been clicked, then shows a card with said beings information */}
      {beingClicked && (
        <Card>
          {beings.map((being) => (
            being.name === beingClicked && (
              <BeingCard being={being} key={being.name} />
              )
              ))}
        </Card>
      )}

      {/* If a vehicle has been clicked, then shows a card with said vehicles information */}
      {vehicleClicked && (
        <VehicleCard vehicle={vehicleClicked} key={vehicleClicked.name} />
      )}
    </div>
  );
};

export default App;