import styled from "styled-components";

export const MainContainer = styled.div``;

export const TableContainer = styled.div`
  background: #fff;
  margin: 0 auto;
  max-width: calc(100% - 200px);
  text-align: center;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 2rem;
  -webkit-box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  -moz-box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
`;

export const TableTitle = styled.div`
  padding: #fff;
  text-align: left;
  font-size: 22px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20px;
`;

export const TableChevron = styled.div`
  font-weight: 400;

  &:hover {
    font-weight: 900;
  }
`;

export const PageSize = styled.div`
  
`;

const Button = {
  backgroundColor: "#488AFF",
  borderColor: "#488AFF",
  float: "right",
  height: '45px',
  width: '155px',
  fontSize: '16px'
};

export const styles = {
  Button: Button
};
