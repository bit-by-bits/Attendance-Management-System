import axios from "axios";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  Tabs,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import base from "../baseURL";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Attendance Status",
      dataIndex: "attendance",
      key: "attendance",
    },
  ]);

  const [type, setType] = useState("student");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("type") !== "admin") {
      message.error("You are not an admin!");
      navigate("/");
    } else {
      axios({
        method: "get",
        url: `${base}/getAllCourses`,
      })
        .then(res => {
          const courses = res.data.map(course => ({
            label: course.Name,
            value: course.Course_ID,
          }));

          setCourses(courses);
        })
        .catch(err => {
          message.error("Could not fetch courses");
          console.log(err);
        });
    }
  }, []);

  const onFinish1 = values => {};

  const onFinish2 = values => {
    const { course, date } = values;
    function convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }

    axios({
      method: "post",
      url: `${base}/getClassAttendance`,
      data: {
        course: course,
        date: convert(date),
      },
    })
      .then(res => {
        setData(
          res.data.map(student => ({
            key: student.Student_ID,
            name:
              student.First_Name +
              " " +
              student.Middle_Name +
              " " +
              student.Last_Name,
            attendance: student.Status,
          }))
        );
      })
      .catch(err => {
        message.error("No attendance record found");
        console.log(err);
      });
  };

  const onFinishFailed = errorInfo => message.error("Something went wrong!");

  return (
    <Card
      bordered={false}
      title={
        <div style={{ color: "red", fontWeight: 700, fontSize: 18 }}>
          Admin Portal
        </div>
      }
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Add Users",
            children: (
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                style={{ width: 600 }}
                initialValues={{ type: type }}
                onFinish2={onFinish1}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="User Type"
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: "Please select a user type!",
                    },
                  ]}
                >
                  <Select
                    onChange={value => setType(value)}
                    options={[
                      { label: "Student", value: "student" },
                      { label: "Teacher", value: "teacher" },
                      { label: "Admin", value: "admin" },
                    ]}
                  />
                </Form.Item>

                {type === "admin" ? (
                  <>
                    <Form.Item
                      label="First Name"
                      name="first"
                      rules={[
                        {
                          required: true,
                          message: "Please input admin's first name!",
                        },
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Middle Name"
                      name="middle"
                      rules={[
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Last Name"
                      name="last"
                      rules={[
                        {
                          required: true,
                          message: "Please input admin's last name!",
                        },
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Admin ID"
                      name="id"
                      rules={[
                        {
                          required: true,
                          message: "Please input admin id!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please input admin email!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
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
                          message: "Please input a password!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please input admin phone number!",
                        },
                        {
                          pattern: /^.{0,10}$/,
                          message: "Value should be less than 10 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </>
                ) : type === "teacher" ? (
                  <>
                    <Form.Item
                      label="First Name"
                      name="first"
                      rules={[
                        {
                          required: true,
                          message: "Please input employee's first name!",
                        },
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Middle Name"
                      name="middle"
                      rules={[
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Last Name"
                      name="last"
                      rules={[
                        {
                          required: true,
                          message: "Please input employee's last name!",
                        },
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Employee ID"
                      name="id"
                      rules={[
                        {
                          required: true,
                          message: "Please input employee id!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please input employee email!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
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
                          message: "Please input a password!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please input employee phone number!",
                        },
                        {
                          pattern: /^.{0,10}$/,
                          message: "Value should be less than 10 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      label="First Name"
                      name="first"
                      rules={[
                        {
                          required: true,
                          message: "Please input student's first name!",
                        },
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Middle Name"
                      name="middle"
                      rules={[
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Last Name"
                      name="last"
                      rules={[
                        {
                          required: true,
                          message: "Please input student's last name!",
                        },
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Student ID"
                      name="id"
                      rules={[
                        {
                          required: true,
                          message: "Please input student id!",
                        },
                        {
                          pattern: /^.{0,20}$/,
                          message: "Value should be less than 20 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please input student email!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
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
                          message: "Please input a password!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please input admin phone number!",
                        },
                        {
                          pattern: /^.{0,10}$/,
                          message: "Value should be less than 10 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="House Number"
                      name="house"
                      rules={[
                        {
                          required: true,
                          message: "Please input house number!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="City Name"
                      name="city"
                      rules={[
                        {
                          required: true,
                          message: "Please input city name!",
                        },
                        {
                          pattern: /^.{0,30}$/,
                          message: "Value should be less than 30 character",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </>
                )}

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
                    Add {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: "2",
            label: "View Attendance",
            children: (
              <>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 10 }}
                  style={{ width: 600 }}
                  onFinish2={onFinish2}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Pick Course"
                    name="course"
                    rules={[
                      {
                        required: true,
                        message: "Please select a course!",
                      },
                    ]}
                  >
                    <Select options={courses} />
                  </Form.Item>

                  <Form.Item
                    label="Enter Date"
                    name="date"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a date!",
                      },
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
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
                      View Attendance
                    </Button>
                  </Form.Item>
                </Form>

                <Table
                  caption={
                    <div style={{ textAlign: "left", fontWeight: 700 }}>
                      Attendance Report
                    </div>
                  }
                  dataSource={data}
                  columns={columns}
                />
              </>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default Admin;
