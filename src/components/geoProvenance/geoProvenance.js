import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getPackages,
  getDistributorNameById,
  getPackageDetails,
  getConsumerData,
  getConsumerDataWithParams
} from "../../services/package.service";
import ConsumerIntelligence from "../consumerIntelligence/consumerIntelligence";
import {
  LeftContainer,
  RightContainer,
  MapContainer,
  FilterContainer,
  StatsBox,
  styles,
  StatsBoxTop,
  Card,
  LinkStyle,
  Header,
  Avatar,
  Img,
  Notification,
  StatsBoxBottom,
  Content,
  DropDownContainer,
  LandingContainer,
  SelectContainer,
  SelectMainContainer,
  BackButton,
  FullContainer,
  FullMapContainer,
  MainContainer
} from "./geoProvenanceStyles";
import MapComponent from "../map/map";
import { Select, Button, DatePicker } from "antd";
import {
  getBottleWithParams,
  getAvailableBottles,
  getBottleBatch,
  getBottle,
  getBottleHistory
} from "../../services/bottle.service";
import ProvenanceGraph from "../provenanceGraph/provenanceGraph";
import InventoryIntelligence from "../inventoryIntelligence/inventoryIntelligence";
import { loadAllBatches } from "../../services/batch.services";
import moment from "moment";
import Geocode from "react-geocode";
import { REACT_APP_MAP_TOKEN } from "../../config";

import { useTranslation } from "react-i18next";

const { Option } = Select;

