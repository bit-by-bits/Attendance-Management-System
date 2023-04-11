import axios from "axios";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import base from "../baseURL";
import { useNavigate } from "react-router-dom";

const Teacher = () => {
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

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("type") !== "teacher") {
      message.error("You are not a teacher!");
      navigate("/");
    } else {
      axios({
        method: "get",
        url: `${base}/getCourses/?id=${localStorage.getItem("id")}`,
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

  const onFinish = values => {
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
          Teacher Portal
        </div>
      }
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 10 }}
        style={{ width: 600 }}
        onFinish={onFinish}
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
            Weekly Attendance Report
          </div>
        }
        dataSource={data}
        columns={columns}
      />
    </Card>
  );
};

export default Teacher;
