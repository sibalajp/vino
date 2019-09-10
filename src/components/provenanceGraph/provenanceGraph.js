import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Tree from "react-d3-tree";
import { BackgroundContainer } from "./provenanceGraphStyles";
import GraphLabel from "./graphLabel";
import moment from "moment";
import clone from "clone";
import { Icon } from "antd";

const ProvenanceGraph = props => {
  const [translate, updateTranslate] = useState({});
  const [fullScreen, updateFullScreen] = useState(false);
  const graphRef = useRef(null);
  const { selectedGraph } = props;

  const { t } = useTranslation();

  let treeContainer;

  useEffect(() => {
    let dimensions = treeContainer.getBoundingClientRect();
    updateTranslate({
      x: dimensions.width / 2,
      y: dimensions.height / 2
    });
  }, []);

  const parsedTimeToLocal = time => {
    if (
      moment(time, "Do MMM YYYY - h:mm A").format("Do MMM YYYY - h:mm A") ===
      time
    ) {
      return time;
    }
    const parsedTimestampString = moment
      .utc(time, "ddd MMM DD hh:mm:ss A YYYY")
      .format();
    const localParsedTimestamp = moment(parsedTimestampString)
      .local()
      .format("Do MMM YYYY - h:mm A");
    return localParsedTimestamp;
  };
  const treeData = [];

  let today = moment(new Date());
  if (selectedGraph && selectedGraph.length && selectedGraph[0]) {
    selectedGraph.map((data, j) => {
      if (data) {
        if (j === 0) {
          treeData.push({
            name: `Distributor: ${data.Name}`,
            _collapsed: true,
            nodeSvgShape: {
              shape: "image",
              shapeProps: {
                r: 0,
                href: "/user.svg",
                fill: "red",
                stroke: "red",
                width: 30,
                height: 30,
                fillOpacity: 0.0,
                x: -20,
                y: -18
              }
            },
            children: []
          });
        }
        let color = "";
        if (data.status && data.status.EventType === "NEW") {
          color = "blue";
        } else if (data.status && data.status.EventType === "DISTRIBUTED") {
          color = "yellow";
        } else if (data.status && data.status.EventType === "RECEIVED") {
          color = "green";
        }
        treeData[0].children.push({
          name: `Package ID: ${data.PackageID}`,
          attributes: data,
          _collapsed: true,
          nodeSvgShape: {
            shape: "rect",
            shapeProps: {
              width: 20,
              height: 20,
              y: -10,
              fill: color,
              stroke: color
            }
          },
          children: []
        });
        if (data.statusAll)
          data.statusAll.map((status, i) => {
            let daysDiff = moment.duration(today.diff(status.EventDate));
            let days = Math.floor(daysDiff.asDays());
            let color = "";
            if (days <= 10) {
              color = "blue";
            } else if (10 <= days <= 30) {
              color = "orange";
            } else if (days > 30) {
              color = "red";
            }

            let pointColor = "";
            if (status.EventType === "NEW") {
              pointColor = "blue";
            } else if (status.EventType === "DISTRIBUTED") {
              pointColor = "yellow";
            } else if (status.EventType === "RECEIVED") {
              pointColor = "green";
            }

            status.KsiSig.KSITimeStamp = parsedTimeToLocal(
              status.KsiSig.KSITimeStamp
            );

            treeData[0].children[j].children.push({
              name: `${status.EventType}`,
              _collapsed: true,
              attributes: {
                time: `${status.KsiSig.KSITimeStamp}`,
                hash: `${status.KsiSig.KSITxStateHash}`,
                id: `${status.KsiSig.KSIGatewayID}`,
                scanLocation: `${status.scanLocation}`
              },
              color: color,
              packageData: data,
              nodeSvgShape: {
                shape: "rect",
                shapeProps: {
                  width: 20,
                  height: 20,
                  y: -10,
                  fill: pointColor,
                  stroke: pointColor
                }
              }
            });
          });
      }
    });
  }

  const handleClick = (nodeObjID, evnt, valid) => {
    const ref = graphRef.current;

    const data = clone(ref.state.data);
    const matches = ref.findNodesById(nodeObjID, data, []);
    const targetNode = matches[0];

    if (targetNode && targetNode.depth >= 1) {
      ref.collapseNode(targetNode);
      ref.setState({ data, isTransitioning: true });
      setTimeout(() => ref.setState({ isTransitioning: false }), 100);
      ref.internalState.targetNode = targetNode;
    }
  };

  const fullScreenToggle = () => {
    let doc = window.document;
    let docEl = doc.getElementById("graph");

    let requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    let cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      updateFullScreen(true);
      requestFullScreen.call(docEl);
    } else {
      updateFullScreen(false);
      cancelFullScreen.call(doc);
    }
  };

  return (
    <BackgroundContainer
      full={props.full}
      id="graph"
      ref={tc => (treeContainer = tc)}
    >
      {selectedGraph && selectedGraph.length ? (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
          {!fullScreen ? (
            <Icon
              style={{
                position: "absolute",
                right: 0,
                fontSize: 30,
                padding: 10
              }}
              onClick={() => fullScreenToggle()}
              type="fullscreen"
            />
          ) : (
            <Icon
              style={{
                position: "absolute",
                right: 0,
                fontSize: 30,
                padding: 10
              }}
              onClick={() => fullScreenToggle()}
              type="fullscreen-exit"
            />
          )}
          <Tree
            data={treeData}
            translate={translate}
            nodeSize={{ x: 500, y: 140 }}
            zoom={0.8}
            ref={graphRef}
            collapsible={true}
            allowForeignObjects
            onClick={handleClick}
            nodeLabelComponent={{
              render: (
                <GraphLabel
                  selectedGraph={selectedGraph}
                  className="graphLabel"
                  {...props}
                />
              ),
              foreignObjectWrapper: {
                y: 25,
                x: -100,
                height: 150
              }
            }}
            styles={{
              links: {
                stroke: "#D0D0D0"
              },
              nodes: {
                node: {
                  circle: {
                    stroke: "#E41E13",
                    strokeWidth: 3,
                    fill: "#E41E13"
                  }
                },
                leafNode: {
                  circle: {
                    stroke: "#333333",
                    strokeWidth: 3
                  },
                  name: {},
                  attributes: {}
                }
              }
            }}
          />{" "}
        </div>
      ) : (
        ""
      )}
    </BackgroundContainer>
  );
};

export default ProvenanceGraph;