const GeoProvenance = props => {
  const size = props.match.params.size;
  const [expandedView, updateExpandedView] = useState(false);
  const [packages, updatePackages] = useState([]);
  const [distributors, updateDistributors] = useState({});
  const [bottleBatches, updateBottleBatches] = useState([]);
  const [bottles, updateBottles] = useState([]);
  const [selectedGraph, updateSelectedGraph] = useState([]);
  const [consumerData, updateConsumerData] = useState(null);
  const [click, updateClick] = useState(false);
  const [show, updateShow] = useState({
    map: true,
    graphDistributor: false
  });
  const [view, updateView] = useState({
    distribution: false,
    consumer: false,
    inventory: true
  });

  const [state, updateState] = useState({
    width: 739,
    height: 396,
    latitude: -25.2744,
    longitude: 133.7751,
    zoom: -10
  });
  const [selected, updateSelected] = useState([]);

  const [dropdowns, updateDropdowns] = useState({
    dist: false,
    status: false,
    date: false
  });

  const [dropValues, updateDropValues] = useState({
    dist: null,
    status: null,
    startDate: null,
    endDate: null,
    scanStart: null,
    scanEnd: null,
    authStatus: null,
    supplyStatus: null
  });

  const [filters, updateFilters] = useState([]);
  const ref = useRef(null);
  Geocode.setApiKey(REACT_APP_MAP_TOKEN);

  const { t } = useTranslation();

  useEffect(() => {
    if (size === "governTitle") {
      updateShow({ ...show, map: false, graphDistributor: true });
      updateExpandedView(true);
    } else if (size === "map") {
      updateShow({ ...show, map: true, graphDistributor: false });
      updateExpandedView(true);
    }

    Document.title = "Provenance";

    window.addEventListener("resize", resize);

    const fetchPackage = async () => {
      const dist = await getAvailableBottles();
      updateDistributors(dist);
      // console.log(dist);
      let packagesRes = await getPackages();

      const length = packagesRes.length - 1;
      packagesRes.forEach(async (pack, i) => {
        pack.DistInfo = await getDistributorNameById(pack.DistributorID);
        pack.Name = pack.DistInfo.Name;
        pack.key = i;
        const status = await getPackageDetails(pack.PackageID);
        if (status.length) {
          pack.status = status[0];
          pack.statusAll = status;
        }

        if (i === length) {
          return updatePackages(packagesRes);
        }
      });

      const batch = await loadAllBatches();
      updateBottleBatches(batch);

      const bottlesInfo = await getBottle();
      updateBottles(bottlesInfo);
    };
    if (size)
      setTimeout(() => {
        resize();
      }, 300);
    else resize();
    fetchPackage();

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const params = props.match.params;
    Object.keys(params).forEach(key => {
      params[key] = converType(params[key]);
    });

    function converType(value) {
      var values = {
          undefined: undefined,
          null: null,
          true: true,
          false: false
        },
        isNumber = !isNaN(+value);
      return (
        (isNumber && +value) || (!(value in values) && value) || values[value]
      );
    }

    if (params && packages.length) {
      if (params.view) handleViewChange(params.view);
      if (params.dist) {
        handleStatusChange("distributor", params.dist);
      }
      if (params.status) {
        handleStatusChange("status", params.status);
      }
      if (params.startDate) {
        handleStatusChange("startDate", params.startDate);
      }
      if (params.endDate) {
        handleStatusChange("endDate", params.startDate);
      }
      if (
        !params.dist &&
        !params.status &&
        !params.startDate &&
        !params.endDate
      ) {
        console.log(packages);
        updateSelected(packages);
      }
    }
  }, [props.match, props.match.size, props.match.params, packages]);

  const handleStatusChange = (filter, e) => {
    console.log(filter, e);
    switch (filter) {
      case "status":
        updateDropValues({ ...dropValues, status: e });
        break;
      case "startDate":
        updateDropValues({ ...dropValues, startDate: e });
        break;
      case "endDate":
        updateDropValues({ ...dropValues, endDate: e });
        break;
      case "distributor":
        updateDropValues({ ...dropValues, dist: e });
        break;
      case "authStatus":
        updateDropValues({ ...dropValues, authStatus: e });
        break;
      case "supplyStatus":
        updateDropValues({ ...dropValues, supplyStatus: e });
        break;
      default:
        break;
    }
    // to invoke useEffect
    updateDropdowns();
  };

  useEffect(() => {
    let filterePackaged;

    const updateConsumerVals = async () => {
      const params = dropValues;
      if (dropValues.startDate)
        params.start = dropValues.startDate.format("YYYY-MM-DD");
      if (dropValues.endDate)
        params.end = dropValues.endDate.format("YYYY-MM-DD");
      const newVals = await getConsumerDataWithParams(params);
      updateFilters(newVals);
      updateSelected(newVals);
    };

    if (view.distribution && packages.length) {
      if (
        dropValues.status !== "ALL" &&
        dropValues.status &&
        dropValues.dist &&
        dropValues.startDate &&
        dropValues.endDate
      ) {
        let formatStartDate = moment(
          dropValues.startDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");
        let formatEndDate = moment(
          dropValues.endDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");

        if (formatStartDate === formatEndDate) {
          filterePackaged = packages.filter(info => {
            return (
              info.status.EventType === dropValues.status &&
              info.DistributorID === dropValues.dist &&
              info.PackagingDate === formatStartDate
            );
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        } else {
          filterePackaged = packages.filter(info => {
            return (
              info.status.EventType === dropValues.status &&
              info.DistributorID === dropValues.dist &&
              (moment(info.PackagingDate) <= dropValues.endDate &&
                moment(info.PackagingDate) >= dropValues.startDate)
            );
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        }
      } else if (
        dropValues.status === "ALL" &&
        dropValues.status &&
        dropValues.dist &&
        dropValues.startDate &&
        dropValues.endDate
      ) {
        let formatStartDate = moment(
          dropValues.startDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");
        let formatEndDate = moment(
          dropValues.endDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");

        if (formatStartDate === formatEndDate) {
          filterePackaged = packages.filter(info => {
            return (
              info.DistributorID === dropValues.dist &&
              info.PackagingDate === formatStartDate
            );
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        } else {
          filterePackaged = packages.filter(info => {
            return (
              info.DistributorID === dropValues.dist &&
              (moment(info.PackagingDate) <= dropValues.endDate &&
                moment(info.PackagingDate) >= dropValues.startDate)
            );
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        }
      } else if (
        !dropValues.status &&
        dropValues.dist &&
        dropValues.startDate &&
        dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          return (
            info.DistributorID === dropValues.dist &&
            (moment(info.PackagingDate) <= dropValues.endDate &&
              moment(info.PackagingDate) >= dropValues.startDate)
          );
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        dropValues.status !== "ALL" &&
        dropValues.status &&
        !dropValues.dist &&
        dropValues.startDate &&
        dropValues.endDate
      ) {
        let formatStartDate = moment(
          dropValues.startDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");
        let formatEndDate = moment(
          dropValues.endDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");

        if (formatStartDate === formatEndDate) {
          filterePackaged = packages.filter(info => {
            return (
              info.status.EventType === dropValues.status &&
              info.PackagingDate === formatStartDate
            );
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        } else {
          filterePackaged = packages.filter(info => {
            return (
              info.status.EventType === dropValues.status &&
              (moment(info.PackagingDate) <= dropValues.endDate &&
                moment(info.PackagingDate) >= dropValues.startDate)
            );
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        }
      } else if (
        dropValues.status === "ALL" &&
        dropValues.status &&
        !dropValues.dist &&
        dropValues.startDate &&
        dropValues.endDate
      ) {
        let formatStartDate = moment(
          dropValues.startDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");
        let formatEndDate = moment(
          dropValues.endDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");

        if (formatStartDate === formatEndDate) {
          filterePackaged = packages.filter(info => {
            return info.PackagingDate === formatStartDate;
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        } else {
          filterePackaged = packages.filter(info => {
            return (
              moment(info.PackagingDate) <= dropValues.endDate &&
              moment(info.PackagingDate) >= dropValues.startDate
            );
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        }
      } else if (
        dropValues.status !== "ALL" &&
        dropValues.status &&
        dropValues.dist &&
        !dropValues.startDate &&
        !dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          return (
            info.status.EventType === dropValues.status &&
            info.DistributorID === dropValues.dist
          );
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        dropValues.status === "ALL" &&
        dropValues.status &&
        dropValues.dist &&
        !dropValues.startDate &&
        !dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          return info.DistributorID === dropValues.dist;
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        dropValues.status !== "ALL" &&
        dropValues.status &&
        dropValues.dist &&
        dropValues.startDate &&
        !dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          return (
            info.status.EventType === dropValues.status &&
            info.DistributorID === dropValues.dist &&
            moment(info.PackagingDate) >= dropValues.startDate
          );
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        !dropValues.status &&
        !dropValues.dist &&
        dropValues.startDate &&
        !dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          return moment(info.PackagingDate) >= dropValues.startDate;
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        dropValues.status !== "ALL" &&
        dropValues.status &&
        dropValues.dist &&
        !dropValues.startDate &&
        dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          return (
            info.status.EventType === dropValues.status &&
            info.DistributorID === dropValues.dist &&
            moment(info.PackagingDate) <= dropValues.endDate
          );
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        dropValues.status !== "ALL" &&
        !dropValues.status &&
        dropValues.dist &&
        !dropValues.startDate &&
        !dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          return info.DistributorID === dropValues.dist;
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        dropValues.status !== "ALL" &&
        dropValues.status &&
        !dropValues.dist &&
        !dropValues.startDate &&
        !dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          if (info.status) {
            return info.status.EventType === dropValues.status;
          }
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        dropValues.status === "ALL" &&
        dropValues.status &&
        !dropValues.dist &&
        !dropValues.startDate &&
        !dropValues.endDate
      ) {
        filterePackaged = packages.filter(info => {
          return info;
        });
        updateFilters(filterePackaged);
        updateSelected(filterePackaged);
      } else if (
        !dropValues.status &&
        !dropValues.dist &&
        dropValues.startDate &&
        dropValues.endDate
      ) {
        let formatStartDate = moment(
          dropValues.startDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");
        let formatEndDate = moment(
          dropValues.endDate,
          "Do MMM YYYY - h:mm A"
        ).format("YYYY-MM-DD");

        if (formatStartDate === formatEndDate) {
          filterePackaged = packages.filter(info => {
            return info.PackagingDate === formatStartDate;
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        } else {
          filterePackaged = packages.filter(info => {
            return (
              moment(info.PackagingDate) <= dropValues.endDate &&
              moment(info.PackagingDate) >= dropValues.startDate
            );
          });
          updateFilters(filterePackaged);
          updateSelected(filterePackaged);
        }
      }
    } else if (view.consumer) {
      updateConsumerVals();
    }
  }, [dropValues]);

  const geoGet = selectedGraph => {
    return new Promise(resolve => {
      geocodeLatLng(
        selectedGraph[0].PackagingLocation.Latitude,
        selectedGraph[0].PackagingLocation.Longitude
      ).then(res => {
        selectedGraph[0].packLocation = res;
      });
      let status = selectedGraph[0].statusAll;
      if (status.length) {
        const length = status.length - 1;
        status.forEach(async (stat, i) => {
          geocodeLatLng(
            stat.EventLocation.Latitude,
            stat.EventLocation.Longitude
          ).then(res => {
            stat.scanLocation = res;
            if (i === length) {
              setTimeout(() => {
                resolve(selectedGraph);
              }, 300);
            }
          });
        });
      }
    });
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

  const handleMapClick = clickInfo => {
    if (view.distribution) {
      updateShow({ ...show, map: false, graphDistributor: true });
      geoGet([clickInfo]).then(res => {
        updateFilters(selected);
        updateSelected(res);
      });
    } else {
      updateClick(clickInfo);
      updateView({ distribution: false, consumer: false, inventory: true });
    }
  };

  const [dateState, updateDateState] = useState({
    startValue: null,
    endValue: null,
    endOpen: false
  });

  const disabledStartDate = startValue => {
    const { endValue } = dateState;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = endValue => {
    const { startValue } = dateState;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  const onChange = (field, value) => {
    updateDateState({ ...dateState, [field]: value });
  };

  const onStartChange = value => {
    onChange("startValue", value);
  };

  const onEndChange = value => {
    onChange("endValue", value);
  };

  const handleStartOpenChange = open => {
    if (!open) {
      updateDateState({ ...dateState, endOpen: true });
    }
  };

  const handleEndOpenChange = open => {
    updateDateState({ ...dateState, endOpen: open });
  };

  const back = () => {
    if (filters.length) {
      updateSelected(filters);
    }

    updateShow({ ...show, map: true, graphDistributor: false });
  };

  const toggleMap = () => {
    if (show.map) {
      updateFilters(selected);
      updateShow({ ...show, map: false, graphDistributor: true });
    } else updateShow({ ...show, map: true, graphDistributor: false });
  };

  const expand = () => {
    let params = false;
    if (selected.length) {
      params = {};
      params.dist = dropValues.dist ? dropValues.dist : null;
      params.status = dropValues.status ? dropValues.status : null;
      params.startDate = dropValues.startDate ? dropValues.startDate : null;
      params.endDate = dropValues.endDate ? dropValues.endDate : null;
      params.view = view.distribution
        ? "distribution"
        : view.inventory
        ? "inventory"
        : view.consumer
        ? "consumer"
        : "";
    }
    window.open(
      window.location.origin +
        `/provenance/${show.map ? "map" : "governTitle"}` +
        `/${params.dist}` +
        `/${params.status}` +
        `/${params.startDate}` +
        `/${params.endDate}` +
        `/${params.view}`,
      "_blank",
      "toolbar=0,location=0,menubar=0"
    );
  };

  const handleViewChange = link => {
    switch (link) {
      case "distribution":
        updateView({
          ...view,
          distribution: true,
          consumer: false,
          inventory: false
        });
        updateSelected(packages);
        setTimeout(() => {
          resize();
        }, 100);
        break;
      case "consumer":
        showConsumerGovernance();
        break;
      case "inventory":
        updateView({ distribution: false, consumer: false, inventory: true });
        break;
    }
  };

  function resize() {
    const width = ref.current ? ref.current.offsetWidth : 0;
    const height = ref.current ? ref.current.offsetHeight : 0;
    // console.log(width, height);
    updateState({ ...state, width: width, height: height });
  }

  const showConsumerGovernance = async () => {
    updateShow({ ...show, map: true, graphDistributor: false });
    const consumer = await getConsumerData();
    console.log(consumer);
    let filteredConsumer = consumer.filter(item => {
      const scanDate = moment(item.ScanTime);
      const today = moment();
      const diff = today.diff(scanDate, "days");
      return diff <= 7;
    });
    updateConsumerData(filteredConsumer);
    updateView({
      ...view,
      distribution: false,
      consumer: true,
      inventory: false
    });
    resize();
  };

  useEffect(() => {
    updateSelected(consumerData);
  }, [consumerData]);

  return (
    <div className="container">
      {!expandedView && view.distribution && (
        <MainContainer>
          <LeftContainer>
            <FilterContainer>
              <div style={styles.governTitle}>
                {show.graphDistributor
                  ? "Distribution Provenance Intelligence"
                  : `${t("Distribution Intelligence")}`}
                {show.graphDistributor ? (
                  <BackButton onClick={back} style={{ width: 100 }}>
                    Back to map
                  </BackButton>
                ) : (
                  <BackButton
                    onClick={toggleMap}
                    style={{
                      width: 100,
                      marginLeft: "15px",
                      textAlign: "center"
                    }}
                  >
                    {" "}
                    Graph
                  </BackButton>
                )}
                <BackButton
                  onClick={expand}
                  style={{ marginRight: show.graphDistributor ? "15px" : "" }}
                >
                  Expand
                </BackButton>
              </div>
              <SelectMainContainer>
                {/* {t()} */}
                <DropDownContainer>
                  <div style={styles.dropTitle}> {t("Distributor")}</div>
                  <Select
                    style={styles.dropDownStyle}
                    onChange={e => handleStatusChange("distributor", e)}
                    placeholder="Select a distributor"
                    // value={(selected.length && show.graphDistributor) ? distributors[0].DistributorID : (selected.length  && dropdowns.dist) ? selected[0].Name : "Select a distributor"}
                  >
                    {distributors.length &&
                      distributors.map(item => (
                        <Option value={item.DistributorID}>{item.Name}</Option>
                      ))}
                  </Select>
                </DropDownContainer>
                <DropDownContainer>
                  <div style={styles.dropTitle}>{t("Status")}</div>
                  <Select
                    defaultValue="Select a status"
                    style={styles.dropDownStyle}
                    onChange={e => handleStatusChange("status", e)}
                  >
                    <Option value={"NEW"}>New</Option>
                    <Option value={"RECEIVED"}>Received</Option>
                    <Option value={"DISTRIBUTED"}>Distributed</Option>
                    <Option value={"ALL"}>All</Option>
                  </Select>
                </DropDownContainer>
                <DropDownContainer>
                  <div style={styles.dropTitle}> {t("Date")} </div>
                  <DatePicker
                    disabledDate={disabledStartDate}
                    showTime
                    format="YYYY-MM-DD"
                    value={dropValues.startDate}
                    placeholder="Start"
                    onChange={e => handleStatusChange("startDate", e)}
                    onOpenChange={handleStartOpenChange}
                    style={{
                      minWidth: "100px",
                      width: "49%",
                      margin: "10px 2px 0 0"
                    }}
                  />
                  <DatePicker
                    disabledDate={disabledEndDate}
                    showTime
                    format="YYYY-MM-DD"
                    value={dropValues.endDate}
                    placeholder="End"
                    onChange={e => handleStatusChange("endDate", e)}
                    open={dateState.endOpen}
                    onOpenChange={handleEndOpenChange}
                    style={{
                      minWidth: "100px",
                      width: "49%",
                      margin: "10px 0 0 2px"
                    }}
                  />
                </DropDownContainer>
              </SelectMainContainer>
            </FilterContainer>
            <MapContainer ref={ref}>
              {show.map && (
                <MapComponent
                  state={state}
                  selected={selected}
                  mapClick={handleMapClick}
                  view={view}
                />
              )}
              {show.graphDistributor && packages.length && (
                <ProvenanceGraph {...props} selectedGraph={selected} />
              )}
            </MapContainer>
          </LeftContainer>
          <RightContainer>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <StatsBox>
                <StatsBoxTop>10</StatsBoxTop>
                <StatsBoxBottom>Total Distributors</StatsBoxBottom>
              </StatsBox>
              <StatsBox>
                <StatsBoxTop>100</StatsBoxTop>
                <StatsBoxBottom>Packages In Transit</StatsBoxBottom>
              </StatsBox>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <StatsBox>
                <StatsBoxTop>50</StatsBoxTop>
                <StatsBoxBottom>New Packages</StatsBoxBottom>
              </StatsBox>
              <StatsBox>
                <StatsBoxTop>200</StatsBoxTop>
                <StatsBoxBottom>Packages Received</StatsBoxBottom>
              </StatsBox>
            </div>

            <Card>
              <Header>{t("Governance Views")}</Header>
              <LinkStyle onClick={() => handleViewChange("distribution")}>
                Distribution Intelligence
              </LinkStyle>
              <br />
              <LinkStyle onClick={() => handleViewChange("consumer")}>
                Consumer Event Intelligence
              </LinkStyle>
              <br />
              <LinkStyle onClick={() => handleViewChange("inventory")}>
                Inventory Intelligence
              </LinkStyle>
            </Card>
            <Card>
              <Header>{t("Status key")}</Header>
              <LinkStyle>
                <span
                  style={{ ...styles.Status, ...{ backgroundColor: "blue" } }}
                />{" "}
                New
              </LinkStyle>
              <br />
              <LinkStyle>
                <span
                  style={{ ...styles.Status, ...{ backgroundColor: "green" } }}
                />{" "}
                Received
              </LinkStyle>
              <br />
              <LinkStyle>
                <span
                  style={{ ...styles.Status, ...{ backgroundColor: "yellow" } }}
                />{" "}
                Distributed
              </LinkStyle>
              <br />
              <br />
            </Card>
          </RightContainer>
        </MainContainer>
      )}
      {expandedView && view.distribution && (
        <FullContainer>
          <FullMapContainer ref={ref}>
            {show.map && (
              <MapComponent
                state={state}
                selected={selected}
                mapClick={handleMapClick}
                view={view}
              />
            )}
            {show.graphDistributor && packages.length && (
              <ProvenanceGraph
                {...props}
                full={true}
                selectedGraph={selected}
              />
            )}
          </FullMapContainer>
        </FullContainer>
      )}
      {!expandedView && view.consumer && (
        <MainContainer>
          <LeftContainer>
            <FilterContainer>
              <div style={styles.governTitle}>
                {t("Consumer Event Intelligence")}
              </div>
              <SelectMainContainer>
                <DropDownContainer>
                  <div style={styles.dropTitle}>
                    {t("Authentication Status")}
                  </div>
                  <Select
                    defaultValue="Select a status"
                    style={styles.dropDownStyle}
                    onChange={e => handleStatusChange("authStatus", e)}
                  >
                    <Option value={"PASS"}>Pass</Option>
                    <Option value={"FAIL"}>Fail</Option>
                  </Select>
                </DropDownContainer>
                <DropDownContainer>
                  <div style={styles.dropTitle}>{t("Supply Chain Status")}</div>
                  <Select
                    style={styles.dropDownStyle}
                    placeholder="Select a supply chain status"
                    onChange={e => handleStatusChange("supplyStatus", e)}
                  >
                    <Option value={"COMPLETE"}>Complete</Option>
                    <Option value={"INCOMPLETE"}>Incomplete</Option>
                    <Option value={"FAIL"}>Fail</Option>
                  </Select>
                </DropDownContainer>
                <DropDownContainer>
                  <div style={styles.dropTitle}>{t("Scan time")} </div>
                  <DatePicker
                    disabledDate={disabledStartDate}
                    showTime
                    format="YYYY-MM-DD"
                    value={dropValues.startDate}
                    placeholder="Start"
                    onChange={e => handleStatusChange("startDate", e)}
                    onOpenChange={handleStartOpenChange}
                    style={{
                      minWidth: "100px",
                      width: "49%",
                      margin: "10px 2px 0 0"
                    }}
                  />
                  <DatePicker
                    disabledDate={disabledEndDate}
                    showTime
                    format="YYYY-MM-DD"
                    value={dropValues.endDate}
                    placeholder="End"
                    onChange={e => handleStatusChange("endDate", e)}
                    open={dateState.endOpen}
                    onOpenChange={handleEndOpenChange}
                    style={{
                      minWidth: "100px",
                      width: "49%",
                      margin: "10px 0 0 2px"
                    }}
                  />
                </DropDownContainer>
              </SelectMainContainer>
            </FilterContainer>
            <MapContainer ref={ref}>
              {show.map && (
                <MapComponent
                  state={state}
                  selected={selected}
                  mapClick={handleMapClick}
                  view={view}
                />
              )}
              {show.graphDistributor && packages.length && (
                <ProvenanceGraph {...props} selectedGraph={selected} />
              )}
            </MapContainer>
          </LeftContainer>
          <RightContainer>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <StatsBox>
                <StatsBoxTop>938</StatsBoxTop>
                <StatsBoxBottom>Total Scan Events</StatsBoxBottom>
              </StatsBox>
              <StatsBox>
                <StatsBoxTop>Grosset Apiana</StatsBoxTop>
                <StatsBoxBottom>Top Scanned Wine</StatsBoxBottom>
              </StatsBox>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <StatsBox>
                <StatsBoxTop>
                  <span style={{ fontWeight: 700, color: "red" }}>0</span>
                </StatsBoxTop>
                <StatsBoxBottom>Authentication Failure</StatsBoxBottom>
              </StatsBox>
              <StatsBox>
                <StatsBoxTop>
                  {" "}
                  <span style={{ fontWeight: 700, color: "red" }}>10</span>
                </StatsBoxTop>
                <StatsBoxBottom> Supply Chain Incomplete</StatsBoxBottom>
              </StatsBox>
            </div>
            <Card>
              <Header>{t("Governance Views")}</Header>
              <LinkStyle onClick={() => handleViewChange("distribution")}>
                Distribution Intelligence
              </LinkStyle>
              <br />
              <LinkStyle onClick={() => handleViewChange("consumer")}>
                Consumer Event Intelligence
              </LinkStyle>
              <br />
              <LinkStyle onClick={() => handleViewChange("inventory")}>
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
      )}{" "}
      {!expandedView && view.inventory && (
        <InventoryIntelligence
          {...props}
          click={click}
          handleViewChange={e => handleViewChange(e)}
        />
      )}
    </div>
  );
};

// Notification Card
{
  /* <Card>
    <Header>Notifications</Header>
    <Notification>
      {" "}
      <Avatar>
        <Img>VR</Img>
      </Avatar>
      <Content>
        <div
          style={{
            textAlign: "left",
            paddingLeft: 15,
            fontWeight: 600
          }}
        >
          <p
            style={{
              fontSize: 12,
              margin: 0
            }}
          >
            Vincent Rancine{" "}
            <span style={{ fontWeight: 300, color: "#a6a6a6" }}>
              created{" "}
              <span style={{ textDecoration: "underline" }}>
                6 bottles
              </span>
            </span>
          </p>
          <div
            style={{
              color: "#a6a6a6",
              lineHeight: 1
            }}
          >
            2 hours ago
          </div>
        </div>
      </Content>
    </Notification>

    <Notification>
      {" "}
      <Avatar>
        <Img>VR</Img>
      </Avatar>
      <Content>
        <div
          style={{
            textAlign: "left",
            paddingLeft: 15,
            fontWeight: 600
          }}
        >
          <p
            style={{
              fontSize: 12,
              margin: 0
            }}
          >
            Vincent Rancine{" "}
            <span style={{ fontWeight: 300, color: "#a6a6a6" }}>
              created{" "}
              <span style={{ textDecoration: "underline" }}>
                6 bottles
              </span>
            </span>
          </p>
          <div
            style={{
              color: "#a6a6a6",
              lineHeight: 1
            }}
          >
            2 hours ago
          </div>
        </div>
      </Content>
    </Notification>

    <div>
      <Link>See all notifications</Link>
    </div>
  </Card> */
}

export default GeoProvenance;
