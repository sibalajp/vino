import styled from "styled-components";

export const Avatar = styled.div`
  width: 10%;
  display: inline-block;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const Img = styled.div`
  background: #659dff;
  border-radius: 5rem;
  width: 30px;
  height: 30px;
  color: #fff;
  padding-top: 6px;
`;

export const Card = styled.div`
  width: 100%;
  padding: 0 0 15px 15px;
  margin: 10px 0 30px 0;
  box-shadow: 0px 1px 6px 2px rgba(221, 221, 221, 0.58);
  border-radius: 4px;
`;

export const Content = styled.div`
  font-size: 1em;
  font-family: "Roboto", sans-serif;
  width: 75%;
  font-size: 12px;
  padding-right: 19px;
`;

export const Header = styled.div`
  height: 20%;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
  color: #333333;
  padding-top: 10px;
  margin-bottom: 20px;
`;

export const FilterContainer = styled.div`
  height: 25%;
  padding: 1rem;
  width: 100%;
`;
export const MainContainer = styled.div`
  padding: 12rem 2rem 2rem 2rem;
  height: 60rem;
  display: flex;
`;

export const LeftContainer = styled.div`
  width: 80%;
  height: 40rem;
  margin: 1rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
`;

export const FullContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #fff;
`;

export const LinkStyle = styled.a`
  display: inline-block;
  padding-bottom: 10px;
  line-height: 1.2;
  padding: 10px;
`;

export const Notification = styled.div`
  background: #fff;
  height: 50px;
  border-radius: 3px;
  display: flex;
  text-align: center;
`;

export const RightContainer = styled.div`
  margin: 1rem;
  min-width: 350px;
`;

export const StatsBox = styled.div`
  font-family: "Roboto", sans-serif;
  min-height: 15%;
  margin: 0 0 20px 0;
  background-color: #ffffff;
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  display: inline-block;
  width: 47%;
  border-radius: 4px;
  text-align: center;
`;

export const StatsBoxTop = styled.div`
  display: inline-block;
  font-size: 14px;
  text-align: center;
  padding: 12px;
`;
export const StatsBoxBottom = styled.div`
  padding: 10px;
  font-size: 12px;
  color: #ffffff;
  background-color: #488aff;
  border-radius: 0 0 4px 4px;
`;

export const SelectContainer = styled.div`
  width: 500px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  height: 200px;
  padding: 1rem;
  text-align: center;
  padding-top: 75px;
`;

export const MapContainer = styled.div`
  height: 74%;
  width: 100%;
`;

export const FullMapContainer = styled.div`
  height: 100vh;
  width: 100vw;
`;

export const DropDownContainer = styled.div`
  width: 33%;
`;

export const InventDropContainer = styled.div`
  width: 20%;
`;

export const LandingContainer = styled.div`
  width: 500px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  height: 200px;
  padding: 1rem;
  text-align: center;
  padding: 3.6rem;
`;

export const SelectMainContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0.7rem;
  margin-top: 10px;
`;
export const BackButton = styled.div`
  color: #488aff;
  float: right;
  cursor: pointer;

  :hover {
    color: #7dacff;
  }
`;

export const GovernTitle = {
  fontWeight: 700,
  fontSize: "15px",
  color: "#000",
  height: "10%",
  padding: "0.7rem",
  width: "100%"
};

export const DropdownContainer = {
  width: "33%"
};

export const DropTitle = {
  fontSize: "13px",
  textAlign: "left"
};

export const DropTitleLanding = {
  fontSize: "13px",
  textAlign: "left",
  paddingLeft: "30px"
};

export const DropdownStyle = {
  marginTop: "7px",
  border: "1px solid #D9D9D9",
  borderRadius: "4px",
  fontSize: "14px",
  color: "#BFBFBF",
  padding: "1px",
  width: "85%",
  height: "35px"
};

export const Buttons = {
  width: "48%",
  margin: "2px"
};

export const Status = {
  verticalAlign: "middle",
  display: "inline-block",
  width: 15,
  height: 15,
  borderRadius: "50%"
};

export const styles = {
  governTitle: GovernTitle,
  dropdownContainer: DropdownContainer,
  dropTitle: DropTitle,
  dropDownStyle: DropdownStyle,
  Buttons: Buttons,
  DropTitleLanding: DropTitleLanding,
  Status: Status
};
