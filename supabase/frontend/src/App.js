import logo from "./logo.svg";
import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  "https://jofthzzekjrhlnjcpyvf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZnRoenpla2pyaGxuamNweXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1NTY3MTAsImV4cCI6MTk5NzEzMjcxMH0.kAGRFktVBfq9xlIzwUUi3DrG2U9WSEq0Hm6quLk1Em0"
);

const CDNURL =
  "https://jofthzzekjrhlnjcpyvf.supabase.co/storage/v1/object/public/videos";

// https://opmslesqmfxeqznbemew.supabase.co/storage/v1/object/public/videos/testfile.mp4

function App() {
  const [videos, setVideos] = useState([]);

  async function getVideos() {
    const { data, error } = await supabase.storage.from("videos").list("");

    if (data !== null) {
      setVideos(data);
    } else {
      console.log(error);
      alert("error grabbing files from supabase");
    }
  }

  useEffect(() => {
    getVideos();
  }, []);

  async function uploadFile(e) {
    const videoFile = e.target.files[0];
    console.log("Upload!");
    const { error } = await supabase.storage
      .from("videos")
      .upload(uuidv4() + ".mp4", videoFile);
    if (error) {
      console.log(error);
      alert("Error uploading file to Supabase");
    }

    getVideos();
  }

  // console.log(videos);

  return (
    <Container className="mt-5" style={{ width: "700px" }}>
      <h1>Videofeed</h1>
      <Form.Group className="mb=3 mt=3">
        <Form.Label>Upload your video here!</Form.Label>
        <Form.Control
          type="file"
          accept="video/mp4"
          onChange={(e) => uploadFile(e)}
        ></Form.Control>
      </Form.Group>

      <Row>
        {videos.map((video) => {
          console.log(video);
          return (
            <Col>
              <Card>
                <video height="380px" controls>
                  <source src={CDNURL + video.name} type="video/mp4" />
                </video>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default App;
