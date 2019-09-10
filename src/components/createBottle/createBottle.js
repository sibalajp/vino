import React, {useState, useEffect, useCallback} from "react";
import { BottleContainer, 
BottleTitle, 
DropdownStyle, 
IconStyle, 
NextStepButton, 
NextStep, 
SelectedDropStyle, 
SelectedIconStyle, 
Label, 
DatePickerStyle, 
Change, 
SuccessButtons,
NumberOfBatches,
Spinner,
DropdownStyleNum } from './createBottleStyles';
import { Select, DatePicker, notification, Spin } from 'antd';
import { ReactComponent as CreateIcon } from "../../img/create.svg";
import { ReactComponent as RightArrow } from '../../img/arrow_right.svg';
import { ReactComponent as Grapes } from '../../img/grapes_1.svg';
import { ReactComponent as Location } from '../../img/location.svg';
import { ReactComponent as Check } from '../../img/checkmark.svg';
import { loadReceivedBatch } from '../../services/batch.services';
import { addBottleBatchData, getSipcaLabel, loadWineNames } from '../../services/bottle.service';
import moment from "moment";

const { Option } = Select;

const CreateBottle = (props) => {
   
    const [selectedValue, updateSelectedValue] = useState('');
    const [selectedWine, updateSelectedWine] = useState({});
    const [bottledDate, updateDate] = useState(moment());
    const [selected, updateSelected] = useState(false);
    const [complete, updateComplete] = useState(false);
    const [receivedBatch, updateReceived] = useState([]);
    const [valid, updateValid] = useState(false);
    const [numberOfBatches, updateNumberOfBatches] = useState(0);
    const [wineInfo, updateWineInfo] = useState([]);
    const [wineNames, updateWineNames] = useState({});
    const [bottleData, updateBottleData] = useState({
        "alcPercent": 0,
        "baumeLevel": 0,
        "grapeYear": 0,
        "phLevel": 0,
        "sicpaID": "string",
        "SO2": 0,
        "TA": 0,
        "turbidity": 0,
        "VA": 0,
        "vesselType": "",
        "wineNotes": "",
        "wineryName": "",
        "wineYear": ""
    });
    const [latLng, updateLatLng] = useState({
        latitude: 0,
        longitude: 0
    });
    const [sipca, updateSipca] = useState([]);
    const [loading, updateLoading] = useState(false);

    const dateFormat = "DD/MM/YYYY";    

    useEffect(() => {
      const getWineNames = async () => {
        const wineRes = await loadWineNames();
        updateWineNames(wineRes);

        let wineArr = [];
        Object.keys(wineRes).forEach(item => {
          wineRes[item].name = item;
          wineArr.push(wineRes[item]);
        });

        updateWineInfo(wineArr);
      };

      getWineNames();
    }, []);

    useEffect(() => {
        getBatches();
    }, [receivedBatch.length])

    const validation = useCallback(() => {
      if (selectedValue.BatchID && selectedWine.name && (bottledDate || bottleData.bottledDate)) {
        updateValid(true);
      } else updateValid(false);
    }, [selectedValue.BatchID, selectedWine.name, bottledDate]);

    useEffect(() => {
        validation();
    }, [validation])

    function showPosition(position) {
        console.log(position)
        updateLatLng({ latitude:  position.coords.latitude,
        longitude: position.coords.longitude})
    }

    const handleChange = (value) => {        
        try {
            const selected = JSON.parse(value);
            updateSelectedValue(selected);
        } catch (err) {
            console.error(err)
        }
    }

    const checkNumberOfBatches = async e => {
        const val = e;
        const labels = await getSipcaLabel(val);
        let arr = [];
        labels.forEach((res, i) => {
            if(i < val) arr.push(res.SicpaLabelID)
        })
        
        updateSipca(arr);
        if(val > labels.length) openNotification(labels.length);
        else updateNumberOfBatches(val);
    }

    const openNotification = (length) => {
        notification.open({
          message: 'The request cannot be completed.',
          description: `Only ${length} unactivated Sicpa labels are available in the system.`
        }); 
      };

    const selectWine = (value) => {
        try {
            const wineData = JSON.parse(value);
            updateBottleData(wineData.default);
            updateSelectedWine(wineData);

            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const setDate = e => {
        updateDate(e);
      };

    const next = () => {
        // console.log(selectedValue)
        if(selectedValue && numberOfBatches){
            updateSelected(true);
        }
        else return;
    }

    const getBatches = async () => {
        const batches = await loadReceivedBatch();

        updateReceived(batches);
    }

    const limit = [1,2,3,4,5];
 
    const finishBottle = async () => {
        
        if(valid) {
            updateLoading(true);
            updateValid(false);

            const newBottle = {
                "SicpaLabelIDs": sipca,
                  "AlcPercent": bottleData.alcPercent,
                  "BaumeLevel": bottleData.baumeLevel,
                  "BottledDate": moment(bottledDate).format("YYYY-MM-DD"),
                  "GrapeBatchID": selectedValue.BatchID,
                  "WineryGrapeBatchID": selectedValue.WineryBatchID,
                  "GrapeYear": bottleData.grapeYear,
                  "PhLevel": bottleData.phLevel,
                  "SO2": bottleData.SO2,
                  "TA": bottleData.TA,
                  "Turbidity": bottleData.turbidity,
                  "VA": bottleData.VA,
                  "VesselType": bottleData.vesselType,
                  "WineName": selectedWine.name,
                  "WineNotes": bottleData.wineNotes,
                  "WineryName": bottleData.wineryName,
                  "WineYear": bottleData.wineYear,
                  "BottledLocation": latLng
            }

            const bottleInfo = await addBottleBatchData(newBottle);
            console.log("New bottle: ", newBottle);
    
            updateComplete(true);
            updateLoading(false);
        
        }
    }
    
    const handleWineInfo = (e, name) => {
        bottleData[name] = e;
    } 

    const reset = () => {
        updateSelected(false);
        updateSelectedValue('');
        updateSelectedWine({});
        updateDate(0);
        updateComplete(false);
        updateValid(false);
        updateNumberOfBatches(0);
        updateBottleData({
            "alcPercent": 0,
            "baumeLevel": 0,
            "grapeYear": 0,
            "phLevel": 0,
            "sicpaID": "string",
            "SO2": 0,
            "TA": 0,
            "turbidity": 0,
            "VA": 0,
            "vesselType": "",
            "wineNotes": "",
            "wineryName": "",
            "wineYear": "",
            "bottledDate": ""
        })
    }

    const nav = () => {
        props.history.push('/dashboard');
    }

    return (
        <div className="container">
            { !complete && 
                <div style={{ paddingTop: "11.5rem", minHeight: "33rem", paddingBottom: "3rem" }}>
                    {loading && <Spin style={Spinner}> 
                       
                    </Spin>}
                    
                    <BottleContainer>
                        <BottleTitle>Create Bottles</BottleTitle>
                        <Label>Select a grape batch</Label>
                        <CreateIcon style={ !selected ? IconStyle : SelectedIconStyle } />
                        { !selected && 
                            <Select defaultValue="Select a grape batch" style={ DropdownStyle } onChange={handleChange} dropdownStyle={{outline: 'none'}}>
                                {
                                    receivedBatch.map((batch, i) => <Option value={JSON.stringify(batch)} key={i} style={{color: '#525866'}}>{batch.WineryBatchID || batch.Variety}</Option>)
                                }
                            </Select>
                        }
                        { (selectedValue && !selected ) &&
                            <div style={{width: '340px', margin: '10px 0 2rem 0'}}>
                                <Label>Bottle count</Label>
                                <Select defaultValue="Bottle count" style={ DropdownStyleNum } onChange={checkNumberOfBatches} dropdownStyle={{outline: 'none'}}>
                                    {
                                        limit.map((num) => <Option value={num} key={num} style={{color: '#525866'}}>{num}</Option>)
                                    }
                                </Select>
                            </div>
                        }
                        { !selected && 
                            <NextStepButton valid={numberOfBatches} onClick={next}>
                                <div style={{width: '400px', height: '40px'}}>
                                    <div style={ NextStep }>Next Step <RightArrow style={{marginLeft: '5px'}}></RightArrow></div>
                                </div>
                            </NextStepButton>
                        }
                        { selected && 
                            <div>
                                <div style={ SelectedDropStyle }>
                                    <div style={{color: '#A6A6A6', width: "85%", wordBreak: "break-all", whiteSpace: "normal"}}><span style={{color: '#000'}}>Grape Batch:</span> { selectedValue.WineryBatchID || selectedValue.Variety} </div>
                                    <div style={Change} onClick={reset}>(Change)</div>
                                </div>
                                <div style={ NumberOfBatches }>
                                    <div> <span style={{color: '#000'}}># of batches:</span> { numberOfBatches } </div>
                                </div>
                            </div>
                        }
                        { selected &&
                            <div>
                                {/* <Label>SICPA label</Label>
                                <Lock style={ SelectedIconStyle } />
                                <div style={ SelectedDropStyleSic }>
                                    <div style={{color: '#A6A6A6', paddingTop: '2px'}}>12345677890128</div>
                                </div> */}

                                <div style={{marginTop: '0.5rem', marginBottom: selectedWine.name ? '0' : '3rem'}}>
                                    <Label>Select wine name</Label>
                                    <Grapes style={IconStyle} />
                                    <Select defaultValue="Select wine name" style={ DropdownStyle } onChange={selectWine} dropdownStyle={{outline: 'none'}}>
                                        {
                                            wineInfo.map((info, i) => <Option value={JSON.stringify(info)} key={i} style={{color: '#525866'}}>{info.name}</Option>)
                                        }
                                    </Select>
                                </div>
                                { selectedWine.name &&
                                    
                                    <div>
                                        <div style={{marginTop: '1rem'}}>
                                            <Label>SO2</Label>
                                            <Select defaultValue={bottleData.SO2} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'SO2')}>
                                                {
                                                    selectedWine.SO2.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>TA</Label>
                                            <Select style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'TA')} defaultValue={bottleData.TA}>
                                                {
                                                    selectedWine.TA.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>VA</Label>
                                            <Select defaultValue={bottleData.VA} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'VA')}>
                                                {
                                                    selectedWine.VA.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Alcohol percentage</Label>
                                            <Select defaultValue={bottleData.alcPercent} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'alcPercent')}>
                                                {
                                                    selectedWine.alcPercent.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Baume level</Label>
                                            <Select defaultValue={bottleData.baumeLevel} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'baumeLevel')}>
                                                {
                                                    selectedWine.baumeLevel.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Grape year</Label>
                                            <Select style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'grapeYear')} defaultValue={bottleData.grapeYear}>
                                                {
                                                    selectedWine.grapeYear.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>pH level</Label>
                                            <Select defaultValue={bottleData.phLevel} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'phLevel')}>
                                                {
                                                    selectedWine.phLevel.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Turbidity</Label>
                                            <Select defaultValue={bottleData.turbidity} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'turbidity')}>
                                                {
                                                    selectedWine.turbidity.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Vessel type</Label>
                                            <Select defaultValue={bottleData.vesselType} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'vesselType')}>
                                                {
                                                    selectedWine.vesselType.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Wine notes</Label>
                                            <Select defaultValue={bottleData.wineNotes} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'wineNotes')}>
                                                {
                                                    selectedWine.wineNotes.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Wine year</Label>
                                            <Select defaultValue={bottleData.wineYear} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'wineYear')}>
                                                {
                                                    selectedWine.wineYear.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Winery name</Label>
                                            <Select defaultValue={bottleData.wineryName} style={ DropdownStyleNum } onChange={(e) => handleWineInfo(e, 'wineryName')}>
                                                {
                                                    selectedWine.wineryName.map((info, i) => <Option value={info} key={i} style={{color: '#525866'}}>{info}</Option>)
                                                }
                                            </Select>
                                        </div>
                                     

                                        <div style={{marginTop: '1rem'}}>
                                            <Label>Bottling date</Label>
                                            <DatePicker
                                                style={ DatePickerStyle }
                                                size="large"
                                                format={dateFormat}
                                                onChange={setDate}
                                                placeholder="Select a harvest date"
                                                defaultValue={bottledDate}
                                            />
                                        </div>

                                        <div style={{marginTop: '1rem', marginBottom: '3rem'}}>
                                            <Label>Bottling Location</Label>
                                            <div style={{width: '340px', height: '40px', border: '1px solid #D9D9D9', borderRadius: '4px', marginTop: '8px', padding: '7px 7px 7px 10px', fontSize: '16px', color: '#BFBFBF'}}>
                                                {latLng.latitude}, {latLng.longitude}
                                            </div>
                                            <Location style={{ position: 'absolute', right: '40px', marginTop: '-31px', fill: '#BFBFBF'}} />
                                        </div>

                                    </div> 
                                }

                                <NextStepButton valid={valid} onClick={finishBottle}>
                                    <div style={{width: '400px', height: '40px'}}>
                                        <div style={ NextStep }>Create bottles</div>
                                    </div>
                                </NextStepButton>
                            </div>
                        }
                    </BottleContainer>
                </div>
            }
            { complete &&
                <div style={{ paddingTop: "11.5rem", minHeight: "33rem", paddingBottom: "3rem" }}>
                    <BottleContainer>
                        <div style={{width: '250px', margin: '0 auto', textAlign: 'center', paddingBottom: '3.5rem'}}>
                            <Check />
                            <div style={{fontSize: '16px', fontWeight: '700', marginTop: '0.5rem'}}>
                                Bottles created
                            </div>
                            <div style={{fontSize: '16px', marginTop: '0.5rem'}}>
                                These bottles have been successfully created
                            </div>
                        </div>
                        <SuccessButtons>
                            <div onClick={reset} style={{width: '50%', textAlign: 'center', background: '#525866', color: '#fff', height: '47px', padding: '11px'}}>
                                Create another batch
                            </div>
                            <div onClick={nav} style={{width: '50%', textAlign: 'center', background: '#E41E13', color: '#fff', height: '47px', padding: '11px'}}>
                                Finish
                            </div>
                        </SuccessButtons>
                    </BottleContainer>
                </div>
            }
        </div>
        
    );
};

export default CreateBottle;
