import { REACT_APP_API_BASE_URL } from "../config";
import {
  getNewDate,
  reformatBatchDate,
  reformatBottlesDate,
  reformatPackagesDate
} from "../helper-functions";

export const loadNewBatch = async () => {
  const options = {
    method: "GET"
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/grape-batch?state=NEW`, options);
    const data = await res.json();

    const batch = data.map(getNewDate);

    return batch;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const loadAllBatches = async () => {
  const options = {
    method: "GET"
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/grape-batch`, options);
    const data = await res.json();

    const batch = data.map(getNewDate);

    return batch;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const loadReceivedBatch = async () => {
  const options = {
    method: "GET"
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/grape-batch?state=RECEIVED`,
      options
    );
    const data = await res.json();
    const batch = data.map(reformatBatchDate);

    return batch;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const loadBatchInfo = async (id, callback) => {
  const options = {
    method: "GET"
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/grape-batch/${id}`, options);
    const data = await res.json();
    const batch = data.map(reformatBatchDate);

    return batch;
  } catch (error) {
    console.error(error);
    return [];
  }
};


export const loadPackages = async () => {
  const options = {
    method: "GET"
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/package`, options);
    const data = await res.json();
    const packages = data.map(reformatPackagesDate);
    return packages;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateReceivedBatch = async body => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/grape-batch`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const loadBottles = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/bottle`, options);
    const bottlesJSON = await res.json();
    const bottles = bottlesJSON.map(reformatBottlesDate);

    return bottles;
  } catch (error) {
    console.error(error);
    return [];
  }
};
