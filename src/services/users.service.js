import { REACT_APP_DATA_CONFIG_URL } from "../config";

export const loadUsers = async () => {
  try {
    const res = await fetch(REACT_APP_DATA_CONFIG_URL);
    const users = await res.json();
    return users.users;
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async callback => {
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('token')}`
  //   }
  // };

  try {
    // const res = await fetch('/api/site/group?type=dashboard',options);
    // const data = await res.json();

    const nameArr = localStorage.getItem("user").split(" ");

    const user = {
      firstName: nameArr[0],
      lastName: nameArr[nameArr.length - 1]
    };

    if (callback) callback(user);
  } catch (error) {
    console.error(error);

    if (callback) callback({ message: "Server Error" });
  }
};

