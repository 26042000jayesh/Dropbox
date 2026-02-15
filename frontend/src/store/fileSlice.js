import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue }) => {
  try {
    const res = await api.post("/dropbox/file/api/v1/list-files", {});
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch files");
  }
});


export const uploadFile = createAsyncThunk("files/uploadFile", async (file, { rejectWithValue }) => {
  try {
    const urlRes = await api.post("/dropbox/file/api/v1/get-upload-url", {
      file_name: file.name,
      content_type: file.type,
      size: file.size,
    });
    const { upload_url, file_id } = urlRes.data.data;

    await fetch(upload_url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    await api.post("/dropbox/file/api/v1/confirm-upload", { file_id });

    return { file_id };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Upload failed");
  }
});

export const deleteFile = createAsyncThunk("files/deleteFile", async (file_id, { rejectWithValue }) => {
  try {
    await api.post("/dropbox/file/api/v1/delete-file", { file_id });
    return file_id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Delete failed");
  }
});

export const renameFile = createAsyncThunk("files/renameFile", async ({ file_id, new_name }, { rejectWithValue }) => {
  try {
    await api.post("/dropbox/file/api/v1/rename-file", { file_id, new_name });
    return { file_id, new_name };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Rename failed");
  }
});

export const getDownloadUrl = createAsyncThunk("files/getDownloadUrl", async (file_id, { rejectWithValue }) => {
  try {
    const res = await api.post("/dropbox/file/api/v1/get-download-url", { file_id });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Download failed");
  }
});

const initialState = {
  files: [],
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearFileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch files
      .addCase(fetchFiles.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFiles.fulfilled, (state, action) => { state.loading = false; state.files = action.payload.files; })
      .addCase(fetchFiles.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Upload - just set loading, we refetch files after
      .addCase(uploadFile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadFile.fulfilled, (state) => { state.loading = false; })
      .addCase(uploadFile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Delete - remove file from local state
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter((f) => f.id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => { state.error = action.payload; })
      // Rename - update file name in local state
      .addCase(renameFile.fulfilled, (state, action) => {
        const file = state.files.find((f) => f.id === action.payload.file_id);
        if (file) file.original_name = action.payload.new_name;
      })
      .addCase(renameFile.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearFileError } = fileSlice.actions;
export default fileSlice.reducer;
