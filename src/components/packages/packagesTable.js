import React, { useState, useEffect } from "react";
import {
  MainContainer,
  TableContainer,
  HeaderContainer,
  Head,
  Link,
  styles
} from "./packagesTableStyles";
import { Table, Icon, Popover } from "antd";
import { ReactComponent as Filter } from "../../img/filter.svg";
import { ReactComponent as More } from "../../img/more.svg";
import moment from "moment";
import {
  getPackages,
  getDistributorNameById,
  getPackageDetails,
  createPackageDistEvent
} from "../../services/package.service";
import ModalPackagesTable from "./modalPackagesTable";

const PackagesTable = props => {
  const [packages, updatePackages] = useState([]);
  const [selected, updateSelected] = useState("");

  useEffect(() => {
    const getTableData = async () => {
      const packagesRes = await getPackages();

      // const length = packagesRes.length - 1;
      const packagePromises = packagesRes.map((pack, i) => {
        return new Promise(async (resolve, reject) => {
          pack.DistInfo = await getDistributorNameById(pack.DistributorID);
          pack.Name = pack.DistInfo.Name;
          const status = await getPackageDetails(pack.PackageID);

          if (status.length) {
            pack.status = status[0];
            pack.statusAll = status;
          }
          pack.key = i + 10;
          resolve();
        });
      });
      await Promise.all(packagePromises);
      return updatePackages(packagesRes);
    };

    getTableData();
  }, [packages.length, selected]);

  const createPackageNav = () => {
    props.history.push("/new-package");
  };
  let packs = packages.map(data => {
    return data;
  });

  const columns = [
    {
      title: "Package ID",
      dataIndex: "LabelReference",
      key: "0",
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        if (a.PackageID.toLowerCase() < b.PackageID.toLowerCase()) {
          return -1;
        }
        if (a.PackageID.toLowerCase() > b.PackageID.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: "Distributor",
      dataIndex: "Name",
      key: "1",
      sorter: (a, b) => {
        if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
          return -1;
        }
        if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: "PO Reference",
      dataIndex: "POReference",
      key: "2",
      sorter: (a, b) => {
        if (a.POReference.toLowerCase() < b.POReference.toLowerCase()) {
          return -1;
        }
        if (a.POReference.toLowerCase() > b.POReference.toLowerCase()) {
          return 1;
        }
        return 0;
      },
      render: text => <a href="/#">{text}</a>
    },
    {
      title: "Package Status",
      dataIndex: "status.EventType",
      key: "3",
      sorter: (a, b) => {
        if (
          a.status.EventType.toLowerCase() < b.status.EventType.toLowerCase()
        ) {
          return -1;
        }
        if (
          a.status.EventType.toLowerCase() > b.status.EventType.toLowerCase()
        ) {
          return 1;
        }
        return 0;
      },
      render: text => <a href="/#">{text}</a>
    },
    {
      title: "Number of Bottles",
      dataIndex: "Bottles.length",
      key: "4",
      sorter: (a, b) => a.Bottles.length - b.Bottles.length
    },
    {
      title: "Packaging Date",
      dataIndex: "PackagingDate",
      sorter: (a, b) => {
        a = moment(a.PackagingDate);
        b = moment(b.PackagingDate);
        return a - b;
      },
      key: "5"
    },

    {
      title: "",
      key: "6",
      render: e => (
        <div>
          <Popover
            content={
              <div>
                {" "}
                {e.PackageID === selected.PackageID ? (
                  <br>
                    <a href="#/" onClick={selectToDist}>
                      {" "}
                      Distribute Package
                    </a>
                  </br>
                ) : (
                  <Link onClick={() => nav(e)}>View Details</Link>
                )}{" "}
              </div>
            }
            title="Package Actions"
            trigger="click"
            onVisibleChange={handleVisibleChange}
          >
            <Icon
              onClick={() => handleIconClick(e)}
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
    console.log(e);
    props.history.push({
      pathname: "/package-details",
      state: { packInfo: e }
    });
  };

  const handleVisibleChange = e => {
    updateSelected("");
  };

  const handleIconClick = e => {
    console.log(e);
    if (e.status.EventType === "NEW") updateSelected(e);
  };

  const selectToDist = async () => {
    console.log(selected);
    const eventBody = {
      PackageID: selected.PackageID,
      EventDate: selected.status.EventDate,
      EventOwnerReference: selected.DistributorID,
      EventLocation: {
        Latitude: selected.status.EventLocation.Latitude,
        Longitude: selected.status.EventLocation.Longitude
      },
      EventLocationName: selected.status.EventLocationName,
      EventDocumentReferenceID: selected.status.EventDocumentReferenceID
    };

    const newEvent = await createPackageDistEvent(eventBody);
    if (newEvent) updateSelected("");
  };

  return (
    <MainContainer>
      <TableContainer>
        <HeaderContainer>
          <Head>Packages</Head>
          <Icon
            style={styles.plusStyle}
            className="bottle-plus-icon"
            type="plus"
            onClick={createPackageNav}
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

export default PackagesTable;
