import moment from "moment";

export const getInventoryDefault = bottles => {
  let sevenDays = moment(new Date())
    .subtract(7, "day")
    .format("YYYY-MM-DD");

  let bottledSevenDaysAgo = bottles.filter(data => {
    return data.BottledDate >= sevenDays;
  });
  return bottledSevenDaysAgo;
};

export const filterInventory = (dropDown, bottleBatch) => {
  const {
    bottleStatus,
    grapeBatchID,
    endDate,
    startDate,
    wineName,
    wineYear
  } = dropDown;

  let params = {
    BottleStatus: bottleStatus,
    WineryGrapeBatchID: grapeBatchID,
    WineName: wineName,
    WineYear: wineYear
  };

  for (let prop in params) {
    if (params[prop] === null) {
      delete params[prop];
    }
  }

  let keyValue = Object.entries(params);

  const filterItems = filters => {
    return bottleBatch.filter(val => {
      let result = true;
      for (let i = 0; i < filters.length; i++) {
        if (filters[i][1] === "ALL") {
          continue;
        } else if (val[filters[i][0]] !== filters[i][1]) {
          result = false;
        }
      }
      return result;
    });
  };

  let filteredValues = filterItems(keyValue);

  if (startDate && !endDate) {
    filteredValues = filteredValues.filter(val => {
      return val.BottledDate >= startDate;
    });
  } else if (!startDate && endDate) {
    filteredValues = filteredValues.filter(val => {
      return val.BottledDate <= endDate;
    });
  } else if (startDate && endDate) {
    filteredValues = filteredValues.filter(val => {
      return endDate >= val.BottledDate && val.BottledDate >= startDate;
    });
  }

  return filteredValues;

  // item.WineName;
  // item.WineYear;
  // item.WineryName;
  // item.WineryGrapeBatchID;
  // item.BottledDate;

  // filteredBatch = bottleBatch.filter(item => {
  //   return (
  //     wineName &&
  //     item.WineName === wineName &&
  //     (grapeBatchID && item.WineryGrapeBatchID === grapeBatchID)
  //   );
  // });
  // return filteredBatch;

  // if (
  //   bottleStatus === "ALL" &&
  //   !grapeBatchID &&
  //   !endDate &&
  //   !startDate &&
  //   !wineName &&
  //   !wineYear
  // ) {
  //   return bottleBatch;
  // } else if (
  //   (bottleStatus === "NEW" || bottleStatus === "DSITRIBUTED") &&
  //   !grapeBatchID &&
  //   !endDate &&
  //   !startDate &&
  //   !wineName &&
  //   !wineYear
  // ) {
  //   filteredBatch = bottleBatch.filter(bottle => {
  //     return bottle.BottleStatus === bottleStatus;
  //   });
  //   return filteredBatch;
  // } else if (
  //   !bottleStatus &&
  //   grapeBatchID &&
  //   !endDate &&
  //   !startDate &&
  //   !wineName &&
  //   !wineYear
  // ) {
  //   filteredBatch = bottleBatch.filter(bottle => {
  //     return bottle.WineryGrapeBatchID === grapeBatchID;
  //   });
  //   return filteredBatch;
  // } else if (
  //   !bottleStatus &&
  //   !grapeBatchID &&
  //   endDate &&
  //   !startDate &&
  //   !wineName &&
  //   !wineYear
  // ) {
  //   filteredBatch = bottleBatch.filter(bottle => {
  //     return bottle.BottledDate <= moment(endDate).format("YYYY-MM-DD");
  //   });
  //   return filteredBatch;
  // } else if (
  //   !bottleStatus &&
  //   !grapeBatchID &&
  //   !endDate &&
  //   startDate &&
  //   !wineName &&
  //   !wineYear
  // ) {
  //   filteredBatch = bottleBatch.filter(bottle => {
  //     return bottle.BottledDate >= moment(startDate).format("YYYY-MM-DD");
  //   });
  //   return filteredBatch;
  // } else if (
  //   !bottleStatus &&
  //   !grapeBatchID &&
  //   !endDate &&
  //   !startDate &&
  //   wineName &&
  //   !wineYear
  // ) {
  //   filteredBatch = bottleBatch.filter(bottle => {
  //     return bottle.WineName === wineName;
  //   });
  //   return filteredBatch;
  // } else if (
  //   !bottleStatus &&
  //   !grapeBatchID &&
  //   !endDate &&
  //   !startDate &&
  //   !wineName &&
  //   wineYear
  // ) {
  //   filteredBatch = bottleBatch.filter(bottle => {
  //     return bottle.WineYear === wineYear;
  //   });
  //   return filteredBatch;
  // } else if (
  //   !bottleStatus &&
  //   !grapeBatchID &&
  //   !endDate &&
  //   !startDate &&
  //   !wineName &&
  //   !wineYear
  // ) {
  //   filteredBatch = bottleBatch.filter(bottle => {
  //     return bottle.WineYear === wineYear;
  //   });
  //   return filteredBatch;
  // }
};

