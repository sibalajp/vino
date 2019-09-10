import { Icon, Timeline, Tooltip, Popover } from "antd";
import React, { useState, useRef } from "react";
import { styles } from "./packageDetailsStyles";
import { useTranslation } from "react-i18next";

const SupplyChainPackage = props => {
  const [copyText, updateCopyText] = useState("Click Hash To Copy!");
  const textAreaRef = useRef(null);

  const { packageInfo } = props;

  const { t } = useTranslation();

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
      return ksigsig.substring(0, 15);
    }
    return "";
  };
  let {
    KSITxStateHash,
    KSITimeStamp,
    KSIGatewayID,
    KSISignature,
    parsedKSITimeStamp
  } = packageInfo.KsiSig;

  let popContent = (
    <div>
      <div>
        <b>{t("KSI Gateway ID")}:</b> {KSIGatewayID}
      </div>
      <div>
        <b>{t("KSI Transaction Hash")}:</b> {KSITxStateHash}
      </div>
      <div>
        <b>{t("KSI Transaction Timestamp")}:</b> {parsedKSITimeStamp}
      </div>
      <div style={styles.BlockChain}>
        <b>{t("KSI Blockchain Signature")}:</b> {KSISignature}
      </div>
    </div>
  );

  return (
    <Timeline.Item dot={<Icon type={"check-circle"} />} color="green">
      {""}
      {packageInfo.EventType}
      <br />
      {packageInfo.KsiSig && (
        <span>
          <span style={styles.SupChainBatchHash}>
            <Tooltip placement="topLeft" title={copyText} onClick={copyHash}>
              {t("KSI Transaction Hash")}: {getSubString(KSITxStateHash)}
            </Tooltip>
            <Popover
              trigger="click"
              content={popContent}
              style={{ width: 100 }}
            >
              <a href="/#" style={{ color: "#333333", marginLeft: 10 }}>
                more...
              </a>
            </Popover>
          </span>
          <br />
          <span style={styles.SupChainBatchDate}>
            {t("KSI Transaction Time")}: {parsedKSITimeStamp}
          </span>
        </span>
      )}

      <textarea
        ref={textAreaRef}
        style={{
          position: "absolute",
          left: 1000,
          height: 0,
          width: 0
        }}
        value={KSITxStateHash}
      />
    </Timeline.Item>
  );
};

export default SupplyChainPackage;
