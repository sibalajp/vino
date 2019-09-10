import React, { useState, useEffect } from "react";
import DataTable from "../../components/dataTable/dataTable";
import { DashboardContainer, MenuContainer, Icons } from "./dashboardStyles";
import { loadNewBatch, loadReceivedBatch } from "../../services/batch.services";
import { ReactComponent as CreateIcon } from "../../img/create.svg";
import { ReactComponent as ReceiveIcon } from "../../img/receive_create.svg";
import Geocode from "react-geocode";
import { REACT_APP_MAP_TOKEN } from "../../config";

const Dashboard = props => {
  const [newBatch, updateNewBatch] = useState([]);
  const [receivedBatch, updateReceived] = useState([]);

  Geocode.setApiKey(REACT_APP_MAP_TOKEN);

  useEffect(() => {
    document.title = `Dashboard`;
    getTableData();
  }, []);

  const getTableData = async () => {
    let newBatch = await loadNewBatch();
    let receivedBatch = await loadReceivedBatch();

    updateReceived(receivedBatch);
    geoGet(newBatch).then(res => {
      updateNewBatch(res);
    });
  };

  const geoGet = newBatch => {
    return new Promise(resolve => {
      const length = newBatch.length - 1;
      newBatch.forEach(async (batch, i) => {
        geocodeLatLng(
          batch.ProductionLocation.Latitude,
          batch.ProductionLocation.Longitude
        ).then(res => {
          if (res) {
            batch.LocationName = res;
          } else {
            batch.LocationName =
              batch.ProductionLocation.Latitude +
              "," +
              batch.ProductionLocation.Longitude;
          }
          if (i === length) {
            setTimeout(() => {
              resolve(newBatch);
            }, 300);
          }
        });
      });
    });
  };

  const geocodeLatLng = async (lat, lng) => {
    const geo = Geocode.fromLatLng(lat, lng).then(
      response => {
        let state = response.results[0].address_components.find(address => {
          return address.types[0] === "administrative_area_level_1";
        });
        let country = response.results[0].address_components.find(address => {
          return address.types[0] === "country";
        });

        return state.long_name + ", " + country.long_name;
      },
      error => {
        console.error(error);
      }
    );

    return geo;
  };
  return (
    <div>
      <div style={{ padding: "7rem", paddingTop: "10rem" }}>
        <DashboardContainer>
          <MenuContainer>
            <Icons>
              <CreateIcon style={{ margin: "0 auto" }} />
            </Icons>
            <div style={{ width: "66%", textAlign: "left" }}>
              <div
                style={{
                  color: "#333333",
                  fontSize: "22px",
                  fontWeight: "600",
                  marginBottom: "-3px"
                }}
              >
                {receivedBatch.length}
              </div>
              <div style={{ color: "#A6A6A6", fontSize: "16px" }}>
                Received batches
              </div>
            </div>
          </MenuContainer>
          <MenuContainer>
            <Icons>
              <ReceiveIcon style={{ margin: "0 auto" }} />
            </Icons>
            <div style={{ width: "66%", textAlign: "left" }}>
              <div
                style={{
                  color: "#333333",
                  fontSize: "22px",
                  fontWeight: "600",
                  marginBottom: "-3px"
                }}
              >
                {newBatch.length}
              </div>
              <div style={{ color: "#A6A6A6", fontSize: "16px" }}>
                New batches
              </div>
            </div>
          </MenuContainer>
          <MenuContainer>
            <Icons>
              <CreateIcon style={{ margin: "0 auto" }} />
            </Icons>
            <div style={{ width: "66%", textAlign: "left" }}>
              <div
                style={{
                  color: "#333333",
                  fontSize: "22px",
                  fontWeight: "600",
                  marginBottom: "-3px"
                }}
              >
                492 tonnes
              </div>
              <div style={{ color: "#A6A6A6", fontSize: "16px" }}>
                Total yield
              </div>
            </div>
          </MenuContainer>
        </DashboardContainer>
        <DataTable
          newBatch={newBatch}
          receivedBatch={receivedBatch}
          parent={props}
        />
      </div>
    </div>
  );
};

export default Dashboard;
