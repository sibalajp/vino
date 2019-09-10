import styled from "styled-components";

export const BackgroundContainer = styled.div`
  display: inline-block;
  background-color: #FFFFFF;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 6px 5px 1px rgba(221, 221, 221, 0.58);
  position: ${({full}) => full ? 'absolute' : 'inherited'};
`;


export const Link = styled.a`
  font-size: 16px;
`