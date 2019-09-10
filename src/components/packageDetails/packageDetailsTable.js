import React, { useState, useEffect } from "react";
import { Table, Modal } from "antd";
import { getBottle } from "../../services/bottle.service";
import "./packageDetails.css";
import { useTranslation } from "react-i18next";

const PackageDetailsTable = props => {
  const [bottles, updateBottles] = useState([]);
  const [visible, updateVisibility] = useState(false);
  const [bottle, updateBottle] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    updateBottles(props.bottles);
  }, [bottles, bottle]);

  const fetchBottleData = async (bool, BottleID) => {
    updateVisibility(bool);
    let bottle = await getBottle(BottleID);
    console.log("bottle", bottle);
    updateBottle(bottle[0]);
  };

  const handleModal = bool => {
    updateVisibility(bool);
  };

  const columns = [
    {
      title: `${t("Bottle ID")}`,
      dataIndex: "BottleID",
      key: "1",
      render: BottleID => (
        <a onClick={() => fetchBottleData(true, BottleID)}>{BottleID}</a>
      )
    }
  ];

  return (
    <div className="package-details-table" style={{ width: "100%" }}>
      <Table
        className="data-table"
        dataSource={bottles}
        columns={columns}
        size="small"
        pagination={{
          showSizeChanger: true,
          pageSize: 5,
          pageSizeOptions: ["5", "10", "20"]
        }}
      />
      <Modal
        visible={visible}
        onOk={() => handleModal(false)}
        onCancel={() => handleModal(false)}
      >
        <h4 style={{ color: "#333333" }}>Bottle ID: {bottle.BottleID}</h4>
        <p>
          <b>Alcohol Percentage:</b> {bottle.AlcPercent}
        </p>
        <p>
          <b>Bottling Date: </b>
          {bottle.BottledDate}
        </p>
        <p>
          <b>Bottling Location (lng/lat):</b>{" "}
          {bottle.BottledLocation && bottle.BottledLocation.Longitude},
          {bottle.BottledLocation && bottle.BottledLocation.Latitude}
        </p>
        <p>
          <b>Baume Level:</b> {bottle.BaumeLevel}
        </p>
        <p>
          <b>Grape Year: </b>
          {bottle.GrapeYear}
        </p>
        <p>
          <b>Grape Batch ID:</b> {bottle.GrapeBatchID}
        </p>
        <p>
          <b>PH level:</b> {bottle.PhLevel}
        </p>
        <p>
          <b>SO2:</b> {bottle.SO2}
        </p>
        <p>
          <b>SICPA ID:</b> {bottle.SicpaID}
        </p>
        <p>
          <b>TA:</b> {bottle.TA}
        </p>
        <p>
          <b>Turbidity:</b> {bottle.Turbidity}
        </p>
        <p>
          <b>VA:</b> {bottle.VA}
        </p>
        <p>
          <b>Vessel Type:</b> {bottle.VesselType}
        </p>
        <p>
          <b>Wine Name:</b> {bottle.WineName}
        </p>
        <p>
          <b>Wine Notes:</b> {bottle.WineNotes}
        </p>
        <p>
          <b>Wine Year:</b> {bottle.WineYear}
        </p>
        <p>
          <b>Winery Name:</b> {bottle.WineryName}
        </p>
        <p>
          <b>Winery BatchID:</b> {bottle.WineryBatchID}
        </p>
      </Modal>
    </div>
  );
};

export default PackageDetailsTable;
