import React, { useState, useRef, useEffect } from "react";
import { Alert, Card, Icon, Timeline, Tooltip, Popover } from "antd";
import { ReactComponent as Logo } from "../../img/guardtime-logo.svg";
import { ReactComponent as GrapesIcon } from "../../img/grapes_1.svg";
import { ReactComponent as More } from "../../img/more.svg";
import HarvestModalForm from "../harvestModal/harvestModal-form";
import SupplyChain from "./supplyChain";
import moment from "moment";
import { findBatch } from "../../helper-functions";
import { styles } from "./batchDetailsStyles";
import "./batchDetails.css";

const { Meta } = Card;

const BatchDetails = props => {
  const [batchInfo, updateBatchInfo] = useState({
    KsiSig: {
      KSITxStateHash: 0,
      KSITimeStamp: 0,
      KSIGatewayID: 0,
      KSISignature: 0
    }
  });
  const [currentInfo, updateCurrentInfo] = useState({
    KsiSig: {
      KSITxStateHash: 0,
      KSITimeStamp: 0,
      KSIGatewayID: 0,
      KSISignature: 0
    }
  });
  const [bottleMatchInfo, updateBotMatch] = useState({
    KsiSig: {
      KSITxStateHash: 0,
      KSITimeStamp: 0,
      KSIGatewayID: 0,
      KSISignature: 0
    }
  });
  const [bottleInfo, updateBottle] = useState([]);
  const [copyText, updateCopyText] = useState("Click Hash To Copy");
  const textAreaRef = useRef(null);

  useEffect(() => {
    const getBatchInfo = () => {
      if (props.batchinfo.length > 0) {
        updateBatchInfo(props.batchinfo);
      }
      if (batchInfo.length === 2) {
        updateCurrentInfo(batchInfo[batchInfo.length - 2]);
      }
      if (batchInfo.length === 1) {
        updateCurrentInfo(batchInfo[0]);
      }
    };

    getBatchInfo();

    const getBottleBatch = () => {
      let bottleMatch = findBatch(currentInfo.BatchID, bottleInfo);
      if (bottleMatch) {
        console.log(bottleMatch)
        let refDate = moment(
          bottleMatch.BottledDate,
          "ddd, Do MMM YYYY"
        ).format("Do MMM YYYY");
        bottleMatch.BottledDate = refDate;
        updateBotMatch(bottleMatch);
      }
    };

    updateBottle(props.bottleinfo);
    getBottleBatch();
  }, [batchInfo, props.batchinfo, bottleInfo, props.bottleinfo, currentInfo]);

  const getSubString = ksigsig => {
    if (ksigsig) {
      return ksigsig.substring(0, 15);
    }
    return "";
  };

  const getSupplyChain = () => {
    if (batchInfo.length > 0) {
      return batchInfo
        .slice(0)
        .reverse()
        .map((data, i) => {
          data.KsiSig.parsedKSITimeStamp = parsedTimeToLocal(data.KsiSig.KSITimeStamp);
          return <SupplyChain key={i} batchInfo={data} />;
      });
    }
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

  let {
    KSITxStateHash,
    KSITimeStamp,
    KSIGatewayID,
    KSISignature,
    parsedKSITimeStamp
  } = currentInfo.KsiSig;

  let dateStamp = moment(
    KSITimeStamp,
    "ddd MMM Do hh:mm:ss YYYY, h:mm:ss a "
  ).utc().format("Do MMM YYYY - h:mm A");

  const parsedTimeToLocal = (time) => {
    const parsedTimestampString = moment.utc(time, "Do MMM YYYY - h:mm:ss A").format();
    const localParsedTimestamp = moment(parsedTimestampString).local().format("Do MMM YYYY - h:mm A");
    return localParsedTimestamp;
  }

  let popContent = (
    <div>
      <div>
        <b>KSI Gateway ID:</b> {KSIGatewayID}
      </div>
      <div>
        <b>KSI Transaction Hash:</b> {KSITxStateHash}
      </div>
      <div>
        <b>KSI Transaction Timestamp:</b> {parsedKSITimeStamp}
      </div>
      <div style={styles.BlockChain}>
        <b>KSI Blockchain Signature:</b> {KSISignature}
      </div>
    </div>
  );

  let bottlePopContent = (
    <div>
      <div>
        <b>KSI Gateway ID:</b> {bottleMatchInfo.KsiSig.KSIGatewayID}
      </div>
      <div>
        <b>KSI Transaction Hash:</b> {bottleMatchInfo.KsiSig.KSITxStateHash}
      </div>
      <div>
        <b>KSI Transaction Timestamp:</b>{bottleMatchInfo.KsiSig.parsedKSITimeStamp}
      </div>
      <div style={styles.BlockChain}>
        <b>KSI Blockchain Signature:</b> {bottleMatchInfo.KsiSig.KSISignature}
      </div>
    </div>
  );

  return (
    <div className="container">
      {currentInfo.Status === "RECEIVED" ? (
        ""
      ) : (
        <Card className="no-info-card" style={styles.NoInfo}>
          <Alert
            description="Information needed"
            type="warning"
            showIcon
            style={styles.Alert}
          />
          <Meta
            style={styles.Meta}
            description="This batch has no harvest information associated with it"
          />

          <HarvestModalForm
            data={currentInfo}
            updateBatch={props.updatebatch}
            href="#temp"
          />
        </Card>
      )}
      <Card
        style={
          batchInfo.Status !== "RECEIVED"
            ? styles.BatchDetails
            : styles.BatchHead
        }
      >
        <Meta
          style={styles.Meta}
          avatar={
            <Icon component={GrapesIcon} {...props} style={styles.Avatar} />
          }
          title="Batch Unassigned"
          description={currentInfo.Variety}
        />
        <Icon style={styles.More} component={More} />
      </Card>
      <Card className="" style={styles.Details}>
        <p>Details</p>
        <ul
          style={{ listStyleType: "none", padding: "8px 0" }}
          className="details-list"
        >
          <li>
            <span className="details-list-spec">Variety:</span>
            {currentInfo.Variety}
          </li>
          <li>
            <span className="details-list-spec">Operator:</span>
            {currentInfo.OperatorName ? currentInfo.OperatorName : "N/A"}
          </li>
          <li>
            <span className="details-list-spec">Vineyard:</span>
            <a href="#temp">{currentInfo.VineyardName}</a>
          </li>
          <li>
            <span className="details-list-spec">Year planted:</span>
            {currentInfo.YearPlanted}
          </li>
          <li>
            <span className="details-list-spec">Clone:</span>
            <span style={{ color: "#FEB47B" }}>{currentInfo.Clone}</span>
          </li>
          <li>
            <span className="details-list-spec">Location:</span>
            {currentInfo.ProductionLocation
              ? `${currentInfo.ProductionLocation.Latitude},  ${
                  currentInfo.ProductionLocation.Longitude
                }`
              : ""}
          </li>
        </ul>
      </Card>
      {currentInfo.Status === "RECEIVED" ? (
        <Card style={styles.HarvestInfo}>
          <p>Harvest Information</p>
          <ul
            style={{ listStyleType: "none", padding: "8px 0" }}
            className="details-list"
          >
            <li>
              <span className="details-list-spec">Weight:</span>
              {currentInfo.TotalWeight}
            </li>
            <li>
              <span className="details-list-spec">Harvest Date:</span>
              {currentInfo.HarvestDate}
            </li>
            <li>
              <span className="details-list-spec">MOG grade: </span>
              {currentInfo.LevelOfMog}
            </li>
          </ul>
        </Card>
      ) : (
        <Card style={styles.NoHarvest}>
          <p>Harvest Information</p>
          <p style={{ color: "#A6A6A6", marginTop: 20 }}>
            Information about this batch will become visible here once made
            available
          </p>
          <HarvestModalForm
            data={currentInfo}
            updateBatch={props.updateBatch}
            href="#temp"
          />
        </Card>
      )}

      <Card style={styles.SupplyChain}>
        <p>Supply chain</p>
        <Timeline>
          {getSupplyChain()}
          {batchInfo.length <= 1 && (
            <Timeline.Item
              dot={<Icon type="clock-circle-o" style={styles.TimelineItem} />}
              color="black"
            >
              Waiting for harvest information
              <br />
            </Timeline.Item>
          )}
          {/* {bottleMatchInfo.KsiSig.KSITxStateHash !== 0 && (
            <Timeline.Item
              dot={<Icon type="check-circle" style={styles.TimelineItem} />}
              color="green"
            >
              Bottles Created
              <br />
              {bottleMatchInfo.KsiSig && (
                <span>
                  <span style={styles.SupChainBatchHash}>
                    <Tooltip
                      placement="topLeft"
                      title={copyText}
                      onClick={copyHash}
                    >
                      KSI Transaction Hash:{" "}
                      {bottleMatchInfo.KsiSig ? getSubString(bottleMatchInfo.KsiSig.KSITxStateHash) : ""}
                    </Tooltip>
                    <Popover
                      trigger="click"
                      content={bottlePopContent}
                      style={{ width: 100 }}
                    >
                      <a href="/#" style={{ color: "#333333", marginLeft: 10 }}>
                        more...
                      </a>
                    </Popover>
                  </span>
                  <span style={styles.SupChainBatchDate}>
                    KSI Transaction Time:{" "}
                    {bottleMatchInfo.KsiSig
                      ? moment(
                          bottleMatchInfo.KsiSig.KSITimeStamp,
                          "ddd MMM Do hh:mm:ss YYYY, h:mm:ss a "
                        ).format("Do MMM YYYY - h:mm A")
                      : ""}
                  </span>
                </span>
              )}
            </Timeline.Item>
          )} */}
        </Timeline>
        {/* <a className="ksi-link link-color-size" href="#temp">
          Disable Notifications
        </a> */}
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
                    bottleMatchInfo.KsiSig.KSITxStateHash !== 0
                      ? bottleMatchInfo.KsiSig
                        ? bottleMatchInfo.KsiSig.KSITxStateHash
                        : ""
                      : currentInfo.KsiSig
                      ? currentInfo.KsiSig
                        ? currentInfo.KsiSig.KSITxStateHash
                        : ""
                      : ""
                  }
                />
                {bottleMatchInfo.KsiSig.KSITxStateHash !== 0
                  ? getSubString(
                      bottleMatchInfo.KsiSig
                        ? bottleMatchInfo.KsiSig.KSITxStateHash
                        : ""
                    )
                  : currentInfo.KsiSig
                  ? getSubString(
                      currentInfo.KsiSig
                        ? currentInfo.KsiSig.KSITxStateHash
                        : ""
                    )
                  : ""}
              </span>
            </Tooltip>
            <Popover
              trigger="click"
              content={
                bottleMatchInfo.KsiSig.KSITxStateHash !== 0
                  ? bottlePopContent
                  : popContent
              }
              style={{ width: 100 }}
            >
              <a href="/#" style={styles.CurrHashLink}>
                more...
              </a>
            </Popover>
          </li>
          <li style={styles.ListHashTime}>
            <span className="details-list-spec">KSI Transaction Time: </span>
            {currentInfo.KsiSig.parsedKSITimeStamp}
          </li>
        </ul>
        {/* <a className="ksi-link link-color-size" href="#temp">
          Download
        </a>
        <a className="ksi-link link-color-size" href="#temp">
          Inspect provenance
        </a> */}
      </Card>
    </div>
  );
};

export default BatchDetails;
