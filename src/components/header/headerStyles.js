import styled from "styled-components";

export const MenuContainer = styled.div`
  width: 100%;
`;

export const Menu = styled.div`
  background: #fff;
  width: 200px;
  height: 50px;
  margin: 55px auto;
  border-radius: 3px;
  display: flex;
`;

export const LogoContainer = styled.div`
  background: #fff;
  width: 50px;
  height: 50px;
  position: absolute;
  border-radius: 50%;
  right: 10px;
  left: 100px;
  display: flex;
  text-align: center;
  padding: 10px;
`;

export const NameContainer = styled.div`
  background: #fff;
  width: 215px;
  height: 50px;
  position: absolute;
  border-radius: 3px;
  right: 70px;
  top: 55px;
  display: flex;
  text-align: center;
`;

export const Avatar = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Name = styled.div`
  font-weight: 600;
  color: #333333;
  font-size: 1em;
  font-family: 'Montserrat', sans-serif;
  justify-content: center;
  width: 65%;
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-right: 5px;
`;

export const Drop = styled.div`
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: left;

  :hover {
    cursor: pointer;
  }
`;

export const Img = styled.div`
  background: #FEB47B;
  border-radius: 5rem;
  width: 30px;
  height: 30px;
  color: #fff;
  padding-top: 4px;
`;

export const IconContainer = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
  }
`;

export const MenuIcon = styled.div`
  background: ${({ active }) => (active ? "#E41E13" : "#fff")};
  border-radius: 5rem;
  width: 37px;
  height: 37px;
  color: ${({ active }) => (active ? "#fff" : "#333")};
  fill: ${({ active }) => (active ? "#fff" : "#333")};
  padding-top: 4px;
  font-size: 18px;
`;
