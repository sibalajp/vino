import React from "react";
import { Table, Icon, Button } from "antd";
import {
  MainContainer,
  TableContainer,
  TableTitle,
  TableChevron,
  styles
} from "./dataTableStyles";
import "antd/dist/antd.css";
import "./dataTable.css";
import moment from "moment";
import { useTranslation } from "react-i18next";

const DataTable = props => {
  const newBatchData = props.newBatch;

  const { t } = useTranslation();

  const receivedBatchData = props.receivedBatch;

  const nav = navToDetails => {
    const url = "details/" + navToDetails.BatchID;
    if (navToDetails && props.parent) {
      props.parent.history.push(url);
    }
  };

  const newBatchcolumns = [
    {
      title: `${t("Variety")}`,
      dataIndex: "Variety",
      key: "0",
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.Variety.toLowerCase() < b.Variety.toLowerCase()) {
          return -1;
        }
        if (a.Variety.toLowerCase() > b.Variety.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: `${t("Vineyard")}`,
      dataIndex: "VineyardName",
      key: "1",
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.VineyardName.toLowerCase() < b.VineyardName.toLowerCase()) {
          return -1;
        }
        if (a.VineyardName.toLowerCase() > b.VineyardName.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: `${t("Location")}`,
      dataIndex: "LocationName",
      key: "2",
      sorter: (a, b) =>
        a.LocationName.toLowerCase() - b.LocationName.toLowerCase()
    },
    {
      title: `${t("Year planted")}`,
      dataIndex: "YearPlanted",
      key: "3",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.YearPlanted - b.YearPlanted
    },
    {
      title: `${t("Received")}`,
      dataIndex: "ReceivingDate",
      key: "4",
      defaultSortOrder: "ascend",
      sorter: (a, b) =>
        Number(a.ReceivingDate.charAt(0)) - Number(b.ReceivingDate.charAt(0))
    },
    {
      title: "",
      key: "action",
      render: item => (
        <TableChevron onClick={() => nav(item)}>
          <Icon type="right" />
        </TableChevron>
      )
    }
  ];

  const receivedBatchcolumns = [
    {
      title: "Variety",
      dataIndex: "Variety",
      key: "0",
      sorter: (a, b) => {
        if (a.Variety.toLowerCase() < b.Variety.toLowerCase()) {
          return -1;
        }
        if (a.Variety.toLowerCase() > b.Variety.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: "Vineyard",
      dataIndex: "VineyardName",
      key: "1",
      sorter: (a, b) => {
        if (a.VineyardName.toLowerCase() < b.VineyardName.toLowerCase()) {
          return -1;
        }
        if (a.VineyardName.toLowerCase() > b.VineyardName.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: "Weight",
      dataIndex: "TotalWeight",
      key: "2",
      sorter: (a, b) =>
        parseFloat(a.TotalWeight.replace(/[^0-9]+/g, "")) -
        parseFloat(b.TotalWeight.replace(/[^0-9]+/g, ""))
    },
    {
      title: "Year planted",
      dataIndex: "YearPlanted",
      key: "3",
      sorter: (a, b) => a.YearPlanted - b.YearPlanted,
      width: 150
    },
    {
      title: "Harvested",
      dataIndex: "HarvestDate",
      key: "4",
      sorter: (a, b) => {
        a = moment(a.HarvestDate);
        b = moment(b.HarvestDate);
        return a - b;
      },
      width: 150
    },
    {
      title: "Received",
      dataIndex: "ReceivingDate",
      key: "5",
      sorter: (a, b) => {
        a = moment(a.HarvestDate);
        b = moment(b.HarvestDate);
        return a - b;
      },
      width: 150
    },
    {
      title: "",
      key: "action",
      render: item => (
        <TableChevron onClick={() => nav(item)}>
          <Icon type="right" />
        </TableChevron>
      )
    }
  ];

  return (
    <div className="container">
      <MainContainer>
        <TableContainer>
          <TableTitle>New batches</TableTitle>
          <Table
            dataSource={newBatchData}
            columns={newBatchcolumns}
            pagination={false}
          />
          <br />
          <br />
          <TableTitle>Received batches</TableTitle>
          <Table
            className="data-table"
            dataSource={receivedBatchData}
            columns={receivedBatchcolumns}
            pagination={{
              showSizeChanger: true,
              pageSize: 5,
              pageSizeOptions: ["5", "10", "20"],
              locale: { items_per_page: "" },
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
            }}
          />
          <div style={{ height: "40px", margin: "25px 0px 0px 0px" }}>
            <Button style={styles.Button} type="primary">
              See all batches
            </Button>
          </div>
        </TableContainer>
      </MainContainer>
    </div>
  );
};

export default DataTable;
