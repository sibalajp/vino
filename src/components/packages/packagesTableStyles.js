import styled from "styled-components";

export const Hash = styled.div`
  word-wrap: break-word;
  width: 450px;
  overflow: hidden;
  max-height: 10.8em;
  text-overflow: ellipsis;
  line-height: 1.8em;
`;

export const MainContainer = styled.div`
  padding-top: 10rem;
`;

export const Head = styled.h3`
  display: flex;
  font-size: 18px;
  font-family: "Montserrat", sans-serif;
  float: left;
  width: 85%;
  color: #333333;
`;

export const HeaderContainer = styled.div`
   display: flex;
   position: relative;
   justify-content: space-between
   width: 100%;
   height: 80px;    
   padding: 15px 0 0 40px;
`;

export const Link = styled.a``;

export const TableContainer = styled.div`
  background: #fff;
  margin: 0 auto;
  max-width: calc(100% - 300px);
  text-align: center;
  border-radius: 8px;
  padding: 20px 0 0 0;
  margin-bottom: 100px;
  -webkit-box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  -moz-box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
`;

const filterStyle = {
  fontSize: 20,
  width: "15%",
  color: "#333333",
  position: "relative",
  left: 15
};

const plusStyle = {
  position: "relative",
  right: "-30px",
  color: "#333333",
  fontSize: 20,
  width: "5%"
};

const Details = {
  width: 375,
  fontSize: 16,
  color: "#525866"
};

const KSI = {
  width: 375,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8
};

const Logo = {
  width: "18px",
  marginTop: "4px",
  marginRight: "4px",
  verticalAlign: "top",
  fill: "#E42712",
  background: "#fff"
};

const LogoContainer = {
  float: "left",
  fontSize: "16px",
  fontWeight: 500
};

const Verified = {
  float: "right",
  fontWeight: 500
};

const VerifiIcon = {
  color: "green",
  fontSize: "16px"
};

const ULHash = {
  listStyleType: "none",
  padding: "8px 0",
  width: "100%",
  display: "inline-block"
};

const ListHash = {
  overflow: "hidden",
  width: 370
};

const DetailHash = {
  wordWrap: "break-word",
  width: 315,
  overflow: "hidden",
  maxHeight: "10.8em",
  textOverflow: "ellipsis",
  lineHeight: "1.8em"
};

const Type = {
  color: "rgb(254, 180, 123)"
};

export const styles = {
  plusStyle: plusStyle,
  filterStyle: filterStyle,
  details: Details,
  KSI: KSI,
  Logo: Logo,
  LogoContainer: LogoContainer,
  VerifiIcon: VerifiIcon,
  Verified: Verified,
  ULHash: ULHash,
  ListHash: ListHash,
  hash: DetailHash,
  type: Type
};
