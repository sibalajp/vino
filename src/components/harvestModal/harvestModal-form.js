import React, { useState, useEffect } from "react";
import { DatePicker, Modal, Button, Form, Input } from "antd";
import { Link } from "./harvestModalStyles";
import "./harvestModal.css";
import moment from "moment";



const HavestModalForm = props => {

  const [batchInfo, updateBatchInfo] = useState({});

  const [weight, updateWeight] = useState(0);
  const [mog, updateMOG] = useState(0);
  const [harvestDate, updateDate] = useState(0);
  const [wineryBatchID, updatewineryBatchID] = useState('');
  const [loading, enterLoading] = useState(false);

  useEffect(() => {
    const validateFields = () => {
      if (weight && mog && harvestDate) {
        updateButton(false);
        updateColor({ backgroundColor: "#E41E13", border: "#E41E13" });
      } else {
        updateButton(true);
        updateColor({});
      }
    };

    validateFields();

    updateBatchInfo(props.data);
    const today = moment().format('YYYY-MM-DD');
    if(props.data && props.data.BatchID){
      const data = props.data;
      const id = data.VineyardName.replace(/ /g, '_') + '_' + data.Variety.replace(/ /g, '_') + '_' + today;
      props.form.getFieldDecorator('wineryBatchID', { initialValue: id });
    }
  }, [weight, mog, harvestDate, batchInfo, props.data, wineryBatchID, props.form]);

  const setWeight = e => {
    updateWeight(e.target.value);
  };

  const setMOG = e => {
    updateMOG(e.target.value);
  };

  const setDate = e => {
    updateDate(e);
  };

  const setID = e => {
    updatewineryBatchID(e);
  }

  const [visible, updateVisibility] = useState(false);

  const showModal = () => {
    updateVisibility(true);
  };

  const handleCancel = () => {
    updateVisibility(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    enterLoading(true);
    let {
      weight,
      MOG,
      harvestDate,
      wineryBatchID
    } = props.form.getFieldsValue([
      "weight",
      "MOG",
      "harvestDate",
      "wineryBatchID"
    ]);

    let date = moment(harvestDate).format("YYYY-MM-DD");
    let today = moment().format("YYYY-MM-DD");

    let data = {
      BatchID: batchInfo.BatchID,
      TotalWeight: weight,
      HarvestDate: date,
      ReceivingDate: today,
      LevelOfMog: MOG,
      WineryBatchID: wineryBatchID
    };

    try {
      let response = await props.updateBatch(data);
      console.log("response", response);
      //batch.services returns [] if error
      if (response.BatchID) {
        enterLoading(false);
        updateVisibility(false);
        // success modal
        Modal.success({
          title: "Harvest information received",
          content:
            "You have successfully entered the harvest information for the new batch",
          width: 375
        });
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const [disabled, updateButton] = useState(true);
  const [color, updateColor] = useState({});

  

  const { getFieldDecorator } = props.form;

  const dateFormat = "DD/MM/YYYY";

  return (
    <div>
      <Link className="link-color-size" onClick={showModal}>
        Enter harvest Information
      </Link>
      <Modal
        className="harvest-modal-form"
        visible={visible}
        title="Enter harvest information"
        onCancel={handleCancel}
        width={375}
        bodyStyle={{ height: '100%' }}
        closable={false}
        footer={[
          <Button id="ant-button-left" key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            disabled={disabled}
            loading={loading}
            type="submit"
            id="ant-button-right"
            key="submit"
            onClick={handleSubmit}
            style={color}
          >
            Finish
          </Button>
        ]}
      >
        <Form hideRequiredMark={true} onSubmit={handleSubmit}>
          <Form.Item label="Total weight (KG)">
            {getFieldDecorator("weight", {
              getValueFromEvent: e => {
                const { target } = e;

                if (isNaN(target.value)) {
                  return;
                } else if (!target.value) {
                  return;
                } else {
                  const convertedValue = Number(target.value);
                  return convertedValue;
                }
              },
              rules: [
                {
                  required: true,
                  message: "Harvest weight is required and must be a number"
                }
              ]
            })(
              <Input
                size="large"
                placeholder="Enter Weight"
                onChange={setWeight}
                style={weight ? { border: "1px solid #1ED176" } : {}}
              />
            )}
          </Form.Item>
          <Form.Item label="Level of MOG (%)">
            {getFieldDecorator("MOG", {
              getValueFromEvent: e => {
                const { target } = e;
                if (isNaN(target.value)) {
                  return;
                } 
                else if (target.value === "") {
                  return
                }
                else {
                  const convertedValue = Number(target.value);
                  return convertedValue;
                }
              },
              rules: [
                {
                  required: true,
                  message: "MOG is required and must be a number"
                }
              ]
            })(
              <Input
                size="large"
                placeholder="Enter level of MOG"
                onChange={setMOG}
                style={mog ? { border: "1px solid #1ED176" } : {}}
              />
            )}
          </Form.Item>
          <Form.Item label="Harvest date">
            {getFieldDecorator("harvestDate", {
              rules: [
                {
                  required: true,
                  message: "Please enter harvest weight"
                }
              ]
            })(
              <DatePicker
                size="large"
                format={dateFormat}
                onChange={setDate}
                placeholder="Select a harvest date"
                style={
                  harvestDate
                    ? {
                        borderRadius: 4,
                        border: "1px solid #1ED176",
                        width: "100%",
                        fontSize: "22px",
                        outline: 'none',
                      }
                    : { width: "100%", fontSize: "22px" }
                }
              />
            )}
          </Form.Item>
          <Form.Item label="Winery batch ID">
            {getFieldDecorator("wineryBatchID", {
              rules: [
                {
                  required: true,
                  message: "Please enter a winery batch ID"
                }
              ]
            })(
              <Input
                size="large"
                onChange={setID}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


export default Form.create({ name: "harvestModal" })(HavestModalForm);




