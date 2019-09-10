import React from "react";
import {
  FooterContainer,
  FooterMenuContainer,
  FooterColumn,
  RightsContainer,
  FooterTitle,
  FooterRow
} from "./footerStyles";

const Footer = () => {
  return (
    <div className="container">
      <FooterContainer>
        <FooterMenuContainer>
          <FooterColumn>
            <FooterTitle>Support</FooterTitle>
            <FooterRow>Help centre</FooterRow>
            <FooterRow>Contact us</FooterRow>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Learn more</FooterTitle>
            <FooterRow>How it works</FooterRow>
            <FooterRow>FAQ</FooterRow>
            <FooterRow>Press kit</FooterRow>
            <FooterRow>Blog</FooterRow>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Legal</FooterTitle>
            <FooterRow>Terms of use</FooterRow>
            <FooterRow>Privacy Policy</FooterRow>
            <FooterRow>Cookie Policy</FooterRow>
          </FooterColumn>
        </FooterMenuContainer>
        <RightsContainer>2019 Guardtime. All rights reserved.</RightsContainer>
      </FooterContainer>
    </div>
  );
};

export default Footer;
