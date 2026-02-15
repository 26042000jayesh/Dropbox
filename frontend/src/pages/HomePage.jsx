import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFiles, uploadFile, deleteFile, renameFile, getDownloadUrl } from "../store/fileSlice";
import { logout } from "../store/authSlice";
import {
    Box, Typography, Button, IconButton, List, ListItem, ListItemText,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Alert, CircularProgress, AppBar, Toolbar,
} from "@mui/material";
import { Delete, Edit, Download, CloudUpload, Logout, Visibility } from "@mui/icons-material";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf", "text/plain", "application/json"];

function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { files, loading, error } = useSelector((state) => state.files);

    const fileInputRef = useRef(null);

    const [renameOpen, setRenameOpen] = useState(false);
    const [renameFileId, setRenameFileId] = useState(null);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        dispatch(fetchFiles());
    }, [dispatch]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert("File type not supported. Allowed: PNG, JPEG, PDF, TXT, JSON");
            return;
        }

        await dispatch(uploadFile(file));
        dispatch(fetchFiles());
        e.target.value = "";
    };

    const handleDownload = async (file_id, filename) => {
        const result = await dispatch(getDownloadUrl(file_id));
        if (result.meta.requestStatus !== "fulfilled") return;
        try {
            const res = await fetch(result.payload.download_url);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || "download";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch {
            window.open(result.payload.download_url, "_blank");
        }
    };

    const handleDelete = async (file_id) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            await dispatch(deleteFile(file_id));
        }
    };

    const openRename = (file_id, currentName) => {
        setRenameFileId(file_id);
        setNewName(currentName);
        setRenameOpen(true);
    };

    const handleRename = async () => {
        await dispatch(renameFile({ file_id: renameFileId, new_name: newName }));
        setRenameOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <Box>
            {/* Top navigation bar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>My Dropbox</Typography>
                    <IconButton color="inherit" onClick={handleLogout}><Logout /></IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
                {/* Upload button - clicking it opens the hidden file input */}
                <Button variant="contained" startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current.click()} disabled={loading}>
                    Upload File
                </Button>
                {/* Hidden file input */}
                <input type="file" ref={fileInputRef} hidden onChange={handleUpload}
                    accept=".png,.jpg,.jpeg,.pdf,.txt,.json" />

                {/* Error message */}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                {/* Loading spinner */}
                {loading && <CircularProgress sx={{ display: "block", mx: "auto", mt: 3 }} />}

                {/* File list */}
                {!loading && files.length === 0 && (
                    <Typography sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
                        No files uploaded yet
                    </Typography>
                )}

                <List>
                    {files.map((file) => (
                        <ListItem key={file.id} divider
                            secondaryAction={
                                <Box>
                                    {/* View file contents */}
                                    <IconButton onClick={() => navigate(`/view/${file.id}`)}><Visibility /></IconButton>
                                    {/* Download file */}
                                    <IconButton onClick={() => handleDownload(file.id, file.original_name)}><Download /></IconButton>
                                    {/* Rename file */}
                                    <IconButton onClick={() => openRename(file.id, file.original_name)}><Edit /></IconButton>
                                    {/* Delete file */}
                                    <IconButton onClick={() => handleDelete(file.id)} color="error"><Delete /></IconButton>
                                </Box>
                            }>
                            <ListItemText
                                primary={file.original_name}
                                secondary={`${file.content_type} • ${(file.size / 1024).toFixed(1)} KB`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Rename dialog */}
            <Dialog open={renameOpen} onClose={() => setRenameOpen(false)}>
                <DialogTitle>Rename File</DialogTitle>
                <DialogContent>
                    <TextField autoFocus fullWidth value={newName} onChange={(e) => setNewName(e.target.value)}
                        sx={{ mt: 1 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
                    <Button onClick={handleRename} variant="contained">Rename</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default HomePage;
