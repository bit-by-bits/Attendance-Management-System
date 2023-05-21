import axios from "axios";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
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

const Teacher = () => {
  const navigate = useNavigate();

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  const [columns1, setColumns1] = useState([
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

  const [columns2, setColumns2] = useState([]);
  const [columns3, setColumns3] = useState([
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Button
            style={{
              backgroundColor: "#F2BE6A",
              color: "white",
              borderColor: "white",
            }}
            onClick={() => {
              axios({
                method: "post",
                url: `${base}/acceptApplication`,
                data: {
                  date: record.date,
                  sid: record.id,
                  cid: record.cid,
                },
              })
                .then(res => {
                  message.success("Application accepted!");
                  getApplicantions(record.cid);
                })
                .catch(err =>
                  message.error(
                    err?.response?.data?.error?.sqlMessage ||
                      "Could not accept application!"
                  )
                );
            }}
          >
            Accept
          </Button>

          <Button
            style={{
              backgroundColor: "#F87269",
              color: "white",
              borderColor: "white",
            }}
            onClick={() => {
              axios({
                method: "post",
                url: `${base}/rejectApplication`,
                data: {
                  date: record.date,
                  sid: record.id,
                  cid: record.cid,
                },
              })
                .then(res => {
                  message.success("Application rejected!");
                  getApplicantions(record.cid);
                })
                .catch(err =>
                  message.error(
                    err?.response?.data?.error?.sqlMessage ||
                      "Could not reject application!"
                  )
                );
            }}
          >
            Reject
          </Button>
        </span>
      ),
    },
  ]);

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("type") !== "teacher") {
      message.error("You are not a teacher!");
      navigate("/");
    } else {
      getCourses();
    }
  }, []);

  const getCourses = () => {
    axios({
      method: "get",
      url: `${base}/getCourses/?id=${localStorage.getItem("id")}`,
    })
      .then(res =>
        setCourses(
          res.data.map(course => ({
            label: course.Name,
            value: course.Course_ID,
          }))
        )
      )
      .catch(err => {
        message.error("No courses found");
        console.log(err);
      });
  };

  const getStudents = cid => {
    axios({
      method: "get",
      url: `${base}/getCourseStudents/?tid=${localStorage.getItem(
        "id"
      )}&cid=${cid}`,
    }).then(res => {
      setStudents(
        res.data.map(student => ({
          label:
            (student.First_Name ?? "") +
            " " +
            (student.Middle_Name ?? "") +
            " " +
            (student.Last_Name ?? ""),
          value: student.Student_ID,
        }))
      );
    });
  };

  const getApplicantions = cid => {
    axios({
      method: "get",
      url: `${base}/getApplications/?id=${cid}`,
    })
      .then(res =>
        setData3(
          res.data.map(student => ({
            key: student.Student_ID,
            id: student.Student_ID,
            cid: cid,
            name:
              (student.First_Name ?? "") +
              " " +
              (student.Middle_Name ?? "") +
              " " +
              (student.Last_Name ?? ""),
            date: student.Date.slice(0, 10),
            status: student.Status,
          }))
        )
      )
      .catch(err => {
        message.error("No applications found");
        console.log(err);
      });
  };

  const onFinish1 = values => {
    axios({
      method: "post",
      url: `${base}/addStudent1`,
      data: values,
    })
      .then(res =>
        axios({
          method: "post",
          url: `${base}/addStudent2`,
          data: values,
        })
          .then(res => message.success("User added successfully!"))
          .catch(err =>
            message.error(
              err?.response?.data?.error?.sqlMessage || "Something went wrong!"
            )
          )
      )
      .catch(err =>
        message.error(
          err?.response?.data?.error?.sqlMessage || "Something went wrong!"
        )
      );
  };

  const onFinish2 = values => {
    const { course, date } = values;

    axios({
      method: "post",
      url: `${base}/getClassAttendance`,
      data: {
        course: course,
        date: convert(date),
      },
    })
      .then(res => {
        setData1(
          res.data.map(student => ({
            key: student.Student_ID,
            name:
              (student.First_Name ?? "") +
              " " +
              (student.Middle_Name ?? "") +
              " " +
              (student.Last_Name ?? ""),
            attendance: student.Status,
          }))
        );
      })
      .catch(err => {
        message.error("No attendance record found");
        console.log(err);
      });
  };

  const onFinish3 = values => {
    const { course, student, date, status } = values;

    axios({
      method: "post",
      url: `${base}/markStudentAttendance1`,
      data: {
        sid: student,
        cid: course,
        status: status,
        date: convert(date),
      },
    })
      .then(res =>
        axios({
          method: "post",
          url: `${base}/markStudentAttendance2`,
          data: {
            sid: student,
            cid: course,
            status: status,
            date: convert(date),
          },
        })
          .then(res => message.success("Attendance marked successfully!"))
          .catch(err =>
            message.error(
              err?.response?.data?.error?.sqlMessage || "Attendance not marked!"
            )
          )
      )
      .catch(err =>
        message.error(
          err?.response?.data?.error?.sqlMessage || "Attendance not marked!"
        )
      );
  };

  const onFinishFailed = errorInfo => message.error("Form not filled");

  return (
    <Card
      bordered={false}
      title={
        <div style={{ color: "red", fontWeight: 700, fontSize: 18 }}>
          Teacher Portal
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
            label: "Access Users",
            children: (
              <>
                <Tabs
                  defaultActiveKey="1"
                  items={[
                    {
                      key: "1",
                      label: "All",
                      children: (
                        <Form
                          name="basic"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 10 }}
                          style={{ width: 600 }}
                          onFinish={values => {
                            axios({
                              method: "get",
                              url: `${base}/getStudents1`,
                            })
                              .then(res => {
                                setData2(
                                  res.data.map(item => ({
                                    key: item.id,
                                    name:
                                      (item.First_Name ?? "") +
                                      " " +
                                      (item.Middle_Name ?? "") +
                                      " " +
                                      (item.Last_Name ?? ""),
                                    id: item.Student_ID,
                                    email: item.Email,
                                    phone: item.Phone_No,
                                    house: item.House,
                                    city: item.City,
                                  }))
                                );

                                setColumns2([
                                  {
                                    title: "Name",
                                    dataIndex: "name",
                                    key: "name",
                                  },
                                  {
                                    title: "Student ID",
                                    dataIndex: "id",
                                    key: "id",
                                  },
                                  {
                                    title: "Email",
                                    dataIndex: "email",
                                    key: "email",
                                  },
                                  {
                                    title: "Phone Number",
                                    dataIndex: "phone",
                                    key: "phone",
                                  },
                                  {
                                    title: "House Number",
                                    dataIndex: "house",
                                    key: "house",
                                  },
                                  {
                                    title: "City",
                                    dataIndex: "city",
                                    key: "city",
                                  },
                                ]);
                              })
                              .catch(err => {
                                setData2([]);
                                setColumns2([]);

                                message.error("Could not find any value");
                                console.log(err);
                              });
                          }}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
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
                              Search All
                            </Button>
                          </Form.Item>
                          Note: This will show all the students in the
                          institution.
                          <br />
                          <br />
                        </Form>
                      ),
                    },
                    {
                      key: "2",
                      label: "By Names",
                      children: (
                        <Form
                          name="basic"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 10 }}
                          style={{ width: 600 }}
                          onFinish={values => {
                            const { first, last } = values;

                            axios({
                              method: "get",
                              url: `${base}/getStudents2/?first=${first}&last=${last}`,
                            })
                              .then(res => {
                                setData2(
                                  res.data.map(item => ({
                                    key: item.id,
                                    name:
                                      (item.First_Name ?? "") +
                                      " " +
                                      (item.Middle_Name ?? "") +
                                      " " +
                                      (item.Last_Name ?? ""),
                                    id: item.Student_ID,
                                    email: item.Email,
                                    phone: item.Phone_No,
                                    house: item.House,
                                    city: item.City,
                                  }))
                                );

                                setColumns2([
                                  {
                                    title: "Name",
                                    dataIndex: "name",
                                    key: "name",
                                  },
                                  {
                                    title: "Student ID",
                                    dataIndex: "id",
                                    key: "id",
                                  },
                                  {
                                    title: "Email",
                                    dataIndex: "email",
                                    key: "email",
                                  },
                                  {
                                    title: "Phone Number",
                                    dataIndex: "phone",
                                    key: "phone",
                                  },
                                  {
                                    title: "House Number",
                                    dataIndex: "house",
                                    key: "house",
                                  },
                                  {
                                    title: "City",
                                    dataIndex: "city",
                                    key: "city",
                                  },
                                ]);
                              })
                              .catch(err => {
                                setData2([]);
                                setColumns2([]);

                                message.error("Could not find any value");
                                console.log(err);
                              });
                          }}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
                          <Form.Item label="First Name" name="first">
                            <Input />
                          </Form.Item>

                          <Form.Item label="Last Name" name="last">
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
                              Search
                            </Button>
                          </Form.Item>
                        </Form>
                      ),
                    },
                    {
                      key: "3",
                      label: "By Courses",
                      children: (
                        <Form
                          name="basic"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 10 }}
                          style={{ width: 600 }}
                          onFinish={values => {
                            const { course } = values;

                            axios({
                              method: "get",
                              url: `${base}/getStudents6/?cid=${course}`,
                            })
                              .then(res => {
                                setData2(
                                  res.data.map(item => ({
                                    key: item.id,
                                    name:
                                      (item.First_Name ?? "") +
                                      " " +
                                      (item.Middle_Name ?? "") +
                                      " " +
                                      (item.Last_Name ?? ""),
                                    id: item.Student_ID,
                                    attendance: item.Attendance_Percentage,
                                  }))
                                );

                                setColumns2([
                                  {
                                    title: "Name",
                                    dataIndex: "name",
                                    key: "name",
                                  },
                                  {
                                    title: "Student ID",
                                    dataIndex: "id",
                                    key: "id",
                                  },
                                  {
                                    title: "Attendance",
                                    dataIndex: "attendance",
                                    key: "attendance",
                                  },
                                ]);
                              })
                              .catch(err => {
                                setData2([]);
                                setColumns2([]);

                                message.error("Could not find any value");
                                console.log(err);
                              });
                          }}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
                          <Form.Item label="Select Course" name="course">
                            <Select showSearch options={courses} />
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
                              Search
                            </Button>
                          </Form.Item>
                        </Form>
                      ),
                    },
                    {
                      key: "4",
                      label: "By Attendance",
                      children: (
                        <Form
                          name="basic"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 10 }}
                          style={{ width: 600 }}
                          onFinish={values => {
                            const { percent } = values;

                            axios({
                              method: "get",
                              url: `${base}/getStudents3/?percent=${percent}`,
                            })
                              .then(res => {
                                setData2(
                                  res.data.map(item => ({
                                    key: item.id,
                                    name:
                                      (item.First_Name ?? "") +
                                      " " +
                                      (item.Middle_Name ?? "") +
                                      " " +
                                      (item.Last_Name ?? ""),
                                    id: item.Student_ID,
                                    present: item.Present_Classes,
                                    total: item.Total_Classes,
                                    percent: item.Attendance_Percentage,
                                  }))
                                );

                                setColumns2([
                                  {
                                    title: "Name",
                                    dataIndex: "name",
                                    key: "name",
                                  },
                                  {
                                    title: "Student ID",
                                    dataIndex: "id",
                                    key: "id",
                                  },
                                  {
                                    title: "Present",
                                    dataIndex: "present",
                                    key: "present",
                                  },
                                  {
                                    title: "Total",
                                    dataIndex: "total",
                                    key: "total",
                                  },
                                  {
                                    title: "Percent",
                                    dataIndex: "percent",
                                    key: "percent",
                                  },
                                ]);
                              })
                              .catch(err => {
                                setData2([]);
                                setColumns2([]);

                                message.error("Could not find any value");
                                console.log(err);
                              });
                          }}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
                          <Form.Item
                            label="Min Attendance Percent"
                            name="percent"
                          >
                            <InputNumber min={0} max={100} />
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
                              Search
                            </Button>
                          </Form.Item>
                        </Form>
                      ),
                    },
                    {
                      key: "5",
                      label: "By Permissions",
                      children: (
                        <Form
                          name="basic"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 10 }}
                          style={{ width: 600 }}
                          onFinish={values => {
                            axios({
                              method: "get",
                              url: `${base}/getStudents4`,
                            })
                              .then(res => {
                                setData2(
                                  res.data.map(item => ({
                                    key: item.id,
                                    name:
                                      (item.First_Name ?? "") +
                                      " " +
                                      (item.Middle_Name ?? "") +
                                      " " +
                                      (item.Last_Name ?? ""),
                                    id: item.Student_ID,
                                    email: item.Email,
                                    phone: item.Phone_No,
                                    house: item.House,
                                    city: item.City,
                                  }))
                                );

                                setColumns2([
                                  {
                                    title: "Name",
                                    dataIndex: "name",
                                    key: "name",
                                  },
                                  {
                                    title: "Student ID",
                                    dataIndex: "id",
                                    key: "id",
                                  },
                                  {
                                    title: "Email",
                                    dataIndex: "email",
                                    key: "email",
                                  },
                                  {
                                    title: "Phone Number",
                                    dataIndex: "phone",
                                    key: "phone",
                                  },
                                  {
                                    title: "House Number",
                                    dataIndex: "house",
                                    key: "house",
                                  },
                                  {
                                    title: "City",
                                    dataIndex: "city",
                                    key: "city",
                                  },
                                ]);
                              })
                              .catch(err => {
                                setData2([]);
                                setColumns2([]);

                                message.error("Could not find any value");
                                console.log(err);
                              });
                          }}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
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
                              Search All
                            </Button>
                          </Form.Item>
                          Note: This will show all students who have ever
                          applied for leave permissions.
                          <br />
                          <br />
                        </Form>
                      ),
                    },
                    {
                      key: "6",
                      label: "By Defects",
                      children: (
                        <Form
                          name="basic"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 10 }}
                          style={{ width: 600 }}
                          onFinish={values => {
                            axios({
                              method: "get",
                              url: `${base}/getStudents5`,
                            })
                              .then(res => {
                                setData2(
                                  res.data.map(item => ({
                                    key: item.id,
                                    first: item.First_Name,
                                    last: item.Last_Name,
                                    id: item.Student_ID,
                                  }))
                                );

                                setColumns2([
                                  {
                                    title: "Student ID",
                                    dataIndex: "id",
                                    key: "id",
                                  },
                                  {
                                    title: "First Name",
                                    dataIndex: "first",
                                    key: "first",
                                  },
                                  {
                                    title: "Last Name",
                                    dataIndex: "last",
                                    key: "last",
                                  },
                                ]);
                              })
                              .catch(err => {
                                setData2([]);
                                setColumns2([]);

                                message.error("Could not find any value");
                                console.log(err);
                              });
                          }}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
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
                              Search All
                            </Button>
                          </Form.Item>
                          Note: This will show all students who have ever been
                          on leave without permission.
                          <br />
                          <br />
                        </Form>
                      ),
                    },
                  ]}
                />

                <Table
                  caption={
                    <div style={{ textAlign: "left", fontWeight: 700 }}>
                      Student Data
                    </div>
                  }
                  dataSource={data2}
                  columns={columns2}
                />
              </>
            ),
          },
          {
            key: "2",
            label: "Mark Attendance",
            children: (
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                style={{ width: 600 }}
                onFinish={onFinish3}
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
                  <Select
                    showSearch
                    onSelect={value => getStudents(value)}
                    options={courses}
                  />
                </Form.Item>

                <Form.Item
                  label="Student"
                  name="student"
                  rules={[
                    {
                      required: true,
                      message: "Please select a student!",
                    },
                  ]}
                >
                  <Select showSearch options={students} />
                </Form.Item>

                <Form.Item
                  label="Att. Status"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Please select a status",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    options={[
                      { label: "Present", value: "PRESENT" },
                      { label: "Absent", value: "ABSENT" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Att. Date"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Please select a date",
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
                    Mark Attendance
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: "3",
            label: "View Attendance",
            children: (
              <>
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
                    label="Pick Course"
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
                  dataSource={data1}
                  columns={columns1}
                />
              </>
            ),
          },
          {
            key: "4",
            label: "Add Students",
            children: (
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                style={{ width: 600 }}
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
                    Add Student
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: "5",
            label: "Leave Applications",
            children: (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Select
                    onChange={value => getApplicantions(value)}
                    placeholder="Select Course"
                    style={{ width: 200 }}
                    showSearch
                    options={courses}
                  />
                </div>

                <Table
                  caption={
                    <div style={{ textAlign: "left", fontWeight: 700 }}>
                      Leave Applications
                    </div>
                  }
                  dataSource={data3}
                  columns={columns3}
                />
              </>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default Teacher;
