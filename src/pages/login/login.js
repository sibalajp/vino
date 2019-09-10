import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
// import { userService } from '../../services/user.service';
import { styles, TopText, VinoHeader, CompanyName } from "./loginStyles";
import { ReactComponent as Logo } from "../../img/guardtime-logo.svg";
import { loadUsers } from "../../services/users.service";

const Login = props => {
  const [users, updateUsers] = useState({});

  useEffect(() => {
    const getUsers = async () => {
        let users = await loadUsers();
        updateUsers(users);
    }

    getUsers()
    localStorage.removeItem("user");
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    props.form.validateFields((err, { email, password }) => {
      let user = users.find(user => user.email === email);

      if (!user) {
        props.form.setFields({
          email: {
            errors: [new Error("Email not found")]
          }
        });
      }

      if (user && user.password === password && !err) {
        const role = user.role;

        localStorage.setItem("user", user.username);
        localStorage.setItem("role", role);
        props.login();
        if(role !== 'Governance') props.history.push("/dashboard");
        else if(role === 'Governance') props.history.push("provenance");
      } else {
        props.form.setFields({
          email: {
            errors: [new Error("Email and password not found")]
          }
        });
      }
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <div style={{ margin: "0 auto", textAlign: "center" }}>
      <div style={{ paddingTop: "7rem", minHeight: "34.34rem" }}>
        <Form onSubmit={handleSubmit} style={styles.LoginForm}>
          <VinoHeader>
            {" "}
            <span>
              <Logo
                style={{
                  width: "24px",
                  marginRight: "5px",
                  verticalAlign: "top",
                  fill: "#E42712",
                  background: "#fff"
                }}
              />
            </span>
            <CompanyName>VINO</CompanyName>
          </VinoHeader>
          <TopText>
            Enter your <span style={{ fontWeight: 700 }}>email address</span>{" "}
            and <span style={{ fontWeight: 700 }}>password:</span>
          </TopText>
          <Form.Item style={styles.FormItem}>
            {getFieldDecorator("email", {
              rules: [
                { required: true, message: "Please input your username!" },
                { type: "email", message: "Must be valid email!" }
              ]
            })(
              <Input
                id="email"
                placeholder="Email address"
                style={{ height: "37px", marginTop: "10px" }}
              />
            )}
          </Form.Item>
          <Form.Item style={styles.FormItem}>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" },
                { min: 8, message: "Password must be at least 8 characters" }
              ]
            })(
              <Input
                id="password"
                type="password"
                placeholder="Password"
                style={{ height: "37px", marginTop: "10px" }}
              />
            )}
          </Form.Item>
          <Form.Item style={styles.FormItem}>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: false
            })(
              <Checkbox
                style={{
                  float: "left",
                  position: "relative",
                  color: "#000000"
                }}
              >
                <span style={{ fontSize: ".8em" }}>Remember me?</span>
              </Checkbox>
            )}
            <a
              style={{ color: "#000000", float: "right", fontSize: ".8em" }}
              href="#temp"
            >
              Forgot your password?
            </a>
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={styles.LoginButton}
            >
              Login to your account{" "}
              <i
                className="fa fa-long-arrow-right"
                style={{ color: "#FFFFFF", paddingLeft: 10 }}
              />
            </Button>
          </Form.Item>
        </Form>
        {/* 
          // to be reinstated
          <Button type="primary" size="large" htmlType="button" style={styles.AntdButton}>
          Sign in with Google
        </Button> 
        */}
      </div>
    </div>
  );
};

export default Form.create({ name: "login" })(Login);
