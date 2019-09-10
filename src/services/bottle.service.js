import { REACT_APP_API_BASE_URL, REACT_APP_DATA_CONFIG_URL } from "../config";
import { async } from "q";

export const addBottleBatchData = async body => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  console.log(body);

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/bottle-batch`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const getBottles = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/bottle`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getBottle = async id => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/bottle?bottleID=${id}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getBottleByLabelRef = async labelreference => {
  const newLabel = labelreference.replace("|", "%7C");
  console.log(newLabel);
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/bottle?pageIndex=0&pageSize=10&sicpaLabelID=${newLabel}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getBottleWithParams = async params => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/bottle?wineName=${params.name}&wineYear=${params.year}&wineryGrapeBatchID=${params.id}&bottleDate=${params.date}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getBottleBatchWithParams = async params => {
  const {
    wineYear,
    wineName,
    startDate,
    grapeBatchID,
    endDate,
    bottleStatus
  } = params;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  let queryString = "";
  if (wineYear && wineYear !== "ALL") queryString += `&wineYear=${wineYear}`;
  if (wineName && wineName !== "ALL") queryString += `&wineName=${wineName}`;
  if (startDate) queryString += `&fromDate=${startDate}`;
  if (endDate) queryString += `&toDate=${endDate}`;
  if (bottleStatus) queryString += `&bottleStatus=${bottleStatus}`;
  if (grapeBatchID && grapeBatchID !== "ALL")
    queryString += `&wineryGrapeBatchID=${grapeBatchID}`;

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/bottle-batch?pageIndex=0&pageSize=10${queryString}`,
      options
    );
    const data = await res.json();
    data.map((data, i) => (data.key = i));

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const getBottleBatch = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/bottle-batch`, options);
    const data = await res.json();
    data.map((data, i) => (data.key = i));
    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const getSipcaLabel = async number => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/sicpa-label?pageIndex=0&pageSize=${number}&status=UNACTIVATED`,
      options
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const bottleProducedCount = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/bottle-produced/count`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getAvailableBottles = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/distributor`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getBottlesProd = async body => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/bottle-produced/ids?${body}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const loadWineNames = async () => {
  try {
    const res = await fetch(REACT_APP_DATA_CONFIG_URL);
    const wineNames = await res.json();
    return wineNames.wineName;
  } catch (error) {
    console.error(error);
  }
};

export const getBottleHistory = async SicpaID => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/bottle-sc-event/history?bottleID=${SicpaID}`,
      options
    );
    const bottleHistory = await res.json();

    return bottleHistory;
  } catch (error) {
    console.error(error);
  }
};
