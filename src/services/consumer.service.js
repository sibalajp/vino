import { REACT_APP_API_BASE_URL } from "../config";

export const getConsSCEventBotID = async bottleID => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/consumer-scan-event?pageIndex=0&pageSize=10&sicpaLabelID=${bottleID}`,
      options
    );
    const bottleHistory = await res.json();

    return bottleHistory;
  } catch (error) {
    console.error(error);
  }
};
