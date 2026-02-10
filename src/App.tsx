/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import "./App.scss";
import { LiveAPIProvider, useLiveAPIContext } from "./contexts/LiveAPIContext";
import { useLoggerStore } from "./lib/store-logger";
import SidePanel from "./components/side-panel/SidePanel";
import { Altair } from "./components/altair/Altair";
import ControlTray from "./components/control-tray/ControlTray";
import cn from "classnames";
import { LiveClientOptions } from "./types";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const apiOptions: LiveClientOptions = {
  apiKey: API_KEY,
  apiVersion: "v1beta",
};


function AppContent({
  videoRef,
  videoStream,
  setVideoStream
}: {
  videoRef: React.RefObject<HTMLVideoElement>,
  videoStream: MediaStream | null,
  setVideoStream: (s: MediaStream | null) => void
}) {
  const { connect, connected, disconnect } = useLiveAPIContext();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { clearLogs } = useLoggerStore();

  useEffect(() => {
    if (hasInteracted && !connected && !isFinished) {
      connect();
    }
  }, [connect, connected, hasInteracted, isFinished]);

  const handleStop = useCallback(() => {
    setHasInteracted(false);
    setIsFinished(false);
    clearLogs();
  }, [clearLogs]);

  const handleConclude = useCallback(() => {
    setIsFinished(true);
    disconnect();
  }, [disconnect]);

  return (
    <div className="streaming-console">
      {!hasInteracted && !isFinished && (
        <div className="welcome-screen">
          <div className="welcome-content">
            <div className="logo-container">
              <span className="material-symbols-outlined logo-icon">psychology</span>
              <h1>AgentMAX</h1>
            </div>
            <p className="subtitle">Your AI-Powered HR Interviewer</p>
            <div className="info-box">
              <p>Ready to begin your 10-question evaluation?</p>
              <p className="note">Please ensure your microphone and camera are ready.</p>
            </div>
            <button className="start-button" onClick={() => setHasInteracted(true)}>
              <span>Start Interview</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {isFinished && (
        <div className="welcome-screen finished">
          <div className="welcome-content">
            <div className="logo-container">
              <span className="material-symbols-outlined logo-icon success">verified</span>
              <h1>Great Job!</h1>
            </div>
            <p className="subtitle">Interview Successfully Completed</p>
            <div className="info-box success">
              <p>Your responses have been recorded.</p>
              <p className="note">AgentMAX has successfully finalized the evaluation process. You may now close this window or return to the main menu.</p>
            </div>
            <button className="start-button secondary" onClick={handleStop}>
              <span>Return to Menu</span>
              <span className="material-symbols-outlined">home</span>
            </button>
          </div>
        </div>
      )}

      <SidePanel />
      <main>
        <div className="main-app-area">
          {/* APP goes here */}
          <Altair onConclude={handleConclude} />
          <video
            className={cn("stream", {
              hidden: !videoRef.current || !videoStream,
            })}
            ref={videoRef}
            autoPlay
            playsInline
          />
        </div>

        <ControlTray
          videoRef={videoRef}
          supportsVideo={true}
          onVideoStreamChange={setVideoStream}
          enableEditingSettings={true}
          onStop={handleStop}
        >
          {/* put your own buttons here */}
        </ControlTray>
      </main>
    </div>
  );
}

function App() {
  // this video reference is used for displaying the active stream, whether that is the webcam or screen capture
  // feel free to style as you see fit
  const videoRef = useRef<HTMLVideoElement>(null);
  // either the screen capture, the video or null, if null we hide it
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  return (
    <div className="App">
      <LiveAPIProvider options={apiOptions}>
        <AppContent
          videoRef={videoRef}
          videoStream={videoStream}
          setVideoStream={setVideoStream}
        />
      </LiveAPIProvider>
    </div>
  );
}

export default App;
