import { REACT_APP_API_BASE_URL } from "../config";

export const getPackage = async id => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/package/${id}`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const getPackages = async body => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/package`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};


export const createNewPackage = async body => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  try {
    const res = await fetch(`${REACT_APP_API_BASE_URL}/package`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const getDistributorNameById = async distributorID => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/distributor/${distributorID}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const getPackageDetails = async packageID => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/package-sc-event/${packageID}`,
      options
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createPackageDistEvent = async body => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/package-sc-event/distribute`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getConsumerData = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/consumer-scan-event?scStatus=INCOMPLETE`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getConsumerDataWithParams = async body => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  const url = `consumer-scan-event?${body.supplyStatus ? 'scStatus=' + body.supplyStatus + '&': ''}
  ${body.authStatus ? 'authStatus=' + body.authStatus + '&': ''}
  ${body.start ? 'fromDate=' + body.start + '&': ''}
  ${body.end ? 'toDate=' + body.end + '&': ''}
  `

  try {
    const res = await fetch(
      `${REACT_APP_API_BASE_URL}/${url}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};