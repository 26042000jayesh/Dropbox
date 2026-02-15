import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDownloadUrl } from "../store/fileSlice";
import { Box, Typography, Button, CircularProgress, Paper, AppBar, Toolbar, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

function FileViewerPage() {
  const { file_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [url, setUrl] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [textContent, setTextContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFile() {
      try {
        const result = await dispatch(getDownloadUrl(Number(file_id)));
        if (result.meta.requestStatus === "fulfilled") {
          const downloadUrl = result.payload.download_url;
          setUrl(downloadUrl);

          const res = await fetch(downloadUrl);
          const type = res.headers.get("content-type") || "";
          setContentType(type);

          if (type.includes("text") || type.includes("json")) {
            const text = await res.text();
            setTextContent(text);
          }
        } else {
          setError("Failed to load file");
        }
      } catch {
        setError("Failed to load file");
      }
      setLoading(false);
    }
    loadFile();
  }, [file_id, dispatch]);

  const renderContent = () => {
    if (!contentType || !url) return null;

    if (contentType.includes("image")) {
      return <img src={url} alt="file" style={{ maxWidth: "100%", maxHeight: "80vh" }} />;
    }

    if (contentType.includes("text") || contentType.includes("json")) {
      return (
        <Paper sx={{ p: 2, maxHeight: "70vh", overflow: "auto", bgcolor: "#f5f5f5" }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{textContent}</pre>
        </Paper>
      );
    }

    if (contentType.includes("pdf")) {
      return <iframe src={url} title="PDF Viewer" width="100%" height="600px" />;
    }

    return <Typography>Cannot preview this file type</Typography>;
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate("/")} edge="start" sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>File Viewer</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
        {loading && <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && renderContent()}
      </Box>
    </Box>
  );
}

export default FileViewerPage;
