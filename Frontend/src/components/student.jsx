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

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

const Student = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState({});

  const [columns1, setColumns1] = useState([
    {
      title: "Course ID",
      dataIndex: "cid",
      key: "cid",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Taken By",
      dataIndex: "teacher",
      key: "teacher",
    },
  ]);
  const [columns2, setColumns2] = useState([
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "CID",
      dataIndex: "course_id",
      key: "course_id",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ]);

  useEffect(() => {
    if (localStorage.getItem("type") !== "student") {
      message.error("You are not a student!");
      navigate("/");
    } else {
      getEnrolledCourses();
      getAttendance();
      getProfile();
    }
  }, []);

  const getEnrolledCourses = () => {
    axios({
      method: "get",
      url: `${base}/getEnrollments/?id=${localStorage.getItem("id")}`,
    })
      .then(res => {
        setData1(
          res.data.map((e, i) => ({
            key: i,
            course: e.Name,
            cid: e.Course_ID,
            teacher: e.Teacher,
          }))
        );

        setCourses(
          res.data.map(e => ({
            value: e.Course_ID,
            label: e.Name,
          }))
        );
      })
      .catch(err =>
        message.error(
          err?.response?.data?.error.sqlMessage || "Could not fetch courses"
        )
      );
  };

  const getAttendance = () => {
    axios({
      method: "get",
      url: `${base}/getAttendance/?id=${localStorage.getItem("id")}`,
    })
      .then(res => {
        setData2(
          res.data.map((e, i) => ({
            key: i,
            date: e.Date.slice(0, 10),
            course: e.Name,
            course_id: e.Course_ID,
            status: e.Status,
          }))
        );
      })
      .catch(err =>
        message.error(
          err?.response?.data?.error.sqlMessage || "Could not fetch attendance"
        )
      );
  };

  const getProfile = () => {
    axios({
      method: "get",
      url: `${base}/getStudentProfile/?id=${localStorage.getItem("id")}`,
    })
      .then(res =>
        setData3({
          first: res.data[1].First_Name,
          last: res.data[1].Last_Name,
          middle: res.data[1].Middle_Name,
          house: res.data[1].House,
          city: res.data[1].City,
          state: res.data[0].State,
          email: res.data[1].Email,
          password: res.data[1].Password,
          phone: res.data[1].Phone_No,
          sid: res.data[1].Student_ID,
        })
      )
      .catch(err =>
        message.error(
          err?.response?.data?.error.sqlMessage || "Could not fetch profile"
        )
      );
  };

  const onFinish1 = values => {
    if (values.question === data3.sid) {
      axios({
        method: "post",
        url: `${base}/updateStudentProfile1`,
        data: { ...values, id: localStorage.getItem("id") },
      })
        .then(res => {
          axios({
            method: "post",
            url: `${base}/updateStudentProfile2`,
            data: { ...values, id: localStorage.getItem("id") },
          })
            .then(res => {
              message.success("Successfully updated profile");
            })
            .catch(err =>
              message.error(
                err?.response?.data?.error.sqlMessage ||
                  "Could not update profile"
              )
            );
        })
        .catch(err =>
          message.error(
            err?.response?.data?.error.sqlMessage || "Could not update profile"
          )
        );
    } else message.error("Wrong Student ID");
  };

  const onFinish2 = values => {
    const { course, date } = values;

    axios({
      method: "post",
      url: `${base}/applyLeave1`,
      data: {
        course: course,
        date: convert(date),
        id: localStorage.getItem("id"),
      },
    })
      .then(res =>
        axios({
          method: "post",
          url: `${base}/applyLeave2`,
          data: {
            course: course,
            date: convert(date),
            id: localStorage.getItem("id"),
          },
        })
          .then(res => message.success("Successfully applied for leave"))
          .catch(err =>
            message.error(
              err?.response?.data?.error.sqlMessage ||
                "Could not apply for leave"
            )
          )
      )
      .catch(err =>
        message.error(
          err?.response?.data?.error.sqlMessage || "Could not apply for leave"
        )
      );
  };

  const onFinishFailed = errorInfo => message.error("Form not filled");

  return (
    <Card
      style={{ minWidth: 600 }}
      bordered={false}
      title={
        <div style={{ color: "red", fontWeight: 700, fontSize: 18 }}>
          Student Portal
        </div>
      }
      extra={
        <Button
          style={{
            backgroundColor: "#F2BE6A",
            fontWeight: 700,
            textShadow: "0px 0px 1px orange",
            color: "white",
            borderColor: "white",
          }}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </Button>
      }
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "View Courses",
            children: (
              <Table
                caption={
                  <div style={{ textAlign: "left", fontWeight: 700 }}>
                    Courses Enrolled
                  </div>
                }
                dataSource={data1}
                columns={columns1}
              />
            ),
          },
          {
            key: "2",
            label: "View Attendance",
            children: (
              <Table
                caption={
                  <div style={{ textAlign: "left", fontWeight: 700 }}>
                    Weekly Attendance Report
                  </div>
                }
                dataSource={data2}
                columns={columns2}
              />
            ),
          },
          {
            key: "3",
            label: "Update Profile",
            children: (
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                style={{ width: 600 }}
                initialValues={data3}
                onFinish={onFinish1}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
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
                  label="Email ID"
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
                      pattern: /^.{6,30}$/,
                      message: "Password must lie between 6-30 characters",
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
                      pattern: /^[0-9]{10}$/,
                      message: "Phone number must have 10 digits only",
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

                <Form.Item
                  label="State Name"
                  name="state"
                  rules={[
                    {
                      required: true,
                      message: "Please input state name!",
                    },
                    {
                      pattern: /^.{0,30}$/,
                      message: "Value should be less than 30 character",
                    },
                  ]}
                >
                  <Input />
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
                    Update
                  </Button>
                </Form.Item>

                <Form.Item
                  label="Enter your Student ID"
                  name="question"
                  rules={[
                    {
                      required: true,
                      message: "security question: enter student id",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Form>
            ),
          },
          {
            key: "4",
            label: "Apply Leave",
            children: (
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                style={{ width: 600 }}
                onFinish={onFinish2}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Course"
                  name="course"
                  rules={[
                    {
                      required: true,
                      message: "Please select a course!",
                    },
                  ]}
                >
                  <Select showSearch options={courses} />
                </Form.Item>

                <Form.Item
                  label="Date"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Please select a date!",
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
                    Apply Leave
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default Student;
