import React, { useState, useEffect, useRef } from "react";

import {
  Select,
  DatePicker,
  Tabs,
  Table,
  Form,
  Input,
  Button,
  Modal
} from "antd";
import moment from "moment";
import Geocode from "react-geocode";
import {
  getBottleBatch,
  getBottleByLabelRef,
  getBottles,
  getBottle,
  getBottleHistory,
  getBottleBatchWithParams
} from "../../services/bottle.service";
import { getConsSCEventBotID } from "../../services/consumer.service";
import { getInventoryDefault } from "../../helper-functions";
import InventoryGraph from "./inventoryGraph";
import {
  FormContainer,
  LeftContainer,
  RightContainer,
  MapContainer,
  FullContainer,
  FullMapContainer,
  FilterContainer,
  StatsBox,
  styles,
  StatsBoxTop,
  Card,
  LinkStyle,
  Header,
  StatsBoxBottom,
  InventDropContainer,
  SelectMainContainer,
  MainContainer,
  BackButton
} from "./inventoryIntelligenceStyle";
import { REACT_APP_MAP_TOKEN } from "../../config";
import { relative } from "path";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { TabPane } = Tabs;

const InventoryIntelligence = props => {
  const { size, id } = props.match.params;
  const { getFieldDecorator } = props.form;
  const [click, updateClick] = useState(props.click);
  const [bottleBatch, updateBottleBatch] = useState([]);
  const [selected, updateSelected] = useState([]);
  const [graph, updateGraph] = useState([]);
  const [expandedView, updateExpandedView] = useState(false);
  const [visible, updateInputVisibility] = useState(false);
  const [key, updateKey] = useState(null);

  const [dropValues, updateDropValues] = useState({
    bottleStatus: null,
    wineName: null,
    wineYear: null,
    grapeBatchID: null,
    startDate: null,
    endDate: null
  });
  const ref = useRef(null);

  const { t } = useTranslation();

  Geocode.setApiKey(REACT_APP_MAP_TOKEN);

  useEffect(() => {
    const fetchBottleBatch = async () => {
      if (!click) {
        updateKey("1");
        let bottleBatchRes = await getBottleBatch();
        console.log("bottleBatchRes:", bottleBatchRes);

        updateSelected(getInventoryDefault(bottleBatchRes));
        updateBottleBatch(bottleBatchRes);
      } else {
        updateKey("2");
        setTimeout(() => {
          updateInputVisibility(true);
        }, 100);

        const bottle = await getBottleByLabelRef(click.BottleLabelReference);

        if (bottle && bottle.length) {
          let sicpa = bottle[0].SicpaID;
          let newSicpa = sicpa.replace("|", "%7C");
          const bottleHist = await getBottleHistory(bottle[0].BottleID);
          const consumBotHist = await getConsSCEventBotID(newSicpa);
          geoCodePromise(bottle, bottleHist, consumBotHist).then(res => {
            updateGraph(res);
          });
        }
      }
    };
    fetchBottleBatch();

    if (size === "inventory") updateExpandedView(true);

    const getExpandedData = async () => {
      const bottle = await getBottle(id);
      if (bottle && bottle.length) {
        let sicpa = bottle[0].SicpaID;
        let newSicpa = sicpa.replace("|", "%7C");
        const bottleHist = await getBottleHistory(id);
        const consumBotHist = await getConsSCEventBotID(newSicpa);
        geoCodePromise(bottle, bottleHist, consumBotHist).then(res => {
          updateGraph(res);
        });
      }
    };

    if (id) {
      getExpandedData();
    }
  }, []);

  useEffect(() => {
    let fetchBottleBatch = async () => {
      let getBottleBatch = await getBottleBatchWithParams(dropValues);
      updateSelected(getBottleBatch);
    };
    fetchBottleBatch();
  }, [dropValues]);

  const geoCodePromise = (bottle, bottleHist, consumBotHist) => {
    return new Promise(resolve => {
      var bottlelength = bottle.length - 1;
      var histLength = consumBotHist.length - 1;
      try {
        bottleHist.forEach((item, i) => {
          geocodeLatLng(item.Location.Latitude, item.Location.Longitude).then(
            res => {
              item.scanLocation = res;

              if (i === bottlelength) {
                consumerHist();
              }
            }
          );
        });

        function consumerHist() {
          if (consumBotHist.length) {
            consumBotHist.forEach((consumer, j) => {
              geocodeLatLng(
                consumer.Location.Latitude,
                consumer.Location.Longitude
              ).then(res => {
                consumer.scanLocation = res;

                if (j === histLength) {
                  bottle[0].bottleHist = bottleHist;
                  bottle[0].consumBotHist = consumBotHist;
                  setTimeout(() => {
                    resolve(bottle);
                  }, 500);
                }
              });
            });
          }
        }
      } catch (error) {
        console.error("ERROR: Get bottle unsuccessful");
      }
    });
  };

  const handleStatusChange = (filter, e) => {
    switch (filter) {
      case "bottleStatus":
        updateDropValues({ ...dropValues, bottleStatus: e });
        break;
      case "wineName":
        updateDropValues({ ...dropValues, wineName: e });
        break;
      case "wineYear":
        updateDropValues({ ...dropValues, wineYear: e });
        break;
      case "grapeBatchID":
        updateDropValues({ ...dropValues, grapeBatchID: e });
        break;
      case "startDate":
        let date = moment(e).format("YYYY-MM-DD");
        updateDropValues({ ...dropValues, startDate: date });
        break;
      case "endDate":
        let date2 = moment(e).format("YYYY-MM-DD");
        updateDropValues({ ...dropValues, endDate: date2 });
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: `${t("Winery Name")}`,
      dataIndex: "WineryName",
      key: "0",
      defaultSortOrder: "ascend",
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
      title: `${t("Wine Name")}`,
      dataIndex: "WineName",
      key: "1",
      sorter: (a, b) => {
        if (a.WineName.toLowerCase() < b.WineName.toLowerCase()) {
          return -1;
        }
        if (a.WineName.toLowerCase() > b.WineName.toLowerCase()) {
          return 1;
        }
        return 0;
      }
    },
    {
      title: `${t("Wine Year")}`,
      dataIndex: "WineYear",
      key: "2",
      sorter: (a, b) => {
        if (a.WineYear < b.WineYear) {
          return -1;
        }
        if (a.WineYear > b.WineYear) {
          return 1;
        }
        return 0;
      },
      render: text => <a href="/#">{text}</a>
    },
    {
      title: `${t("Grape Batch")}`,
      dataIndex: "WineryGrapeBatchID",
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
      },
      key: "5"
    },
    {
      title: `${t("Status")}`,
      dataIndex: "BottleStatus",
      sorter: (a, b) => {
        if (a.BottleStatus.toLowerCase() < b.BottleStatus.toLowerCase()) {
          return -1;
        }
        if (a.BottleStatus.toLowerCase() > b.BottleStatus.toLowerCase()) {
          return 1;
        }
        return 0;
      },
      key: "6"
    },
    {
      title: `${t("Bottle Date")}`,
      dataIndex: "BottledDate",
      sorter: (a, b) => {
        if (a.BottledDate < b.BottledDate) {
          return -1;
        }
        if (a.BottledDate > b.BottledDate) {
          return 1;
        }
        return 0;
      },
      key: "7"
    },
    {
      title: `${t("# of Bottles")}`,
      dataIndex: "BottleCount",
      sorter: (a, b) => {
        if (a.BottleCount < b.BottleCount) {
          return -1;
        }
        if (a.BottleCount > b.BottleCount) {
          return 1;
        }
        return 0;
      },
      key: "8"
    }
  ];

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, { bottleID, labelOfReference }) => {
      if (!bottleID && !labelOfReference) {
        Modal.error({
          content: "Please enter a Bottle ID or Label of Reference",
          width: 375
        });
      } else if (!bottleID && labelOfReference) {
        const bottle = await getBottleByLabelRef(labelOfReference);

        if (bottle && bottle.length) {
          let sicpa = bottle[0].SicpaID;
          let newSicpa = sicpa.replace("|", "%7C");
          const bottleHist = await getBottleHistory(bottle[0].BottleID);
          const consumBotHist = await getConsSCEventBotID(newSicpa);
          geoCodePromise(bottle, bottleHist, consumBotHist).then(res => {
            updateGraph(res);
          });
        } else {
          Modal.error({
            content: `No bottle information can be found for selected bottle reference ${labelOfReference}`,
            width: 375
          });
        }
      } else if (bottleID && !labelOfReference) {
        const bottle = await getBottle(bottleID);
        if (bottle && bottle.length) {
          let sicpa = bottle[0].SicpaID;
          let newSicpa = sicpa.replace("|", "%7C");
          const bottleHist = await getBottleHistory(bottleID);
          const consumBotHist = await getConsSCEventBotID(newSicpa);
          geoCodePromise(bottle, bottleHist, consumBotHist).then(res => {
            updateGraph(res);
          });
        } else {
          Modal.error({
            content: `No bottle information can be found for selected bottle reference ${bottleID}`,
            width: 375
          });
        }
      } else if (bottleID && labelOfReference) {
        Modal.error({
          content: "You may only submit Bottle ID OR Label Of Reference",
          width: 375
        });
      }
    });
  };

  const showInput = e => {
    if (e == 1) updateInputVisibility(false);

    if (e == 2) updateInputVisibility(true);
  };

  const geocodeLatLng = async (lat, lng) => {
    const geo = Geocode.fromLatLng(lat, lng).then(
      response => {
        const address = response.results[0].formatted_address;
        console.log(address);
        return address;
      },
      error => {
        console.error(error);
      }
    );

    return geo;
  };

  const expand = () => {
    let params = false;
    if (selected.length) {
      params = {};
      params.dist = dropValues.dist ? dropValues.dist : null;
      params.status = dropValues.status ? dropValues.status : null;
      params.startDate = dropValues.startDate ? dropValues.startDate : null;
      params.endDate = dropValues.endDate ? dropValues.endDate : null;
      params.id = graph[0] ? graph[0].BottleID : null;
      params.view = "inventory";
    }
    window.open(
      window.location.origin +
        `/provenance/inventory` +
        `/${params.dist}` +
        `/${params.status}` +
        `/${params.startDate}` +
        `/${params.endDate}` +
        `/${params.view}` +
        `/${params.id}`,
      "_blank",
      "toolbar=0,location=0,menubar=0"
    );
  };

  return (
    <div className="container">
      {!expandedView && (
        <MainContainer>
          <LeftContainer>
            <FilterContainer>
              <div style={styles.governTitle}>
                {t("Inventory Intelligence")}
                {visible && (
                  <BackButton onClick={expand} style={{ marginRight: "15px" }}>
                    Expand
                  </BackButton>
                )}
              </div>
              <SelectMainContainer>
                <InventDropContainer>
                  <div style={styles.dropTitle}> {t("Status")}</div>
                  <Select
                    defaultValue="Select a status"
                    style={styles.dropDownStyle}
                    onChange={e => handleStatusChange("bottleStatus", e)}
                  >
                    <Option value={"NEW"}>NEW</Option>
                    <Option value={"DISTRIBUTED"}>DISTRIBUTED</Option>
                    <Option value={"ALL"}>ALL</Option>
                  </Select>
                </InventDropContainer>
                <InventDropContainer>
                  <div style={styles.dropTitle}>{t("Wine Name")}</div>
                  <Select
                    style={styles.dropDownStyle}
                    placeholder="Select Wine Name"
                    onChange={e => handleStatusChange("wineName", e)}
                  >
                    {bottleBatch.length &&
                      bottleBatch
                        .filter(
                          (b, i, self) =>
                            self
                              .map(bottle => bottle.WineName)
                              .indexOf(b.WineName) == i
                        )
                        .map((item, i) => (
                          <Option key={i} value={item.WineName}>
                            {item.WineName}
                          </Option>
                        ))}
                    <Option value={"ALL"}>ALL</Option>
                  </Select>
                </InventDropContainer>
                <InventDropContainer>
                  <div style={styles.dropTitle}>{t("Wine Year")}</div>
                  <Select
                    style={styles.dropDownStyle}
                    placeholder="Select Wine Year"
                    onChange={e => handleStatusChange("wineYear", e)}
                  >
                    {bottleBatch.length &&
                      bottleBatch
                        .filter(
                          (b, i, self) =>
                            self
                              .map(bottle => bottle.WineYear)
                              .indexOf(b.WineYear) == i
                        )
                        .map((item, i) => (
                          <Option key={i} value={item.WineYear}>
                            {item.WineYear}
                          </Option>
                        ))}
                    <Option value={"ALL"}>ALL</Option>
                  </Select>
                </InventDropContainer>
                <InventDropContainer>
                  <div style={styles.dropTitle}>{t("Grape Batch")}h</div>
                  <Select
                    style={styles.dropDownStyle}
                    placeholder="Grape Batch"
                    onChange={e => handleStatusChange("grapeBatchID", e)}
                  >
                    {bottleBatch.length &&
                      bottleBatch
                        .filter(
                          (b, i, self) =>
                            self
                              .map(bottle => bottle.WineryGrapeBatchID)
                              .indexOf(b.WineryGrapeBatchID) == i
                        )
                        .map((item, i) => (
                          <Option key={i} value={item.WineryGrapeBatchID}>
                            {item.WineryGrapeBatchID}
                          </Option>
                        ))}
                    <Option value={"ALL"}>ALL</Option>
                  </Select>
                </InventDropContainer>
                <InventDropContainer>
                  <div
                    style={{
                      textAlign: "center",
                      margin: "0 auto",
                      display: "inline-block",
                      paddingRight: 30
                    }}
                  >
                    <div style={styles.dropTitle}>
                      {t("Bottled Date Range")}{" "}
                    </div>

                    <DatePicker
                      showTime
                      format="YYYY-MM-DD"
                      placeholder="Start"
                      onChange={e => handleStatusChange("startDate", e)}
                      style={{
                        minWidth: "100px",
                        width: "100%",
                        margin: "7px 25px 0 0"
                      }}
                    />
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD"
                      placeholder="End"
                      onChange={e => handleStatusChange("endDate", e)}
                      style={{
                        minWidth: "100px",
                        width: "100%",
                        position: "relative",
                        margin: "10px 0px 0 2px"
                      }}
                    />
                  </div>
                </InventDropContainer>
              </SelectMainContainer>
            </FilterContainer>
            <div
              style={{
                height: "81%",
                position: "inherited"
              }}
            >
              <div style={{ textAlign: "center", height: 0 }}>
                {visible && (
                  <FormContainer>
                    <Form layout="inline" onSubmit={handleSubmit}>
                      <span>
                        <Form.Item>
                          {getFieldDecorator("bottleID", {})(
                            <Input placeholder="Bottle Global ID" />
                          )}
                        </Form.Item>
                        <Form.Item>
                          {getFieldDecorator("labelOfReference", {})(
                            <Input placeholder="Label of Reference" />
                          )}
                        </Form.Item>
                        <Form.Item>
                          <Button type="secondary" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </span>
                    </Form>
                  </FormContainer>
                )}
              </div>
              {key && (
                <Tabs
                  style={{
                    minHeight: "100%",
                    position: "relative"
                  }}
                  defaultActiveKey={key}
                  type="line"
                  onTabClick={e => showInput(e)}
                >
                  <TabPane tab={`${t("Inventory")}`} key="1">
                    <Table
                      style={{
                        position: relative,
                        top: 0,
                        bottom: 0
                      }}
                      columns={columns}
                      dataSource={selected}
                      pagination={{
                        showSizeChanger: true,
                        pageSize: 5,
                        pageSizeOptions: ["5", "10", "20"],
                        locale: { items_per_page: "" },
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${total}`
                      }}
                    />
                  </TabPane>
                  <TabPane tab={`${t("Provenance")}`} key="2">
                    <InventoryGraph graph={graph} />
                  </TabPane>
                </Tabs>
              )}
            </div>
          </LeftContainer>

          <RightContainer>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <StatsBox>
                <StatsBoxTop>85,000 KG</StatsBoxTop>
                <StatsBoxBottom>Total batch yield</StatsBoxBottom>
              </StatsBox>
              <StatsBox>
                <StatsBoxTop>5,000</StatsBoxTop>
                <StatsBoxBottom>Bottles purchased</StatsBoxBottom>
              </StatsBox>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <StatsBox>
                <StatsBoxTop>6,000</StatsBoxTop>
                <StatsBoxBottom>Package created</StatsBoxBottom>
              </StatsBox>
              <StatsBox>
                <StatsBoxTop>10,000</StatsBoxTop>
                <StatsBoxBottom>Bottles sold</StatsBoxBottom>
              </StatsBox>
            </div>
            <Card>
              <Header>{t("Governance Views")}</Header>
              <LinkStyle onClick={() => props.handleViewChange("distribution")}>
                Distribution Intelligence
              </LinkStyle>
              <br />
              <LinkStyle onClick={() => props.handleViewChange("consumer")}>
                Consumer Event Intelligence
              </LinkStyle>
              <br />
              <LinkStyle onClick={() => props.handleViewChange("inventory")}>
                Inventory Intelligence
              </LinkStyle>
            </Card>
            <Card>
              <Header>{t("Status key")}</Header>
              <LinkStyle>
                <span
                  style={{
                    ...styles.Status,
                    ...{ backgroundColor: "rgb(228, 32, 19)" }
                  }}
                />{" "}
                Authentication: Fail
              </LinkStyle>
              <br />
              <LinkStyle>
                <span
                  style={{ ...styles.Status, ...{ backgroundColor: "orange" } }}
                />{" "}
                Supply chain: Fail
              </LinkStyle>
              <br />
              <LinkStyle>
                <span
                  style={{ ...styles.Status, ...{ backgroundColor: "yellow" } }}
                />{" "}
                Supply chain: Incomplete
              </LinkStyle>
              <LinkStyle>
                <span
                  style={{ ...styles.Status, ...{ backgroundColor: "green" } }}
                />{" "}
                Supply chain: Complete
              </LinkStyle>
              <br />
              <br />
            </Card>
          </RightContainer>
        </MainContainer>
      )}
      {expandedView && (
        <FullContainer>
          <FullMapContainer ref={ref}>
            <InventoryGraph full={true} graph={graph} />
          </FullMapContainer>
        </FullContainer>
      )}
    </div>
  );
};

export default Form.create({ name: "inventoryIntel" })(InventoryIntelligence);
