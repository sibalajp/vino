import React, { useState, useEffect, useRef } from "react";
import { Card, Icon, Timeline, Popover, Tooltip, Button, Table } from "antd";
import SupplyChain from "./supplyChain";
import {
  createPackageDistEvent,
  getPackage,
  getDistributorNameById,
  getPackageDetails
} from "../../services/package.service";
import moment from "moment";
import { styles } from "./packageDetailsStyles";
import "./packageDetails";
import { ReactComponent as GrapesIcon } from "../../img/grapes_1.svg";
import { ReactComponent as Logo } from "../../img/guardtime-logo.svg";
import PackageDetailsTable from "./packageDetailsTable";

const { Meta } = Card;

const PackageDetails = props => {
  const [wineBatchKsigs, updateWineBatchKsigs] = useState([]);
  const [packageInfo, updatePackageInfo] = useState({});
  const [iconLoading, enterIconLoading] = useState(false);
  const [copyText, updateCopyText] = useState("Click Hash To Copy");
  const { packInfo } = props.location.state;

  const textAreaRef = useRef(null);

  useEffect(() => {
    updatePackageInfo(packInfo);
  }, [packInfo]);
  console.log("packInfo", packInfo)
  const getSupplyChain = () => {
    if (packageInfo.statusAll && packageInfo.statusAll.length > 0) {
      return packageInfo.statusAll
        .slice(0)
        .reverse()
        .map((data, i) => {
          data.KsiSig.parsedKSITimeStamp = parsedTimeToLocal(
            data.KsiSig.KSITimeStamp
          );
          return <SupplyChain key={i} packageInfo={data} />;
        });
    }
  };

  const parsedTimeToLocal = time => {
    const parsedTimestampString = moment.utc(time).format();
    const localParsedTimestamp = moment(parsedTimestampString)
      .local()
      .format("Do MMM YYYY - h:mm A");
    return localParsedTimestamp;
  };

  const copyHash = e => {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    updateCopyText("Copied!");
    setTimeout(() => {
      updateCopyText("Click Hash To Copy!");
    }, 1000);
  };

  const getSubString = ksigsig => {
    if (ksigsig) {
      return ksigsig.substring(0, 21);
    }
    return "";
  };

  const handleDistribute = async () => {
    const eventBody = {
      PackageID: packageInfo.PackageID,
      EventDate: packageInfo.status.EventDate,
      EventOwnerReference: packageInfo.DistributorID,
      EventLocation: {
        Latitude: packageInfo.status.EventLocation.Latitude,
        Longitude: packageInfo.status.EventLocation.Longitude
      },
      EventLocationName: packageInfo.status.EventLocationName,
      EventDocumentReferenceID: packageInfo.status.EventDocumentReferenceID
    };

    enterIconLoading(true);
    try {
      const newEvent = await createPackageDistEvent(eventBody);

      let pack = await getPackage(newEvent.PackageID);
      pack.DistInfo = await getDistributorNameById(pack.DistributorID);
      pack.Name = pack.DistInfo.Name;
      const status = await getPackageDetails(pack.PackageID);
      if (status.length) {
        pack.status = status[0];
        pack.statusAll = status;
      }
      updatePackageInfo(pack);
      if (status) {
        enterIconLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const popContent = pack => {
    return (
      <div>
        <div>
          <b>KSI Gateway ID:</b> {pack.KSIGatewayID}
        </div>
        <div>
          <b>KSI Transaction Hash:</b> {pack.KSITxStateHash}
        </div>
        <div>
          <b>KSI Transaction Timestamp:</b> {pack.parsedKSITimeStamp}
        </div>
        <div style={styles.BlockChain}>
          <b>KSI Blockchain Signature:</b> {pack.KSISignature}
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingTop: "11rem", paddingBottom: "2rem" }}>
      <Card style={styles.BatchHead}>
        <Meta
          style={styles.Meta}
          avatar={
            <Icon component={GrapesIcon} {...props} style={styles.Avatar} />
          }
          title={"Summary"}
          description={""}
        />
        <li>
          <span className="details-list-spec">Packaging date :</span>
          {packageInfo.PackagingDate}
        </li>
        {packageInfo.Bottles && (
          <li>
            <span className="details-list-spec">Number of bottles:</span>
            {packageInfo.Bottles.length}
          </li>
        )}
        <li>
          <span className="details-list-spec">Package label reference:</span>
          {packageInfo.LabelReference}
        </li>
        <li>
          <span className="details-list-spec">Distributor:</span>
          {packageInfo.Name}
        </li>
      </Card>
      <Card className="" style={styles.details}>
        <p>Details</p>
        <ul
          style={{ listStyleType: "none", padding: "8px 0" }}
          className="details-list"
        >
          <li>
            <span className="details-list-spec">Packaging location name:</span>
            {packageInfo.PackagingLocationName}
          </li>
          {packageInfo.PackagingLocation && (
            <li>
              <span className="details-list-spec">Packaging location:</span>
              {packageInfo.PackagingLocation.Latitude}
              {", "}
              {packageInfo.PackagingLocation.Longitude}
            </li>
          )}
          <li>
            <span className="details-list-spec">PO reference:</span>
            {packageInfo.POReference}
          </li>
          <li>
            <span className="details-list-spec">Distributor contact name:</span>
            {packageInfo.DistInfo ? packageInfo.DistInfo.Contact : ""}
          </li>
        </ul>
      </Card>
      <Card style={styles.KSI}>
        <p>Supply chain</p>
        <Timeline>
          {getSupplyChain()}
          {packageInfo.statusAll && packageInfo.statusAll.length < 2 && (
            <Timeline.Item dot={<Icon type="clock-circle-o" />} color="black">
              PENDING DISTRIBUTION
              <br />
            </Timeline.Item>
          )}
          {packageInfo.statusAll && packageInfo.statusAll.length < 3 && (
            <Timeline.Item dot={<Icon type="clock-circle-o" />} color="black">
              PENDING RECEIVED
              <br />
            </Timeline.Item>
          )}
        </Timeline>
        {packageInfo.statusAll && packageInfo.statusAll.length < 2 && (
          <Button
            type="primary"
            loading={iconLoading}
            onClick={handleDistribute}
            block
          >
            DISTRIBUTE
          </Button>
        )}
      </Card>

      <Card style={styles.KSI}>
        <div style={styles.LogoContainer}>
          <span>
            <Logo style={styles.Logo} />
          </span>
          Current KSI Block
        </div>
        <div style={styles.Verified}>
          <Icon type="check-circle" style={styles.VerifiIcon} /> Verified
        </div>
        <ul style={styles.ULHash} className="details-list ksi">
          <li style={styles.ListHash}>
            <span className="details-list-spec">KSI Transaction Hash: </span>
            <Tooltip title={copyText} onClick={copyHash}>
              <span style={styles.KSITHash}>
                <textarea
                  ref={textAreaRef}
                  style={styles.KSITextArea}
                  value={
                    packageInfo.status
                      ? packageInfo.status.KsiSig.KSITxStateHash
                      : ""
                  }
                />
                {getSubString(
                  packageInfo.status
                    ? packageInfo.status.KsiSig.KSITxStateHash
                    : ""
                )}
              </span>
            </Tooltip>
            <Popover
              trigger="click"
              content={
                packageInfo.status ? popContent(packageInfo.status.KsiSig) : {}
              }
              style={{ width: 100 }}
            >
              <a href="/#" style={styles.CurrHashLink}>
                more...
              </a>
            </Popover>
          </li>
          {packageInfo.status && (
            <li style={styles.ListHashTime}>
              <span className="details-list-spec">KSI Transaction Time: </span>
              {parsedTimeToLocal(packageInfo.status.KsiSig.KSITimeStamp)}
            </li>
          )}
        </ul>
      </Card>
      <Card style={styles.details}>
        <PackageDetailsTable bottles={packageInfo.Bottles} />
      </Card>
    </div>
  );
};

export default PackageDetails;