export const getNewDate = (newBatch, key) => {
  newBatch.key = key;
  let recDate = newBatch.ReceivingDate;
  let dateArr = recDate.split("-");

  // < 2 dateArr length has been reformatted
  if (dateArr.length < 2) {
    return newBatch;
  }

  let oneDay = 24 * 60 * 60 * 1000;
  let reformatDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
  let today = new Date();
  let diff = Math.round(
    Math.abs((reformatDate.getTime() - today.getTime()) / oneDay)
  ).toString();
  newBatch.ReceivingDate =
    diff + (diff > 1 ? " days ago" : diff === 0 ? "today" : " day ago");

  return newBatch;
};

export const reformatBatchDate = (recBatch, key) => {
  let weight =
    recBatch.TotalWeight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    "kg";
  recBatch.TotalWeight = weight;
  recBatch.key = key;

  let recDate = recBatch.ReceivingDate;
  let harvestDate = recBatch.HarvestDate;

  // date must be in valid date format "YYYY-MM-DD" to be reformatted
  if (moment(recDate, "YYYY-MM-DD").isValid()) {
    let refRecDate = moment(recDate, "YYYY-MM-DD").format("Do MMM YYYY");
    recBatch.ReceivingDate = refRecDate;

    let refHarvDate = moment(harvestDate, "YYYY-MM-DD").format("Do MMM YYYY");
    recBatch.HarvestDate = refHarvDate;

    let ksigDateStamp = moment(
      recBatch.KsiSig.KSITimeStamp,
      "ddd MMM Do hh:mm:ss YYYY, h:mm:ss a "
    ).format("Do MMM YYYY - h:mm A");

    recBatch.KsiSig.KSITimeStamp = ksigDateStamp;

    return recBatch;
  }

  return recBatch;
};

export const reformatBottlesDate = (bottle, key) => {
  bottle.key = key;

  let bottleDate = bottle.BottledDate;

  // date must be in valid date format "YYYY-MM-DD" to be reformatted
  if (moment(bottleDate, "YYYY-MM-DD").isValid()) {
    let newBotDate = moment(bottleDate, "YYYY-MM-DD").format(
      "ddd, Do MMM YYYY"
    );
    bottle.BottledDate = newBotDate;

    return bottle;
  }

  return bottle;
};

export const reformatPackagesDate = (packages, key) => {
  packages.key = key;

  let packageDate = packages.PackagingDate;

  // date must be in valid date format "YYYY-MM-DD" to be reformatted
  if (moment(packageDate, "YYYY-MM-DD").isValid()) {
    let newPackDate = moment(packageDate, "YYYY-MM-DD").format(
      "ddd, Do MMM YYYY"
    );
    packages.PackagingDate = newPackDate;

    return packages;
  }

  return packages;
};

export const findBatch = (batchID, bottlesArray) => {
  for (var i = 0; i < bottlesArray.length; i++) {
    if (bottlesArray[i].GrapeBatchID === batchID) {
      return bottlesArray[i];
    }
  }
};
