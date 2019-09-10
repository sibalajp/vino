import React, { useState, useEffect } from "react";
import {
  MainContainer,
  TableContainer,
  HeaderContainer,
  Head,
  styles
} from "./bottleBatchStyles";
import { Table, Icon, Popover } from "antd";
import { getBottleBatch } from "../../services/bottle.service";
import "./bottleBatch.css";
import { ReactComponent as Filter } from "../../img/filter.svg";
import { ReactComponent as More } from "../../img/more.svg";

const BottleBatch = props => {
  const [bottlesBatch, updateBottles] = useState([]);

  useEffect(() => {
    getTableData();
  }, []);

  const columns = [
    {
      title: "Wine Name",
      dataIndex: "WineName",
      key: "1",
      sorter: (a, b) => {
        if (a.WineryName.toLowerCase() < b.WineryName.toLowerCase()) {
          return -1;
        }
        if (a.WineryName.toLowerCase() > b.WineryName.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: "Wine Year",
      dataIndex: "WineYear",
      key: "2",
      sorter: (a, b) => {
        if (a.WineryName.toLowerCase() < b.WineryName.toLowerCase()) {
          return -1;
        }
        if (a.WineryName.toLowerCase() > b.WineryName.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },

    {
      title: "Bottling Date",
      dataIndex: "BottledDate",
      key: "3",
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.BottledDate.toLowerCase() < b.BottledDate.toLowerCase()) {
          return -1;
        }
        if (a.BottledDate.toLowerCase() > b.BottledDate.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: "Bottling Count",
      dataIndex: "BottleCount",
      key: "4",
      sorter: (a, b) => a.BottleCount - b.BottleCount
    },
    {
      title: "Grape Batch",
      dataIndex: "WineryGrapeBatchID",
      key: "5",
      sorter: (a, b) => {
        if (
          a.WineryGrapeBatchID.toLowerCase() <
          b.WineryGrapeBatchID.toLowerCase()
        ) {
          return -1;
        }
        if (
          a.WineryGrapeBatchID.toLowerCase() >
          b.WineryGrapeBatchID.toLowerCase()
        ) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: "Bottling location",
      dataIndex: "WineryName",
      key: "6",
      sorter: (a, b) => {
        if (a.WineryName.toLowerCase() < b.WineryName.toLowerCase()) {
          return -1;
        }
        if (a.WineryName.toLowerCase() > b.WineryName.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },

    {
      title: "",
      key: "7",
      render: e => (
        <div>
          <Popover
          content={(
            <a onClick={()=> nav(e)}>
                View Details
            </a>
          )}
          trigger="click"
          >
             <Icon
            
              className="bottle-more-icon"
              component={More}
              {...props}
            />
          </Popover>
         
        </div>
      )
    }
  ];

  const nav = e => {
    props.history.push({
      pathname: '/batch-details',
      state: { batchInfo: e }
    })
  }

  const newBottleNav = () => {
    props.history.push("/create-bottle");
  };
  let batchArr = [];

  bottlesBatch.forEach((item, i) => {
    batchArr.push(Object.assign({}, item));
  });

  const getTableData = async () => {
    const bottles = await getBottleBatch();
    return updateBottles(bottles);
  };

  return (
    <MainContainer>
      <TableContainer>
        <HeaderContainer>
          <Head>Available Inventory</Head>
          <Icon
            style={styles.plusStyle}
            className="bottle-plus-icon"
            type="plus"
            onClick={newBottleNav}
          />
          <Icon
            style={styles.filterStyle}
            className="bottle-filter-icon"
            component={Filter}
            {...props}
          />
        </HeaderContainer>
        <Table
          className="bottle-batch"
          columns={columns}
          dataSource={bottlesBatch}
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

export default BottleBatch;
