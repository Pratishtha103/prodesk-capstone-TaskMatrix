import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action) {
      state.items = action.payload;
    },
    addTask(state, action) {
      state.items.unshift(action.payload);
    },
    setTasksLoading(state, action) {
      state.loading = action.payload;
    },
    setTasksError(state, action) {
      state.error = action.payload;
    },
    clearTasks(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    editTask(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTaskFromState(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const {
  setTasks,
  addTask,
  setTasksLoading,
  setTasksError,
  clearTasks,
  editTask,
  deleteTaskFromState,
} = taskSlice.actions;

export default taskSlice.reducer;