import axios from "axios";
import {
  Button,
  Card,
  DatePicker,
  Divider,
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

const Admin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

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

  const [columns1, setColumns1] = useState([
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Teacher Name",
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

  const [type, setType] = useState("student");
  const [type2, setType2] = useState("student");

  const [id, setId] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("type") !== "admin") {
      message.error("You are not an admin!");
      navigate("/");
    } else {
      getAllCourses();
      getAllTeachers();
    }
  }, []);

  const getAllCourses = () => {
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
        message.error("No courses found");
        console.log(err);
      });
  };

  const getAllTeachers = () => {
    axios({
      method: "get",
      url: `${base}/getAllTeachers`,
    })
      .then(res => {
        const teachers = res.data.map(teacher => ({
          label:
            teacher.First_Name +
            " " +
            teacher.Middle_Name +
            " " +
            teacher.Last_Name +
            " (" +
            teacher.Name +
            ")",
          value: teacher.Employee_ID + "?" + teacher.Course_ID,
        }));

        setTeachers(teachers);
      })
      .catch(err => {
        message.error("No teachers found");
        console.log(err);
      });
  };

  const onFinish1 = values => {
    if (values.type === "student") {
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
                err?.response?.data?.error?.sqlMessage ||
                  "Something went wrong!"
              )
            )
        )
        .catch(err =>
          message.error(
            err?.response?.data?.error?.sqlMessage || "Something went wrong!"
          )
        );
    } else {
      const URL = `${base}/add${
        values.type.charAt(0).toUpperCase() + values.type.slice(1)
      }`;

      axios({
        method: "post",
        url: URL,
        data: values,
      })
        .then(res => message.success("User added successfully!"))
        .catch(err =>
          message.error(
            err?.response?.data?.error?.sqlMessage || "Something went wrong!"
          )
        );
    }
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
        setData(
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
    const { employee, status, date } = values;

    axios({
      method: "post",
      url: `${base}/markTeacherAttendance1`,
      data: {
        eid: employee.split("?")[0],
        cid: employee.split("?")[1],
        status: status,
        date: convert(date),
      },
    })
      .then(res =>
        axios({
          method: "post",
          url: `${base}/markTeacherAttendance2`,
          data: {
            eid: employee.split("?")[0],
            cid: employee.split("?")[1],
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

  const onFinish4 = values => {
    const { type, id } = values;

    axios({
      method: "get",
      url: `${base}/get${
        type.charAt(0).toUpperCase() + type.slice(1)
      }Profile/?id=${id}`,
    })
      .then(res => {
        message.success("User data filled!");

        if (type === "student") {
          setUserInfo({
            Firstname: res.data[1].First_Name,
            Lastname: res.data[1].Last_Name,
            Middlename: res.data[1].Middle_Name,
            House: res.data[1].House,
            City: res.data[1].City,
            State: res.data[0].State,
            Email: res.data[1].Email,
            Password: res.data[1].Password,
            Phone: res.data[1].Phone_No,
            ID: res.data[1].Student_ID,
          });

          setId(res.data[1].Student_ID);
        } else {
          setUserInfo({
            Firstname: res.data.First_Name,
            Lastname: res.data.Last_Name,
            Middlename: res.data.Middle_Name,
            Email: res.data.Email,
            Password: res.data.Password,
            Phone: res.data.Phone_No,
            ID: res.data.Employee_ID,
          });

          setId(res.data.Employee_ID);
        }
      })
      .catch(err => {
        message.error("No user found");
        console.log(err);
      });
  };

  const onFinish5 = values => {
    if (values.id === id) {
      if (type2 === "student")
        axios({
          method: "post",
          url: `${base}/updateStudentProfile1`,
          data: values,
        })
          .then(res => {
            axios({
              method: "post",
              url: `${base}/updateStudentProfile2`,
              data: values,
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
              err?.response?.data?.error.sqlMessage ||
                "Could not update profile"
            )
          );
      else
        axios({
          method: "post",
          url: `${base}/updateTeacherProfile`,
          data: values,
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
    } else message.error("Wrong ID entered");
  };

  const onFinish6 = values => {
    const { course, date } = values;

    axios({
      method: "post",
      url: `${base}/getTeacherAttendance`,
      data: {
        course: course,
        date: convert(date),
      },
    })
      .then(res => {
        setData1(
          res.data.map(teacher => ({
            key: teacher.Employee_ID,
            id: teacher.Employee_ID,
            name:
              (teacher.First_Name ?? "") +
              " " +
              (teacher.Middle_Name ?? "") +
              " " +
              (teacher.Last_Name ?? ""),
            attendance: teacher.Status,
          }))
        );
      })
      .catch(err => {
        message.error("No attendance record found");
        console.log(err);
      });
  };

  const onFinish7 = values => {};

  const onFinishFailed = errorInfo => message.error("Form not filled");

  return (
    <Card
      bordered={false}
      title={
        <div style={{ color: "red", fontWeight: 700, fontSize: 18 }}>
          Admin Portal
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
                  label="Employee"
                  name="employee"
                  rules={[
                    {
                      required: true,
                      message: "Please select an employee",
                    },
                  ]}
                >
                  <Select showSearch options={teachers} />
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
            label: "Student Attendance",
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
                      Attendance Report For Students
                    </div>
                  }
                  dataSource={data}
                  columns={columns}
                />
              </>
            ),
          },
          {
            key: "4",
            label: "Teacher Attendance",
            children: (
              <>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 10 }}
                  style={{ width: 600 }}
                  onFinish={onFinish6}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
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
                      Attendance Report For Teachers
                    </div>
                  }
                  dataSource={data1}
                  columns={columns1}
                />
              </>
            ),
          },
          {
            key: "5",
            label: "Add Users",
            children: (
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                style={{ width: 600 }}
                initialValues={{ type: type }}
                onFinish={onFinish1}
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
                    showSearch
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
                      label="Email ID"
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
                      label="Email ID"
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
                          message: "Please input employee phone number!",
                        },
                        {
                          pattern: /^[0-9]{10}$/,
                          message: "Phone number must have 10 digits only",
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
            key: "6",
            label: "Update Users",
            children: (
              <>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 10 }}
                  style={{ width: 600 }}
                  initialValues={{ type: type2 }}
                  onFinish={onFinish4}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Pick User Type"
                    name="type"
                    rules={[
                      {
                        required: true,
                        message: "Please select a user type!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      onChange={value => setType2(value)}
                      options={[
                        { label: "Student", value: "student" },
                        { label: "Teacher", value: "teacher" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Enter User ID"
                    name="id"
                    rules={[
                      {
                        required: true,
                        message: "Please input user id!",
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
                      Search {type2.charAt(0).toUpperCase() + type2.slice(1)}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: 600,
                  }}
                >
                  {Object.keys(userInfo)
                    .map(key => key + ": " + userInfo[key])
                    .join(", ") || "SUBMIT THIS FORM TO CONTINUE"}
                </div>

                <Divider />

                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 10 }}
                  style={{ width: 600 }}
                  onFinish={onFinish5}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  {type2 === "teacher" ? (
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
                        label="Email ID"
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
                            pattern: /^.{6,30}$/,
                            message:
                              "Password must lie between 6-30 characters",
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
                            pattern: /^[0-9]{10}$/,
                            message: "Phone number must have 10 digits only",
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
                            message:
                              "Password must lie between 6-30 characters",
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
                      Update {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default Admin;
