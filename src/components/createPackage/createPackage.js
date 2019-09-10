import React, { useState, useEffect, useCallback } from 'react';
import { PackageContainer, NextStep, DropdownStyleNum, NextStepButton, PackageTitle,Label,SelectedIconStyle,SelectedDropStyle, Spinner} from './createPackageStyles';
import { ReactComponent as CreateIcon } from "../../img/create.svg";
import { ReactComponent as Location } from '../../img/location.svg';
import { InputNumber, Input, Select, notification, Spin} from 'antd';
import { getAvailableBottles, getBottlesProd } from '../../services/bottle.service';
import { createNewPackage } from '../../services/package.service';
import moment from 'moment';
const { Option } = Select;

export const CreatePackage = (props)=> {
    const {selPackage} = props.location.state;
    
    const [distributors, updateDistributors] = useState([]);
    const [valid, updateValid] = useState(false);
    const [count, updateCount] = useState(selPackage.bottleCount);
    const [price, updatePrice] = useState(0);
    const [tax, updateTax] = useState(0);
    const [bottles, updateBottles] = useState([]);
    const [loading, updateLoading] = useState(false);

    const [packageInfo, updatePackageInfo] = useState({
      "POReference": "",
      "LabelReference": JSON.stringify(selPackage.packageID),
      "DistributorID": "",
      "PackagingDate": moment().format('YYYY-MM-DD'),
      "PackagingLocation": {
        "Latitude": 0,
        "Longitude": 0
      },
      "PackagingLocationName": selPackage.wineryName
    });


    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          updatePackageInfo({
            ...packageInfo,
            PackagingLocation: {
              Latitude: position.coords.latitude,
              Longitude: position.coords.longitude
            }
          });
        });
      }
      const getBottleInfo = async () => {
        const today = moment().format('YYYY-MM-DD');
        const id = selPackage.wineryName + '_' + selPackage.wineName + '_' + today;
        if(count) {
          const body = `packageSize=${count}&wineryGrapeBatchID=${id}&wineName=${selPackage.wineName}&wineYear=${selPackage.wineYear}&winery=${selPackage.wineryName}`;
          const bottleInfo = await getBottlesProd(body);
          bottleInfo.forEach(bottle => {
            bottle.Price = price;
            bottle.Taxation = tax;
          });
          console.log("bottle info", bottleInfo)
          updateBottles(bottleInfo);
        }
      }

      const getDistributors = async () => {
        const dist = await getAvailableBottles();
        updateDistributors(dist);
      };

      getDistributors();
      getBottleInfo();
    }, [
      packageInfo,
      selPackage.wineName,
      selPackage.wineYear,
      selPackage.wineryName,
      bottles.length, count, tax, price
    ]);

    const validate = useCallback(() => {
      if(packageInfo.PackagingLocationName && packageInfo.LabelReference && packageInfo.POReference && packageInfo.DistributorID) {
        updateValid(true);
      } else {
        updateValid(false);
      }
     }, [packageInfo] )

    

    useEffect(() => {
      validate();
    }, [validate]);

   
     
    const handlePackageInfo = (e, parent, name) => {
      try {
        if(e.target.value) {
          if(parent){
              packageInfo[parent][0][name] = e.target.value;
          } else {
            packageInfo[name] = e.target.value
          }
        }
        
      }
      catch {
        packageInfo[name] = e
      }
      validate();
      console.log(packageInfo)
    }

    const handleCount = (e) => {
      console.log(e)
      const val = parseFloat(e);
      updateCount(val);
    }

    const handleTaxAndPrice = (e, type) => {
      if(type === 'tax') {
        updateTax(parseFloat(e.target.value));
      } else if(type === 'price') {
        updatePrice(parseFloat(e.target.value));
      }
    }

    const createPackage = async () => {
      if(valid) {
        updateLoading(true);
        updateValid(false);
        const body = packageInfo;
        packageInfo.Bottles = bottles;
        try {       
          var newPackage = await createNewPackage(body);
        } catch(err) {
          console.error(err);
        }
        console.log("New package", newPackage)
        createNewEvent();
      } else return;
    }

    const createNewEvent = async () => {
      updateLoading(false);
      openNotification();
    }


    const openNotification = () => {
      notification.open({
        message: 'Package created',
        description: 'Your package was successfully created. Redirecting to dashboard.',
        duration: 2,
        onClose: () => {
          props.history.push('/dashboard');
        }
      }); 
    };

    return (
      <div className="container">
        <div
          style={{
            paddingTop: "11.5rem",
            minHeight: "33rem",
            paddingBottom: "3rem"
          }}
        >
          {loading && <Spin style={Spinner}> </Spin>}
          <PackageContainer>
            <PackageTitle>Create package</PackageTitle>
            <Label>Package Label</Label>
            <CreateIcon style={SelectedIconStyle} />
            <div style={SelectedDropStyle}>
              <div style={{ color: "#A6A6A6" }}>
                
                <Input  defaultValue={selPackage.packageID} style={{width: '300px', height: '40px', border: '1px solid #D9D9D9', borderRadius: '4px', padding: '7px 7px 7px 10px', fontSize: '16px', color: '#BFBFBF'}}/>
              </div>
            </div>
            <div style={{ marginTop: "1rem", marginBottom: "2rem"}}>
              <Label>Distributor (Buyer)</Label>
              <Select   onChange={(e) => handlePackageInfo(e, null , "DistributorID")} placeholder="Select a distributor" style={DropdownStyleNum}>
                  {
                      distributors.map((dist, i) => 
                        <Option value={dist.DistributorID} key={i} style={{ color: "#525866" }}>
                            {dist.Name}
                        </Option>
                      )
                  }
              </Select>
            </div>
            <Label>Package Bottles</Label>
            <table style={{ width: "100%", marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>Wine name</th>
                  <th>Bottling date</th>
                  <th>Units</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  style={{
                    borderBottom: "1px solid #DADCE0",
                    borderTop: "1px solid #DADCE0",
                    color: "#A6A6A6"
                  }}
                >
                  <td>{selPackage.wineName}</td>
                  <td>{selPackage.wineYear}</td>
                  <td>
                    {" "}  
                    <InputNumber
                      style={{ width: "70px" }}
                      max={1000}
                      name="points"
                      value={count}
                      onChange={handleCount}
                    />{" "}
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: "1rem" }}>
              <Label>Price</Label>
              <Input  onChange={(e) => handleTaxAndPrice(e, "price")} placeholder="Enter Price" style={{width: '340px', height: '40px', border: '1px solid #D9D9D9', borderRadius: '4px', marginTop: '8px', padding: '7px 7px 7px 10px', fontSize: '16px', color: '#BFBFBF'}}/>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Label>Taxation</Label>
              <Input  onChange={(e) => handleTaxAndPrice(e, "tax")} placeholder="Enter Taxation" style={{width: '340px', height: '40px', border: '1px solid #D9D9D9', borderRadius: '4px', marginTop: '8px', padding: '7px 7px 7px 10px', fontSize: '16px', color: '#BFBFBF'}}/>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Label>Package Location</Label>
              <div style={{width: '340px', height: '40px', border: '1px solid #D9D9D9', borderRadius: '4px', marginTop: '8px', padding: '7px 7px 7px 10px', fontSize: '16px', color: '#BFBFBF'}}>
                  {packageInfo.PackagingLocation.Latitude}, {packageInfo.PackagingLocation.Longitude}
              </div>
              <Location style={{ position: 'absolute', right: '40px', marginTop: '-31px', fill: '#BFBFBF'}} />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Label>Package Location Name</Label>
              <Input  onChange={(e) => handlePackageInfo(e, null , "PackagingLocationName")} defaultValue={selPackage.wineryName} style={{width: '340px', height: '40px', border: '1px solid #D9D9D9', borderRadius: '4px', marginTop: '8px', padding: '7px 7px 7px 10px', fontSize: '16px', color: '#BFBFBF'}}/>
            </div>
            <div style={{ marginTop: "1rem", marginBottom: '2rem' }}>
              <Label>Purchase order</Label>
              <Input onChange={(e) => handlePackageInfo(e, null , "POReference")} placeholder="Enter purchase order reference" style={{width: '340px', height: '40px', border: '1px solid #D9D9D9', borderRadius: '4px', marginTop: '8px', padding: '7px 7px 7px 10px', fontSize: '16px', color: '#BFBFBF'}}/>
            </div>
           
            <NextStepButton valid={valid}>
              <div onClick={createPackage} style={{ width: "400px", height: "40px" }}>
                <div style={NextStep}>Create package</div>
              </div>
            </NextStepButton>
          </PackageContainer>
        </div>
      </div>
    );
}

export default CreatePackage;