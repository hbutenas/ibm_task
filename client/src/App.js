import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, NavItem, Row } from "react-bootstrap";
import axios from "axios";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Line } from "react-chartjs-2";
var _ = require("lodash");

function App() {
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(null);
  const [data, setData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [cases, setCases] = useState([]);
  const [time, setTime] = useState([]);

  const chartData = {
    labels: time,
    datasets: [
      {
        label: "Cases",
        data: cases,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Deaths",
        data: deaths,
        fill: false,
        borderColor: "#742774",
      },
    ],
  };

  // Get all data from /api route and complete the loading
  const getAllData = async () => {
    try {
      const response = await axios.get("/api");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Get array only of unique values, get lose of duplicates
  const getCountries = () => {
    let countries = new Array();
    // Get all countries
    data.map((item) => {
      countries.unshift(item.country);
    });

    // Create new array with unique countries
    let filteredCounties = Array.from(new Set(countries));
    return filteredCounties;
  };

  // Look for matching values and save these values
  const handleClick = async (e) => {
    setLoadingData(true);
    // Get selected value from dropdown
    const selectedValue = e.target.innerHTML;
    try {
      // Making request by country param
      const response = await axios.get(`/api/${selectedValue}`);
      response.data.forEach((item) => {
        // Looking for countries
        if (item.country === selectedValue) {
          countryData.unshift(item);
        }
      });
      countryData.map((item, value) => {
        if (item.indicator === "cases") {
          cases.unshift(item.weekly_count);
          time.unshift(item.year_week);
        } else {
          deaths.unshift(item.weekly_count);
        }
      });
    } catch (error) {
      console.error(`Received an error: ${error}`);
    }
    setLoadingData(false);
  };

  // Get all data on first load
  useEffect(() => {
    getAllData();
  }, []);

  // Show loading screen
  if (loading) {
    return <Container className="loading">Loading...</Container>;
  }
  // Show loading screen
  if (loadingData) {
    return <Container className="loading">Preparing data...</Container>;
  }

  return (
    <>
      <Container>
        <Row>
          <DropdownButton title="Countries">
            {getCountries().map((item, key) => {
              return (
                <Dropdown.Item
                  key={key}
                  eventKey="option-1"
                  value={item}
                  onClick={(e) => {
                    handleClick(e);
                  }}
                >
                  {item}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </Row>
      </Container>
      <Line data={chartData} />
    </>
  );
}

export default App;
