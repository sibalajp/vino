import styled from "styled-components";

export const FooterContainer = styled.div`
  background: #333333;
  width: 100%;
  height: 300px;
  color: #fff;
`;

export const FooterMenuContainer = styled.div`
  background: #333;
  width: 600px;
  margin: 0 auto;
  display: flex;
  text-align: center;
  padding-top: 4rem;
`;

export const FooterColumn = styled.div`
  width: 33%;
  text-align: left;
  font-size: 13px;
  padding: 0px 40px;

  :hover {
    cursor: pointer;
  }
`;

export const RightsContainer = styled.div`
  background: #333;
  width: 600px;
  margin: 0 auto;
  text-align: center;
  bottom: 10px;
  margin-top: 5.5rem;
  font-size: 12px;
`;

export const FooterTitle = styled.div`
  font-weight: 700;
  color: #fff;
  fontsize: 15px;
  margin: 5px 0;
`;

export const FooterRow = styled.div`
  margin: 2px 0;

  :hover {
    color: #fff;
    font-weight: 700;
  }
`;
