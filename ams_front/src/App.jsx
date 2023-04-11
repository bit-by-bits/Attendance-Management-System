import "./App.css";
import React, { useEffect } from "react";
import { Button, Card, Form, Input, Select, message } from "antd";
import axios from "axios";
import base from "./baseURL";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    axios({ method: "get", url: `${base}/initiate` });
  }, []);

  const onFinish = values => {
    const { email, password, type } = values;
    axios({
      method: "post",
      url: `${base}/login`,
      data: {
        email: email,
        password: password,
        type: type,
      },
    })
      .then(res => {
        if (type === "student") localStorage.setItem("id", res.data.Student_ID);
        else if (type === "teacher")
          localStorage.setItem("id", res.data.Employee_ID);
        else if (type === "admin")
          localStorage.setItem("id", res.data.Admin_ID);

        localStorage.setItem("type", type);
        message.success("Successfully authenticated user");

        setTimeout(() => {
          navigate(`/${type}`);
        }, 1200);
      })
      .catch(err => {
        message.error("Could not authenticate user");
        console.log(err);
      });
  };

  const onFinishFailed = errorInfo => message.error("Form not filled");

  return (
    <Card
      bordered={false}
      title={
        <div style={{ color: "red", fontWeight: 700, fontSize: 18 }}>
          Authentication Form
        </div>
      }
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 10 }}
        style={{ width: 600 }}
        initialValues={{ type: "student" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="User Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="User Type"
          name="type"
          rules={[
            {
              required: true,
              message: "Please select user type!",
            },
          ]}
        >
          <Select showSearch 
            options={[
              { label: "Student", value: "student" },
              { label: "Teacher", value: "teacher" },
              { label: "Admin", value: "admin" },
            ]}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            htmlType="submit"
            style={{
              height: "max-content",
              backgroundColor: "#F87269",
              borderColor: "white",
              color: "white",
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default App;
