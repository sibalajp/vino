import React, { useEffect, useState, useRef } from "react";
import { ReactComponent as Logo } from "../../img/guardtime-logo.svg";
import { ReactComponent as GrapesIcon } from "../../img/grapes_1.svg";
import PackageDetailsTable from "../packageDetails/packageDetailsTable";
import SupplyChain from "../packageDetails/supplyChain";
import { Card, Icon, Timeline, Popover, Tooltip, Modal } from "antd";
import { Link } from "./provenanceGraphStyles";
import { styles } from "./packageDetailsModalStyle";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { Meta } = Card;

const PackageDetailsModal = props => {
  const [visible, updateVisibility] = useState(false);
  const [packageInfo, updatePackge] = useState([]);
  const [copyText, updateCopyText] = useState("Click Hash To Copy");
  const textAreaRef = useRef(null);

  const { packageSelected } = props;

  const { t } = useTranslation();

  useEffect(() => {
    updatePackge(packageSelected.attributes);
  }, [packageSelected.attributes]);

  const handleOnClick = () => {
    updateVisibility(true);
  };

  const handleOkCancel = () => {
    updateVisibility(false);
  };

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
  const getSubString = ksigsig => {
    if (ksigsig) {
      return ksigsig.substring(0, 21);
    }
    return "";
  };

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

  const copyHash = e => {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    updateCopyText("Copied!");
    setTimeout(() => {
      updateCopyText("Click Hash To Copy!");
    }, 1000);
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

  const getContainer = () => {
    let doc = window.document;
    let docEl = doc.getElementById("graph");
    return docEl;
  };

  return (
    <div>
      <Link type="primary" onClick={() => handleOnClick()}>
        {t("View Details")}
      </Link>
      <Modal
        title={`${t("Package Details")}`}
        visible={visible}
        onOk={() => handleOkCancel()}
        onCancel={() => handleOkCancel()}
        getContainer={() => getContainer()}
      >
        {packageInfo && (
          <div style={{ paddingBottom: "2rem" }}>
            <Card style={styles.BatchHead}>
              <Meta
                style={styles.Meta}
                avatar={
                  <Icon
                    component={GrapesIcon}
                    {...props}
                    style={styles.Avatar}
                  />
                }
                title={`${t("Summary")}`}
                description={""}
              />
              <li>
                <span className="details-list-spec">
                  {t("Packaging date")} :
                </span>
                {packageInfo.PackagingDate}
              </li>
              {packageInfo.Bottles && (
                <li>
                  <span className="details-list-spec">
                    {t("Number of bottles")}:
                  </span>
                  {packageInfo.Bottles.length}
                </li>
              )}
              <li>
                <span className="details-list-spec">
                  {t("Package label reference")}:
                </span>
                {packageInfo.LabelReference}
              </li>
              <li>
                <span className="details-list-spec">{t("Distributor")}:</span>
                {packageInfo.Name}
              </li>
            </Card>
            <Card className="" style={styles.details}>
              <p>{t("Details")}</p>
              <ul
                style={{ listStyleType: "none", padding: "8px 0" }}
                className="details-list"
              >
                <li>
                  <span className="details-list-spec">
                    {t("Packaging location name")}:
                  </span>
                  {packageInfo.PackagingLocationName}
                </li>
                {packageInfo.PackagingLocation && (
                  <li>
                    <span className="details-list-spec">
                      {t("Packaging location")}:
                    </span>
                    {packageInfo.packLocation}
                    {/* {", "}
                    {packageInfo.PackagingLocation.Longitude} */}
                  </li>
                )}
                <li>
                  <span className="details-list-spec">
                    {t("PO Reference")}:
                  </span>
                  {packageInfo.POReference}
                </li>
                <li>
                  <span className="details-list-spec">
                    {t("Distributor contact name")}:
                  </span>
                  {packageInfo.DistInfo ? packageInfo.DistInfo.Contact : ""}
                </li>
              </ul>
            </Card>
            <Card style={styles.KSI}>
              <p>{t("Supply chain")}</p>
              <Timeline>
                {getSupplyChain()}
                {packageInfo.statusAll && packageInfo.statusAll.length < 2 && (
                  <Timeline.Item
                    dot={<Icon type="clock-circle-o" />}
                    color="black"
                  >
                    {t("PENDING DISTRIBUTION")}
                    <br />
                  </Timeline.Item>
                )}
                {packageInfo.statusAll && packageInfo.statusAll.length < 3 && (
                  <Timeline.Item
                    dot={<Icon type="clock-circle-o" />}
                    color="black"
                  >
                    {t("PENDING RECEIVED")}
                    <br />
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
            <Card style={styles.KSI}>
              <div style={styles.LogoContainer}>
                <span>
                  <Logo style={styles.Logo} />
                </span>
                {t("Current KSI Block")}
              </div>
              <div style={styles.Verified}>
                <Icon type="check-circle" style={styles.VerifiIcon} />{" "}
                {t("Verified")}
              </div>
              <ul style={styles.ULHash} className="details-list ksi">
                <li style={styles.ListHash}>
                  <span className="details-list-spec">
                    {t("KSI Transaction Hash")}:{" "}
                  </span>
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
                      packageInfo.status
                        ? popContent(packageInfo.status.KsiSig)
                        : {}
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
                    <span className="details-list-spec">
                      {t("KSI Transaction Time")}:{" "}
                    </span>
                    {parsedTimeToLocal(packageInfo.status.KsiSig.KSITimeStamp)}
                  </li>
                )}
              </ul>
            </Card>
            <Card style={styles.details}>
              <PackageDetailsTable bottles={packageInfo.Bottles} />
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PackageDetailsModal;
