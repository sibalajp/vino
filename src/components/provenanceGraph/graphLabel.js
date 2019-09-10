import React from "react";
import { Link } from "./provenanceGraphStyles";
import PackageDetailsModal from "./packageDetailsModal";
import { useTranslation } from "react-i18next";

const GraphLabel = props => {
  const { nodeData, selectedGraph } = props;

  const { t } = useTranslation();

  return (
    <span>
      {nodeData.depth === 1 ? (
        <div>
          <Link>
            {t("Package Label")}:{" "}
            {nodeData.attributes ? nodeData.attributes.LabelReference : ""}
          </Link>
          <br />
          <Link>
            {t("PO")}:{" "}
            {nodeData.attributes ? nodeData.attributes.POReference : ""}
          </Link>
          <Link>
            <PackageDetailsModal packageSelected={nodeData} />
          </Link>
        </div>
      ) : nodeData.depth === 2 ? (
        <div>
          <span style={{ color: nodeData ? nodeData.color : "" }}>
            {t("Event Status")}: {nodeData ? nodeData.name : ""}
          </span>
          <br />
          <span>
            {t("Event Time")}:{" "}
            {nodeData.attributes ? nodeData.attributes.time : ""}
          </span>
          <br />
          <span>
            {t("Event Hash")}:{" "}
            {nodeData.attributes ? nodeData.attributes.hash : ""}
          </span>
          <br />
          <span>
            {t("Blockchain User")}:{" "}
            {nodeData.attributes ? nodeData.attributes.id : ""}
          </span>
          <br />
          <span>
            Event Location:{" "}
            {nodeData.attributes ? nodeData.attributes.scanLocation : ""}
          </span>
        </div>
      ) : (
        <Link>{nodeData ? nodeData.name : ""}</Link>
      )}
    </span>
  );
};

export default GraphLabel;
