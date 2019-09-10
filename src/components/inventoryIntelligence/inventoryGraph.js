import React, { useState, useEffect, useRef } from "react";

import { BackgroundContainer } from "./inventoryIntelligenceStyle";
import { Icon } from "antd";
import InventoryGraphLabel from "./inventoryGraphLabel";
import clone from "clone";
import Tree from "react-d3-tree";

const InventoryGraph = props => {
  const { graph } = props;
  const [translate, updateTranslate] = useState({});
  const [fullScreen, updateFullScreen] = useState(false);

  const graphRef = useRef(null);

  let treeContainer;

  useEffect(() => {
    let dimensions = treeContainer.getBoundingClientRect();
    updateTranslate({
      x: dimensions.width / 2,
      y: dimensions.height / 2
    });
  }, []);

  const fullScreenToggle = () => {
    let doc = window.document;
    let docEl = doc.getElementById("invent-graph");

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

  const treeData = [];
  if (graph && graph.length && graph[0]) {
    graph.map((data, j) => {
      if (data) {
        if (j === 0) {
          treeData.push({
            name: "Bottle",
            wineName: `${data.WineName}`,
            label: `${data.SicpaID}`,
            year: `${data.WineYear}`,

            _collapsed: true,
            nodeSvgShape: {
              shape: "image",
              shapeProps: {
                r: 0,
                href: "/wine_bottle.svg",
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
        data.bottleHist.map((bottleData, k) => {
          if (treeData[0].children.length < 1) {
            treeData[0].children.push({
              name: "BottleHist",
              attributes: bottleData,
              _collapsed: false,
              nodeSvgShape: {
                shape: "circle",
                shapeProps: {
                  r: 10,
                  y: -10,
                  fill: "red",
                  stroke: "red"
                }
              }
            });
          } else {
            let last = treeData[0].children[0];
            while (last.children) {
              last = last.children[0];
            }
            last.children = [];
            last.children.push({
              name: "BottleHist",
              attributes: bottleData,
              _collapsed: false,
              nodeSvgShape: {
                shape: "circle",
                shapeProps: {
                  r: 10,
                  y: -10,
                  fill: "red",
                  stroke: "red"
                }
              }
            });
          }
        });
        data.consumBotHist.map(consumerHist => {
          let color;
          if (consumerHist.AuthenticateResult === "FAIL") {
            color = "red";
          } else if (
            consumerHist.BottleSCEventStatus === "UnregisteredBottleEvent"
          ) {
            color = "orange";
          } else if (
            consumerHist.BottleSCEventStatus ===
            "WineReceivedByDistributorEvent"
          ) {
            color = "green";
          } else {
            color = "yellow";
          }
          treeData[0].children.push({
            name: "ConsumerEvent",
            attributes: consumerHist,
            _collapsed: true,
            packageData: data,
            nodeSvgShape: {
              shape: "circle",
              shapeProps: {
                r: 10,
                y: -10,
                fill: color,
                stroke: color
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

  return (
    <BackgroundContainer
      full={props.full}
      id="invent-graph"
      ref={tc => (treeContainer = tc)}
    >
      {graph && graph.length ? (
        <span>
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
            nodeSize={{ x: 500, y: 160 }}
            zoom={0.8}
            ref={graphRef}
            collapsible={true}
            allowForeignObjects
            onClick={handleClick}
            nodeLabelComponent={{
              render: <InventoryGraphLabel graph={graph} />,
              foreignObjectWrapper: {
                y: 25,
                x: -100,
                height: 150
              }
            }}
          />{" "}
        </span>
      ) : (
        ""
      )}
    </BackgroundContainer>
  );
};

export default InventoryGraph;
