import { createBrowserRouter } from "react-router-dom";

import EditorView from "../views/EditorView";

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>
  },
  {
    path: '/editor',
    element: <EditorView />
  }
])

export default router