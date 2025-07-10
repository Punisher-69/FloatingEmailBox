import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "./Components/Main";
import About from "./Components/About";
import Contact from "./Components/Contact";
import RootLayout from "./Components/RootLayout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Main /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
