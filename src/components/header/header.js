import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "antd";
import {
  MenuContainer,
  Menu,
  NameContainer,
  LogoContainer,
  Avatar,
  Name,
  Drop,
  IconContainer,
  Img,
  MenuIcon
} from "./headerStyles";
import "./header.css";
import { getUser } from "../../services/users.service";
import { logout as auhOut } from "../../services/auth.service";
import { ReactComponent as GrapesIcon } from "../../img/grapes_1.svg";
import { ReactComponent as Appt } from "../../img/appt.svg";
import { ReactComponent as Create } from "../../img/create.svg";
import { ReactComponent as Logo } from "../../img/guardtime-logo.svg";

const Header = props => {
  const [isAuth, updateLoginStatus] = useState(false);
  const [role, updateRole] = useState("");
  const [user, updateUser] = useState({});
  const [initials, updateInitials] = useState("");

  const active = props.location.pathname;

  useEffect(() => {
    const getUserInfo = () => {
      getUser(res => {
        const userInfo = res;
        updateInitials(getInitials(userInfo));
        updateUser(userInfo);
      });
    };

    updateRole(props.roledata);
    if (props.roledata) getUserInfo();
  }, [props.roledata, user.firstName, initials]);

  useEffect(() => {
    updateLoginStatus(props.isauth);
  }, [isAuth, props.isauth]);

  const { logout, history } = props;

  const selectMenu = useCallback(
    option => {
      switch (option) {
        case "dashboard":
          updateHeader({
            dashboard: true,
            details: false,
            alerts: false,
            logout: false
          });
          history.push("/dashboard");
          break;
        case "details":
          updateHeader({
            dashboard: false,
            details: true,
            alerts: false,
            logout: false
          });
          break;
        case "alerts":
          updateHeader({
            dashboard: false,
            details: false,
            alerts: true,
            logout: false
          });
          break;
        case "logout":
          updateHeader({
            dashboard: false,
            details: false,
            alerts: false,
            logout: true
          });
          auhOut();
          logout();
          // isAuth = false;
          break;
        default:
          break;
      }
    },
    [logout, history]
  );

  useEffect(() => {
    const getCurrMenu = () => {
      if (active.indexOf("details") > -1) {
        selectMenu("details");
      } else if (active.indexOf("dashboard") > -1) {
        selectMenu("dashboard");
      } else if (active.indexOf("create") > -1) {
        selectMenu("details");
      }
    };
    getCurrMenu();
  }, [active, selectMenu]);

  const [header, updateHeader] = useState({
    dashboard: true,
    details: false,
    alerts: false,
    logout: false
  });

  const getInitials = data => {
    const initials = data.firstName.charAt(0) + data.lastName.charAt(0);
    return initials.toUpperCase();
  };

  return (
    <div className="container" style={{ position: "absolute", width: "100%" }}>
      <div
        style={{
          background: "#E42013",
          height: "250px",
          width: "100%",
          zIndex: "-1",
          position: "absolute"
        }}
      />

      {isAuth && (
        <div>
          <LogoContainer>
            <Logo
              style={{
                width: "24px",
                margin: "0 auto",
                verticalAlign: "right",
                fill: "#E42712",
                background: "#fff",
                borderRadius: 10
              }}
            />
          </LogoContainer>
          <MenuContainer>
            <Menu>
              <IconContainer style={{ marginLeft: "8px" }}>
                <MenuIcon
                  active={header.dashboard}
                  onClick={() => selectMenu("dashboard")}
                >
                  <Icon
                    type="bar-chart"
                    style={
                      header.one
                        ? {
                            background: "#fff",
                            color: "#e42013",
                            margin: "6px 9.5px"
                          }
                        : { margin: "6px 9.5px" }
                    }
                  />
                </MenuIcon>
              </IconContainer>
              {(role === "Weightbridge" || role === "Governance") && (
                <IconContainer style={{ marginLeft: "4px" }}>
                  <MenuIcon
                    active={header.details}
                    onClick={() => selectMenu("details")}
                    style={{ fontSize: "24px", paddingTop: 0 }}
                  >
                    <Icon
                      component={GrapesIcon}
                      {...props}
                      style={
                        header.two
                          ? {
                              background: "#fff",
                              color: "#e42013",
                              margin: "6px 9.5px"
                            }
                          : { margin: "6px 5.5px" }
                      }
                    />
                  </MenuIcon>
                </IconContainer>
              )}

              {role === "Production" && (
                <IconContainer style={{ marginLeft: "4px" }}>
                  <MenuIcon
                    active={header.details}
                    onClick={() => selectMenu("details")}
                    style={{ fontSize: "24px", paddingTop: 0 }}
                  >
                    <Icon
                      component={Appt}
                      {...props}
                      style={
                        header.two
                          ? {
                              background: "#fff",
                              color: "#e42013",
                              margin: "6px 9.5px"
                            }
                          : { margin: "6px 5.5px" }
                      }
                    />
                  </MenuIcon>
                </IconContainer>
              )}
              {role === "Sales" && (
                <IconContainer style={{ marginLeft: "4px" }}>
                  <MenuIcon
                    active={header.details}
                    onClick={() => selectMenu("details")}
                    style={{ fontSize: "24px", paddingTop: 0 }}
                  >
                    <Icon
                      component={Create}
                      {...props}
                      style={
                        header.two
                          ? {
                              background: "#fff",
                              color: "#e42013",
                              margin: "6px 9.5px"
                            }
                          : { margin: "6px 5.5px" }
                      }
                    />
                  </MenuIcon>
                </IconContainer>
              )}

              <IconContainer style={{ marginRight: "4px" }}>
                <MenuIcon
                  active={header.alerts}
                  onClick={() => selectMenu("alerts")}
                >
                  <Icon
                    type="bell"
                    style={
                      header.three
                        ? {
                            background: "#fff",
                            color: "#e42013",
                            margin: "6px 9.5px"
                          }
                        : { margin: "6px 9.5px" }
                    }
                  />
                </MenuIcon>
              </IconContainer>
              <IconContainer style={{ marginRight: "8px" }}>
                <MenuIcon
                  active={header.logout}
                  onClick={() => {
                    selectMenu("logout");
                  }}
                >
                  <Icon
                    type="logout"
                    style={
                      header.four
                        ? {
                            background: "#fff",
                            color: "#e42013",
                            margin: "6px 9.5px"
                          }
                        : { margin: "6px 9.5px" }
                    }
                  />
                </MenuIcon>
              </IconContainer>
            </Menu>
          </MenuContainer>

          <NameContainer>
            <Avatar>
              <Img>{initials}</Img>
            </Avatar>
            <Name>
              {user.firstName} {user.lastName}
            </Name>
            <Drop>
              <Icon type="caret-down" />
            </Drop>
          </NameContainer>
        </div>
      )}
    </div>
  );
};

export default Header;
