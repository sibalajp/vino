import React, { useEffect, useState, useRef } from "react";
import { ReactComponent as Logo } from "../../img/guardtime-logo.svg";
import { ReactComponent as GrapesIcon } from "../../img/grapes_1.svg";
import PackageDetailsTable from "../packageDetails/packageDetailsTable";
import SupplyChain from "../packageDetails/supplyChain";
import { Card, Icon, Timeline, Popover, Tooltip, Modal } from "antd";
import { Link } from "./inventoryIntelligenceStyle";
import { useTranslation } from "react-i18next";

const InventoryGraphModal = props => {
  const [visible, updateVisibility] = useState(false);
  const [bottleInfo, updateBottleInfo] = useState([]);

  const { bottle } = props;

  const { t } = useTranslation();

  useEffect(() => {
    updateBottleInfo(bottle[0]);
  }, [bottle]);

  const handleOnClick = () => {
    updateVisibility(true);
  };

  const handleOkCancel = () => {
    updateVisibility(false);
  };

  const getContainer = () => {
    let doc = window.document;
    let docEl = doc.getElementById("invent-graph");
    return docEl;
  };

  return (
    <div>
      <Link type="primary" onClick={() => handleOnClick()}>
        {t("View Details")}
      </Link>

      <Modal
        title={`${t("Bottle Details")}`}
        getContainer={() => getContainer()}
        visible={visible}
        onOk={() => handleOkCancel()}
        onCancel={() => handleOkCancel()}
      >
        {bottleInfo && (
          <span>
            <h5 style={{ color: "#333333" }}>
              {t("Bottle ID")}: {bottleInfo.BottleID}
            </h5>
            <p>
              <b>{t("Alcohol Percentage")}:</b> {bottleInfo.AlcPercent}
            </p>
            <p>
              <b>{t("Bottling Date")}: </b>
              {bottleInfo.BottledDate}
            </p>
            <p>
              <b>{t("Bottling Location")} (lng/lat):</b>{" "}
              {bottleInfo.BottledLocation &&
                bottleInfo.BottledLocation.Longitude}
              ,
              {bottleInfo.BottledLocation &&
                bottleInfo.BottledLocation.Latitude}
            </p>
            <p>
              <b>{t("Baume Level")}:</b> {bottleInfo.BaumeLevel}
            </p>
            <p>
              <b>{t("Grape Year")}: </b>
              {bottleInfo.GrapeYear}
            </p>
            <p>
              <b>{t("Grape Batch ID")}:</b> {bottleInfo.GrapeBatchID}
            </p>
            <p>
              <b>{t("KSI Gateway ID")}:</b>{" "}
              {bottleInfo.KsiSig ? bottleInfo.KsiSig.KSIGatewayID : ""}
            </p>
            <p>
              <b>{t("KSI Signature")}:</b>{" "}
              {bottleInfo.KsiSig
                ? bottleInfo.KsiSig.KSISignature.substring(0, 21)
                : ""}
            </p>
            <p>
              <b>{t("KSI Timestamp")}:</b>{" "}
              {bottleInfo.KsiSig ? bottleInfo.KsiSig.KSITimeStamp : ""}
            </p>
            <p>
              <b>{t("KSI State Hash")}:</b>{" "}
              {bottleInfo.KsiSig
                ? bottleInfo.KsiSig.KSITxStateHash.substring(0, 21)
                : ""}
            </p>
            <p>
              <b>{t("PH level")}:</b> {bottleInfo.PhLevel}
            </p>
            <p>
              <b>{t("SO2")}:</b> {bottleInfo.SO2}
            </p>
            <p>
              <b>{t("SICPA ID")}:</b> {bottleInfo.SicpaID}
            </p>
            <p>
              <b>{t("TA")}:</b> {bottleInfo.TA}
            </p>
            <p>
              <b>{t("Turbidity")}:</b> {bottleInfo.Turbidity}
            </p>
            <p>
              <b>{t("VA")}:</b> {bottleInfo.VA}
            </p>
            <p>
              <b>{t("Vessel Type")}:</b> {bottleInfo.VesselType}
            </p>
            <p>
              <b>{t("Wine Name")}:</b> {bottleInfo.WineName}
            </p>
            <p>
              <b>{t("Wine Notes")}:</b> {bottleInfo.WineNotes}
            </p>
            <p>
              <b>{t("Wine Year")}:</b> {bottleInfo.WineYear}
            </p>
            <p>
              <b>{t("Winery Name")}:</b> {bottleInfo.WineryName}
            </p>
            <p>
              <b>{t("Winery BatchID")}:</b> {bottleInfo.WineryBatchID}
            </p>
          </span>
        )}
      </Modal>
    </div>
  );
};

export default InventoryGraphModal;
