// import { render, screen } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import App from "../App";

// test("renders login page as the default route", () => {
//   render(
//     <MemoryRouter initialEntries={["/"]}>
//       <App />
//     </MemoryRouter>
//   );

//   // Check if the Login heading or button is present
//   const loginHeading = screen.getByRole("heading", {
//     level: 2,
//     name: /login/i,
//   });
//   expect(loginHeading).toBeInTheDocument();

//   // Check if the login button exists
//   const loginButton = screen.getByRole("button", { name: /login/i });
//   expect(loginButton).toBeInTheDocument();
// });

// test("prevents access to protected routes without authentication", () => {
//   render(
//     <MemoryRouter initialEntries={["/dashboard"]}>
//       <App />
//     </MemoryRouter>
//   );

//   // Since the user is not logged in, they should be redirected to login
//   const loginHeading = screen.getByRole("heading", {
//     level: 2,
//     name: /login/i,
//   });
//   expect(loginHeading).toBeInTheDocument();
// });
