import React, { useState, useEffect } from "react";
import { Modal, Button, Card } from "antd";
import { Hash, styles } from "./packagesTableStyles";
import "./packageTable.css";
import moment from 'moment';

const ModalPackagesTable = props => {
  const [visible, updateVisibility] = useState(false);
  const [packageinfo, updatePackage] = useState(false);

  const { packInfo } = props;

  useEffect(() => {
    updatePackage(packInfo);
  }, [packInfo]);

  const showModal = () => {
    updateVisibility(true);
  };

  const handleCancel = () => {
    updateVisibility(false);
  };

  const parsedTimeToLocal = (time) => {
    const parsedTimestampString = moment.utc(time).format();
    const localParsedTimestamp = moment(parsedTimestampString).local().format("Do MMM YYYY - h:mm A");
    return localParsedTimestamp;
  }

  return (
    <div>
      <a hre="/#" onClick={showModal}>More Info</a>
      <Modal
        title="Package Info"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button
            style={{ margin: "0px 20px 20px 0px" }}
            type="primary"
            key="back"
            onClick={handleCancel}
          >
            Close
          </Button>
        ]}
        content={packInfo.PackageID}
      >
        {" "}
        <Card className="" style={styles.details}>
          <h4>Details</h4>
          <ul
            style={{ listStyleType: "none", padding: "8px 0" }}
            className="details-list"
          >
            <li>
              <span className="details-list-spec">Name:</span>
              {packageinfo.Name}
            </li>
            <li>
              <span className="details-list-spec">Package ID:</span>
              {packageinfo.LabelReference}
            </li>
            <li>
              <span className="details-list-spec">Location Name:</span>
              {packageinfo.PackagingLocationName}
            </li>
            <li>
              <span className="details-list-spec">Location:</span>
              {packageinfo && packageinfo.PackagingLocation.Latitude}{" "}
              {packageinfo && packageinfo.PackagingLocation.Longitude}
            </li>
            <li>
              <span className="details-list-spec">PO Reference:</span>
              {packageinfo.POReference}
            </li>
            <li>
              <span className="details-list-spec">Packaging Date:</span>
              {packageinfo.PackagingDate}
            </li>
          </ul>
        </Card>
        
            {packageinfo &&
              packageinfo.statusAll.map((data, i) => (
                <Card className="" style={styles.details}>
                  <h4>Event {i + 1}</h4>
                  <ul
                      style={{ listStyleType: "none", padding: "8px 0" }}
                      className="details-list"
                    >
                      <li>
                        <span className="details-list-spec">Event ID:</span>
                        {data.LabelReference}
                      </li>
                      <li>
                        <span className="details-list-spec">Event Date:</span>
                        {data.EventDate}
                      </li>
                      <li style={styles.type}>
                        <span className="details-list-spec">Event Type:</span>
                        {data.EventType}
                      </li>
                      <li>
                        <span className="details-list-spec">Event Location:</span>
                        {data.EventLocationName}
                      </li>
                      <li>
                        <span className="details-list-spec">EKSIGatewayID:</span>
                        {data.KsiSig.KSIGatewayID}{" "}
                      </li>
                      <li>
                        <span className="details-list-spec">EKSITimeStamp:</span>
                        {parsedTimeToLocal(data.KsiSig.KSITimeStamp)}{" "}
                      </li>
                      <li>
                        <span className="details-list-spec">EKSITxStateHash:</span>
                        {data.KsiSig.KSITxStateHash}{" "}
                      </li>
                      <li style={styles.hash}>
                        <span className="details-list-spec">KSISignature:</span>
                        {data.KsiSig.KSISignature}{" "}
                      </li>
                  </ul>
                </Card>
              ))}
     
      </Modal>
    </div>
  );
};

export default ModalPackagesTable;
