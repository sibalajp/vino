import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import GrapesIcon from "../../img/grapes_2.svg";
import {
  getPackages,
  getDistributorNameById,
  getPackageDetails
} from "../../services/package.service";
import { loadBatchInfo } from "../../services/batch.services";

const BottleView = () => {
  const svgRef = useRef(React.createRef());
  var dataRight = {
    name: "Bottle ID:",
    children: [
      {
        name: "Event Status 1"
      },
      {
        name: "Event Status 2"
      },
      {
        name: "Event Status 3"
      },
      {
        name: "Event Status 4"
      },
      {
        name: "Event Status 5"
      }
    ]
  };

  var dataLeft = {
    name: "Bottle ID:",
    children: [
      {
        name: "Grape Batch 1"
      },
      {
        name: "Grape Batch 2"
      },

      {
        name: "Grape Batch 3"
      },

      {
        name: "Grape Batch  4"
      },

      {
        name: "Grape Batch  5"
      }
    ]
  };

  // Left data
  var dataR = {
    name: dataRight.name,
    children: JSON.parse(JSON.stringify(dataRight.children))
  };

  // Right data
  var dataL = {
    name: dataLeft.name,
    children: JSON.parse(JSON.stringify(dataLeft.children))
  };
  useEffect(() => {
    // Create d3 hierarchies
    var right = d3.hierarchy(dataR);
    var left = d3.hierarchy(dataL);

    // draw single tree
    const drawTree = (root, pos) => {
      var SWITCH_CONST = 1;
      if (pos === "left") {
        SWITCH_CONST = -1;
      }

      let svg = d3.select(svgRef.current),
        width = +svg.attr("width"),
        height = +svg.attr("height");

      var g = svg
        .append("g")
        .attr("transform", "translate(" + width / 2.2 + ",0)");

      var tree = d3.tree().size([height, (SWITCH_CONST * (width - 100)) / 2]);

      tree(root);

      var nodes = root.descendants();
      var links = root.links();
      // Set both root nodes to be dead center vertically
      nodes[0].x = height / 2;

      var link = g
        .selectAll(".link")
        .data(links)
        .enter();

      link
        .append("path")
        .attr("class", "link")
        .attr("d", function(d) {
          return (
            "M" +
            d.target.y +
            "," +
            d.target.x +
            "C" +
            (d.target.y + d.source.y) / 2.5 +
            "," +
            d.target.x +
            " " +
            (d.target.y + d.source.y) / 2 +
            "," +
            d.source.x +
            " " +
            d.source.y +
            "," +
            d.source.x
          );
        });

      // Create nodes
      var node = g
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", function(d) {
          return "node" + (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      node
        .append("image")
        .attr("xlink:href", function(d) {
          return d.data.name === "Bottle ID:" ? `${GrapesIcon}` : "";
        })
        .attr("x", "-11px")
        .attr("y", "-15px")
        .attr("width", "30px")
        .attr("height", "30px");

      node
        .append("circle")
        .attr("stroke-width", 3)
        .attr("stroke", function(d, i) {
          return d.data.name === "Bottle ID:" ? "#044B94" : "#E41E13";
        })
        .attr("fill-opacity", function(d, i) {
          return d.data.name === "Bottle ID:" ? 0.0 : 1;
        })
        .attr("r", function(d, i) {
          return d.data.name === "Bottle ID:" ? 0 : 2.5;
        })
        .attr("fill", function(d, i) {
          return d.data.name === "Bottle ID:" ? "#044B94" : "#E41E13";
        });

      node
        .append("text")
        .attr("dy", 3)
        .attr("x", 40)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text(function(d) {
          return d.data.name;
        });
    };

    // Render both trees
    drawTree(right, "right");
    drawTree(left, "left");

    const fetchBottleBatch = async () => {
      let batchInfo = await loadBatchInfo(
        "81a7a14d-63cc-453c-abca-af3300f723d9"
      );
    };

    fetchBottleBatch();
  });

  return (
    <div style={{ height: 1000, paddingTop: 250 }}>
      <div style={{ margin: "0 auto", width: 800, textAlign: "center" }}>
        <svg ref={svgRef} width="800" height="550" />
      </div>
    </div>
  );
};

export default BottleView;
