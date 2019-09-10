import React, { useState, useEffect } from "react";
import {
  MainContainer,
  TableContainer,
  HeaderContainer,
  Head,
  SubHead
} from "./newPackageStyles";
import { getBottleBatch } from "../../services/bottle.service";
import { Table, Icon } from "antd";

const NewPackage = props => {
  const [packages, updatePackages] = useState([]);

  useEffect(() => {
    getProduced();
  }, []);

  const getProduced = async () => {
    const countProduced = await getBottleBatch();
    // temp key assignment - good to delete once second part is established
    countProduced.map((data, i) => (data.key = i));

    // bottle.service API call
    // const bottleCount = await getAvailableBottles(countProduced);
    // console.log(bottleCount)
    updatePackages(countProduced);
  };

  const addPackage = (wineName, wineYear, wineryName, bottleCount) => {
    let packageID = Math.floor(Math.random() * 10000000000);
    let selPackage = {
      packageID: packageID,
      wineName: wineName,
      wineYear: wineYear,
      wineryName: wineryName,
      bottleCount: bottleCount
    };

    props.history.push({
      pathname: "/create-package",
      state: { selPackage: selPackage }
    });
  };

  const packageColumns = [
    {
      title: "Wine Name",
      dataIndex: "WineName",
      width: 150,
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.WineName.toLowerCase() < b.WineName.toLowerCase()) {
          return -1;
        }
        if (a.WineName.toLowerCase() > b.WineName.toLowerCase()) {
          return 1;
        }
        return 0;
      },
      key: "1"
    },
    {
      title: "Wine Year",
      dataIndex: "WineYear",
      width: 150,
      key: "2",
      sorter: (a, b) => a.WineYear - b.WineYear
    },
    {
      title: "Winery",
      width: 150,
      dataIndex: "WineryName",
      sorter: (a, b) => {
        if (a.WineryName.toLowerCase() < b.WineryName.toLowerCase()) {
          return -1;
        }
        if (a.WineryName.toLowerCase() > b.WineryName.toLowerCase()) {
          return 1;
        }
        return 0;
      },
      key: "3"
    },
    {
      title: "# Available Bottles",
      width: 200,
      dataIndex: "BottleCount",
      sorter: (a, b) => a.BottleCount - b.BottleCount,
      key: "4"
    },
    {
      title: "Bottle Date",
      width: 150,
      dataIndex: "BottledDate",
      sorter: (a, b) => a.BottledDate - b.BottledDate,
      key: "5"
    },
    {
      title: "",
      key: "6",
      width: 150,
      render: (text, row) => (
        <Icon
          className="bottle-more-icon"
          onClick={() =>
            addPackage(
              row.WineName,
              row.WineYear,
              row.WineryName,
              row.BottleCount
            )
          }
          type="plus"
        />
      )
    }
  ];

  return (
    <MainContainer>
      <TableContainer>
        <HeaderContainer>
          <Head>New Package</Head>
          <SubHead>Please select the wine for this package</SubHead>
        </HeaderContainer>
        <Table
          className="bottle-batch"
          columns={packageColumns}
          dataSource={packages}
          pagination={{
            showSizeChanger: true,
            pageSize: 5,
            pageSizeOptions: ["5", "10", "20"],
            locale: { items_per_page: "" },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
          }}
        />
      </TableContainer>
    </MainContainer>
  );
};

export default NewPackage;
