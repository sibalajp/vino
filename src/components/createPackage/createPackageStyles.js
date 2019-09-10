import styled from "styled-components";

export const PackageContainer = styled.div`
  background: #fff;
  width: 400px;
  min-height: 218px;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  position: relative;
`;

export const Label = styled.div`
  fontsize: "16px";
`;

export const PackageTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const SelectedIconStyle = {
  fill: "#525866",
  height: "30px",
  width: "30px",
  position: "absolute",
  marginTop: "7px"
};

export const SelectedDropStyle = {
  width: "340px",
  height: "40px",
  fontSize: "16px",
  color: "#BFBFBF",
  padding: "2px 2px 2px 35px",
  display: "flex",
  marginBottom: "1rem"
};

export const DropdownStyleNum = {
  marginTop: "8px",
  width: "340px",
  height: "40px",
  border: "1px solid #D9D9D9",
  borderRadius: "4px",
  fontSize: "16px",
  color: "#BFBFBF",
  padding: "3px"
};

export const NextStepButton = styled.div`
  background: ${({ valid }) => (valid ? "#E41E13" : "#C6C6C6")};
  height: 47px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  :hover {
    cursor: pointer;
  }
`;

export const NextStep = {
  color: "#fff",
  margin: "0 auto",
  width: "200px",
  fontSize: "16px",
  paddingTop: "10px",
  fontWeight: "400",
  textAlign: "center"
};

export const Spinner = {
  top: "25%",
  zIndex: 2,
  position: "fixed",
}
