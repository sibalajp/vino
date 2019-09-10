import React, { useEffect, useState } from "react";

import { Link } from "./inventoryIntelligenceStyle";
import { node } from "prop-types";
import InventoryGraphModal from "./inventoryGraphModal";
import moment from "moment";
import { useTranslation } from "react-i18next";

const InventoryGraphLabel = props => {
  // nodeData is coming from the tree module
  const [graphState, updateGraphState] = useState([]);
  const { graph, nodeData } = props;

  const { t } = useTranslation();

  useEffect(() => {
    updateGraphState(graph);
  }, [graph]);
  const parsedTimeToLocal = time => {
    if (
      moment(time, "Do MMM YYYY - h:mm A").format("Do MMM YYYY - h:mm A") ===
      time
    ) {
      return time;
    }
    const parsedTimestampString = moment.utc(time).format();
    const localParsedTimestamp = moment(parsedTimestampString)
      .local()
      .format("Do MMM YYYY - h:mm A");
    return localParsedTimestamp;
  };

  const getEventNameMapping = () => {
    if (nodeData.attributes) {
      switch (nodeData.attributes.EventType) {
        case "UnregisteredBottleEvent":
          return "Unknown Event";

        case "BottleProducedEvent":
          return "New Bottle";

        case "WineSalesToDistributorEvent":
          return "Sales";

        case "WineDistributionToDistributorEvent":
          return "Distribution";

        case "WineReceivedByDistributorEvent":
          return "Received";

        default:
          return null;
      }
    }
  };

  return (
    <span>
      {nodeData.name === "Bottle" ? (
        <Link>
          {t("Label Reference")}: {nodeData.label} <br />
          {t("Wine Name")} : {nodeData.wineName} <br />
          {t("Wine Year")}: {nodeData.year}{" "}
          <Link>
            <InventoryGraphModal bottle={graphState} />
          </Link>
        </Link>
      ) : nodeData.name === "BottleHist" ? (
        <div>
          <Link>
            {t("Event Name")}: {getEventNameMapping()}
          </Link>
          <br />
          <Link>
            {t("Blockchain Time")}:{" "}
            {nodeData.attributes.KsiSig
              ? parsedTimeToLocal(nodeData.attributes.KsiSig.KSITimeStamp)
              : ""}
          </Link>{" "}
          <br />
          <Link>
            {t("Blockchain ID")} :{" "}
            {nodeData.attributes.KsiSig
              ? nodeData.attributes.KsiSig.KSIGatewayID
              : ""}
          </Link>{" "}
          <br />
          <Link>
            {t("Blockchain tx hash")}:{" "}
            {nodeData.attributes.KsiSig
              ? nodeData.attributes.KsiSig.KSITxStateHash.substring(0, 20)
              : ""}
          </Link>
          <br />
          <Link>
            {t("Event Location")}:{" "}
            {nodeData.attributes.scanLocation
              ? nodeData.attributes.scanLocation
              : nodeData.attributes.Location
              ? nodeData.attributes.Location.Latitude +
                ", " +
                nodeData.attributes.Location.Longitude
              : ""}
          </Link>
        </div>
      ) : (
        <div>
          <span>
            {t("Authenticate Result")}:{" "}
            {nodeData.attributes ? nodeData.attributes.AuthenticateResult : ""}
          </span>
          <br />
          <span>
            {t("Bottle Scan Status")}:{" "}
            {nodeData.attributes ? nodeData.attributes.BottleSCEventStatus : ""}
          </span>
          <br />
          <span>
            {/* {t("")}   */}
            {t("Event Location")}:{" "}
            {nodeData.attributes.scanLocation
              ? nodeData.attributes.scanLocation
              : nodeData.attributes.Location
              ? nodeData.attributes.Location.Latitude +
                ", " +
                nodeData.attributes.Location.Longitude
              : ""}
          </span>
          <br />
          <span>
            {/* Blockchain User: {nodeData.attributes ? nodeData.attributes.id : ""} */}
          </span>
          <span></span>
        </div>
      )}
    </span>
  );
};

export default InventoryGraphLabel;
