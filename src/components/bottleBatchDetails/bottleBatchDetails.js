import React, { useState, useEffect } from "react";
import { Card, Icon, Table, Popover } from "antd";
import { getBottleWithParams } from "../../services/bottle.service";
import { styles } from "./bottleBatchDetailsStyles";
import "./bottleBatchDetails";
import { ReactComponent as GrapesIcon } from "../../img/grapes_1.svg";
const { Meta } = Card;

const BottleBatchDetails = props => {
  const [wineBatchKsigs, updateWineBatchKsigs] = useState([]);
  const [bottleInfo, updateBottle] = useState({});

  const { batchInfo } = props.location.state;

  useEffect(() => {
    const bottleFetch = async () => {
      const params = {
        name: batchInfo.WineName,
        year: batchInfo.WineYear,
        id: batchInfo.WineryGrapeBatchID,
        date: batchInfo.BottledDate
      };

      const bottles = await getBottleWithParams(params);

      let ksigArr = [];
      bottles.forEach(bottle => {
        bottle.KsiSig.SicpaID = bottle.SicpaID;
        ksigArr.push(bottle.KsiSig);
      });

      updateBottle(bottles[0]);
      updateWineBatchKsigs(ksigArr);
    };

    bottleFetch();
  }, [batchInfo]);

  const receivedBatchcolumns = [
    {
      title: "Blockchain Status",
      key: "action",
      align: "center",
      render: () => <Icon type="check-circle" style={styles.VerifiIcon} />
    },
    {
      title: "Label of Reference",
      dataIndex: "SicpaID",
      key: "1",
      render: e => getDetails(e)
    }
  ];

  const getDetails = e => {
    const info = wineBatchKsigs.find(ksig => {
      return ksig.SicpaID === e;
    });

    return (
      <Popover
        trigger="click"
        content={
          <div style={{ width: 500 }}>
            <div>
              <b>KSI Gateway ID:</b> {info.KSIGatewayID}
            </div>
            <div>
              <b>KSI Transaction Hash:</b> {info.KSITxStateHash}
            </div>
            <div>
              <b>KSI Transaction Timestamp:</b> {info.parsedKSITimeStamp}
            </div>
            <div style={styles.BlockChain}>
              <b>KSI Blockchain Signature:</b> {info.KSISignature}
            </div>
          </div>
        }
      >
        <span>{e}</span>
        <a href="/#" style={styles.CurrHashLink}>
          more...
        </a>
      </Popover>
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
          title={bottleInfo.WineName}
          description={""}
        />
        <li>
          <span className="details-list-spec">Grape Batch ID :</span>
          {batchInfo.WineryGrapeBatchID}
        </li>
        <li>
          <span className="details-list-spec">Wine Year:</span>
          {bottleInfo.WineYear}
        </li>
        <li>
          <span className="details-list-spec">Bottle Count:</span>
          {batchInfo.BottleCount}
        </li>
      </Card>

      <Card className="" style={styles.details}>
        <p>Details</p>
        <ul
          style={{ listStyleType: "none", padding: "8px 0" }}
          className="details-list"
        >
          <li>
            <span className="details-list-spec">Grape Batch ID :</span>
            {batchInfo.WineryGrapeBatchID}
          </li>
          <li>
            <span className="details-list-spec">Bottle Count:</span>
            {batchInfo.BottleCount}
          </li>
          <li>
            <span className="details-list-spec">SO2:</span>
            {bottleInfo.SO2}
          </li>
          <li>
            <span className="details-list-spec">TA:</span>
            {bottleInfo.TA}
          </li>
          <li>
            <span className="details-list-spec">VA:</span>
            {bottleInfo.VA}
          </li>
          <li>
            <span className="details-list-spec">Alcohol Percentage:</span>
            {bottleInfo.AlcPercent}
          </li>
          <li>
            <span className="details-list-spec">Baume Level:</span>
            {bottleInfo.BaumeLevel}
          </li>
          <li>
            <span className="details-list-spec">Grape Year:</span>
            {bottleInfo.GrapeYear}
          </li>
          <li>
            <span className="details-list-spec">pH Level:</span>
            {bottleInfo.PhLevel}
          </li>
          <li>
            <span className="details-list-spec">Turbidity:</span>
            {bottleInfo.Turbidity}
          </li>
          <li>
            <span className="details-list-spec">Vessel Type:</span>
            {bottleInfo.VesselType}
          </li>
          <li>
            <span className="details-list-spec">Wine Notes:</span>
            {bottleInfo.WineNotes}
          </li>
          <li>
            <span className="details-list-spec">Winery Name:</span>
            {bottleInfo.WineryName}
          </li>
          <li>
            <span className="details-list-spec">Bottled Date:</span>
            {bottleInfo.BottledDate}
          </li>
        </ul>
      </Card>
      <Card style={styles.KSI}>
        Bottle Blockchain Data
        <Table
          className="data-table"
          dataSource={wineBatchKsigs}
          columns={receivedBatchcolumns}
          pagination={{
            showSizeChanger: true,
            pageSize: 5,
            pageSizeOptions: ["5", "10", "20"],
            locale: { items_per_page: "" },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
          }}
        />
      </Card>
    </div>
  );
};

export default BottleBatchDetails;
