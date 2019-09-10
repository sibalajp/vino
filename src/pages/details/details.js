import React, { useState, useEffect } from "react";
import BatchDetails from "../../components/batchDetails/batchDetails";
import {
  loadBatchInfo,
  updateReceivedBatch,
  loadBottles
} from "../../services/batch.services";

const Details = props => {
  const [batchInfo, updateBatchInfo] = useState({});
  const [bottleInfo, updateBottles] = useState({});

  const params = props.match.params;

  useEffect(() => {
    document.title = `Details`;

    const getBatchInfo = async () => {
      let batchDetails = await loadBatchInfo(params.id);
      updateBatchInfo(batchDetails);
    };

    const getBottles = async () => {
      let bottles = await loadBottles();

      updateBottles(bottles);
    };

    getBatchInfo();
    getBottles();
  }, [batchInfo.batchID, params.id, bottleInfo.BottleID]);

  const updateBatch = async data => {
    let newBatch = await updateReceivedBatch(data);
    updateBatchInfo(newBatch);
    return newBatch;
  };

  return (
    <div className="container">
      <div
        style={{
          paddingTop: "11.5rem",
          minHeight: "33rem",
          paddingBottom: "3rem"
        }}
      >
        <BatchDetails
          batchinfo={batchInfo}
          bottleinfo={bottleInfo}
          updatebatch={updateBatch}
        />
      </div>
    </div>
  );
};

export default Details;
