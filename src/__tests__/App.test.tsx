import {
  RenderOptions,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import React, { ComponentType } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const AllTheProviders = ({ children }: { children: JSX.Element }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) => render(ui, { wrapper: AllTheProviders as ComponentType, ...options });

export * from "@testing-library/react";
export { customRender as render };

vi.mock("@tanstack/react-query", () => ({
  ...vi.importActual("@tanstack/react-query"),
  useQuery: vi.fn().mockImplementation(({ ...rest }) => {
    if (rest["0"] === "todos_list") {
      return {
        code: 200,
        data: [
          {
            _id: "66055a43aadfae71c5a51b2e",
            todoName: "asdfasdf as",
            isComplete: false,
            createdAt: "2024-03-28T11:52:34.874Z",
            updatedAt: "2024-03-29T05:08:39.733Z",
            __v: 0,
          },
          {
            _id: "6605c2aca5a2d9078b9e736b",
            todoName: "Learn Redux",
            isComplete: true,
            createdAt: "2024-03-28T19:10:36.241Z",
            updatedAt: "2024-03-28T22:53:34.446Z",
            __v: 0,
          },
          {
            _id: "6605c43aa5a2d9078b9e7377",
            todoName: "Learn Tailwind",
            isComplete: true,
            createdAt: "2024-03-28T19:10:36.241Z",
            updatedAt: "2024-03-28T22:53:41.378Z",
            __v: 0,
          },
          {
            _id: "6605fd7c49f8dadc4df4e908",
            todoName: "Learn Flutter",
            isComplete: false,
            createdAt: "2024-03-28T23:26:49.223Z",
            updatedAt: "2024-03-28T23:26:49.223Z",
            __v: 0,
          },
          {
            _id: "660658146195f92e3066ba3a",
            todoName: "test 1",
            isComplete: false,
            createdAt: "2024-03-29T05:43:52.200Z",
            updatedAt: "2024-03-29T05:43:52.200Z",
            __v: 0,
          },
          {
            _id: "66065820439c0b12fdbf8611",
            todoName: "test 2",
            isComplete: false,
            createdAt: "2024-03-29T05:56:45.961Z",
            updatedAt: "2024-03-29T05:56:45.961Z",
            __v: 0,
          },
        ],
      };
    }

    return {
      data: null,
      isLoading: true,
      isError: false,
    };
  }),
  useMutation: vi.fn().mockImplementation((mutationFn) => {
    return [
      // Mock mutate function
      async () => {
        // Mock mutation response
        const response =
          await mutationFn(/* Provide any necessary parameters */);
        // Add any additional logic as needed
        return response;
      },
      {
        // Mock mutation status and data
        data: {
          // Mock your mutation data
          key: "newValue",
        },
        isLoading: false,
        isError: false,
      },
    ];
  }),
}));

afterEach(() => {
  cleanup();
});

describe("List Todos component", () => {
  it("renders with mocked data", async () => {
    render(<App />);

    // Your test assertions go here
    waitFor(() => {
      expect(screen.getByText("Learn Flutter")).toBeInTheDocument();
      expect(screen.getByText("test 2")).not.toBeInTheDocument();
    });
  });

  it("renders with click next button", async () => {
    render(<App />);

    waitFor(() => {
      expect(screen.getByText("Learn Flutter")).toBeInTheDocument();
      expect(screen.getByText("test 2")).not.toBeInTheDocument();
      expect(screen.findByText("Next")).toBeInTheDocument();
      const buttonElement = screen.getByText("Next");
      fireEvent.click(buttonElement);
    });

    // Your test assertions go here
    waitFor(() => {
      expect(screen.getByText("Learn Flutter")).not.toBeInTheDocument();
      expect(screen.getByText("test 2")).toBeInTheDocument();
    });
  });

  it("cancel modal delete todo", async () => {
    render(<App />);
    waitFor(() => {
      expect(
        screen.findByTestId("actions-6605c2aca5a2d9078b9e736b")
      ).toBeInTheDocument();
      const elementMenu = screen.getByTestId(
        "actions-6605c2aca5a2d9078b9e736b"
      );
      fireEvent.click(elementMenu);
    });

    waitFor(() => {
      expect(
        screen.findByTestId("action-delete-6605c2aca5a2d9078b9e736b")
      ).toBeInTheDocument();
      const elementDelete = screen.getByTestId(
        "action-delete-6605c2aca5a2d9078b9e736b"
      );
      fireEvent.click(elementDelete);
    });

    waitFor(() => {
      expect(screen.findByText("Delete Todo")).toBeInTheDocument();
      expect(screen.findByText("Cancel")).toBeInTheDocument();
      const buttonCancelConfirm = screen.getByText("Cancel");
      fireEvent.click(buttonCancelConfirm);
    });

    waitFor(() => expect(screen.findByText("Learn Redux")).toBeInTheDocument());
  });

  it("delete data list farmer", async () => {
    render(<App />);
    waitFor(() => {
      expect(
        screen.findByTestId("actions-6605c2aca5a2d9078b9e736b")
      ).toBeInTheDocument();
      const elementMenu = screen.getByTestId(
        "actions-6605c2aca5a2d9078b9e736b"
      );
      fireEvent.click(elementMenu);
    });

    waitFor(() => {
      expect(
        screen.findByTestId("action-delete-6605c2aca5a2d9078b9e736b")
      ).toBeInTheDocument();
      const elementDelete = screen.getByTestId(
        "action-delete-6605c2aca5a2d9078b9e736b"
      );
      fireEvent.click(elementDelete);
    });

    waitFor(() => {
      expect(screen.findByText("Delete Todo")).toBeInTheDocument();
      expect(screen.findByText("Delete")).toBeInTheDocument();
      const buttonDeleteConfirm = screen.getByText("Delete");
      fireEvent.click(buttonDeleteConfirm);
    });

    vi.mock("@tanstack/react-query", () => ({
      ...vi.importActual("@tanstack/react-query"),
      useQuery: vi.fn().mockImplementation(({ ...rest }) => {
        if (rest["0"] === "todos_list") {
          return {
            code: 200,
            data: [
              {
                _id: "66055a43aadfae71c5a51b2e",
                todoName: "asdfasdf as",
                isComplete: false,
                createdAt: "2024-03-28T11:52:34.874Z",
                updatedAt: "2024-03-29T05:08:39.733Z",
                __v: 0,
              },
              {
                _id: "6605c43aa5a2d9078b9e7377",
                todoName: "Learn Tailwind",
                isComplete: true,
                createdAt: "2024-03-28T19:10:36.241Z",
                updatedAt: "2024-03-28T22:53:41.378Z",
                __v: 0,
              },
              {
                _id: "6605fd7c49f8dadc4df4e908",
                todoName: "Learn Flutter",
                isComplete: false,
                createdAt: "2024-03-28T23:26:49.223Z",
                updatedAt: "2024-03-28T23:26:49.223Z",
                __v: 0,
              },
              {
                _id: "660658146195f92e3066ba3a",
                todoName: "test 1",
                isComplete: false,
                createdAt: "2024-03-29T05:43:52.200Z",
                updatedAt: "2024-03-29T05:43:52.200Z",
                __v: 0,
              },
              {
                _id: "66065820439c0b12fdbf8611",
                todoName: "test 2",
                isComplete: false,
                createdAt: "2024-03-29T05:56:45.961Z",
                updatedAt: "2024-03-29T05:56:45.961Z",
                __v: 0,
              },
            ],
          };
        }

        return {
          data: null,
          isLoading: true,
          isError: false,
        };
      }),
      useMutation: vi.fn().mockImplementation((mutationFn) => {
        return [
          // Mock mutate function
          async () => {
            // Mock mutation response
            const response =
              await mutationFn(/* Provide any necessary parameters */);
            // Add any additional logic as needed
            return response;
          },
          {
            // Mock mutation status and data
            data: {
              // Mock your mutation data
              key: "newValue",
            },
            isLoading: false,
            isError: false,
          },
        ];
      }),
    }));

    waitFor(() =>
      expect(screen.findByText("Learn Redux")).not.toBeInTheDocument()
    );
  });

  it("add new todo", async () => {
    render(<App />);

    waitFor(() => {
      expect(screen.findByText("Create")).toBeInTheDocument();
      const elementAdd = screen.getByText("Create");
      fireEvent.click(elementAdd);
    });

    waitFor(() => {
      expect(screen.findByText("Create Todo")).toBeInTheDocument();
      const nameInput = screen.getByTestId("todoName-form");
      fireEvent.change(nameInput, { target: { value: "Learn Mobile Dev" } });
      const buttonSubmit = screen.getByTestId("submit-form");
      fireEvent.click(buttonSubmit);
    });

    vi.mock("@tanstack/react-query", () => ({
      ...vi.importActual("@tanstack/react-query"),
      useQuery: vi.fn().mockImplementation(({ ...rest }) => {
        if (rest["0"] === "todos_list") {
          return {
            code: 200,
            data: [
              {
                _id: "66055a43aadfae71c5a51b2e",
                todoName: "asdfasdf as",
                isComplete: false,
                createdAt: "2024-03-28T11:52:34.874Z",
                updatedAt: "2024-03-29T05:08:39.733Z",
                __v: 0,
              },
              {
                _id: "6605c2aca5a2d9078b9e736b",
                todoName: "Learn Redux",
                isComplete: true,
                createdAt: "2024-03-28T19:10:36.241Z",
                updatedAt: "2024-03-28T22:53:34.446Z",
                __v: 0,
              },
              {
                _id: "6605c43aa5a2d9078b9e7377",
                todoName: "Learn Tailwind",
                isComplete: true,
                createdAt: "2024-03-28T19:10:36.241Z",
                updatedAt: "2024-03-28T22:53:41.378Z",
                __v: 0,
              },
              {
                _id: "6605fd7c49f8dadc4df4e908",
                todoName: "Learn Flutter",
                isComplete: false,
                createdAt: "2024-03-28T23:26:49.223Z",
                updatedAt: "2024-03-28T23:26:49.223Z",
                __v: 0,
              },
              {
                _id: "660658146195f92e3066ba3a",
                todoName: "test 1",
                isComplete: false,
                createdAt: "2024-03-29T05:43:52.200Z",
                updatedAt: "2024-03-29T05:43:52.200Z",
                __v: 0,
              },
              {
                _id: "66065820439c0b12fdbf8611",
                todoName: "test 2",
                isComplete: false,
                createdAt: "2024-03-29T05:56:45.961Z",
                updatedAt: "2024-03-29T05:56:45.961Z",
                __v: 0,
              },
              {
                _id: "66065820439c0b12fdbf8613",
                todoName: "Learn Mobile Dev",
                isComplete: false,
                createdAt: "2024-03-29T05:56:45.961Z",
                updatedAt: "2024-03-29T05:56:45.961Z",
                __v: 0,
              },
            ],
          };
        }

        return {
          data: null,
          isLoading: true,
          isError: false,
        };
      }),
      useMutation: vi.fn().mockImplementation((mutationFn) => {
        return [
          // Mock mutate function
          async () => {
            // Mock mutation response
            const response =
              await mutationFn(/* Provide any necessary parameters */);
            // Add any additional logic as needed
            return response;
          },
          {
            // Mock mutation status and data
            data: {
              // Mock your mutation data
              key: "newValue",
            },
            isLoading: false,
            isError: false,
          },
        ];
      }),
    }));

    waitFor(() => {
      expect(screen.getByText("Learn Flutter")).toBeInTheDocument();
      expect(screen.getByText("Learn Mobile Dev")).not.toBeInTheDocument();
      expect(screen.findByText("Next")).toBeInTheDocument();
      const buttonElement = screen.getByText("Next");
      fireEvent.click(buttonElement);
    });

    // Your test assertions go here
    waitFor(() => {
      expect(screen.getByText("Learn Flutter")).not.toBeInTheDocument();
      expect(screen.getByText("Learn Mobile Dev")).toBeInTheDocument();
    });
  });

  it("cancel modal update todo", async () => {
    render(<App />);
    waitFor(() => {
      expect(
        screen.findByTestId("actions-6605fd7c49f8dadc4df4e908")
      ).toBeInTheDocument();
      const elementMenu = screen.getByTestId(
        "actions-6605fd7c49f8dadc4df4e908"
      );
      fireEvent.click(elementMenu);
    });

    waitFor(() => {
      expect(
        screen.findByTestId("action-update-6605fd7c49f8dadc4df4e908")
      ).toBeInTheDocument();
      const elementUpdate = screen.getByTestId(
        "action-update-6605fd7c49f8dadc4df4e908"
      );
      fireEvent.click(elementUpdate);
    });

    waitFor(() => {
      expect(screen.findByText("Update Todo Status")).toBeInTheDocument();
      expect(screen.findByText("Cancel")).toBeInTheDocument();
      const buttonCancelConfirm = screen.getByText("Cancel");
      fireEvent.click(buttonCancelConfirm);
    });

    waitFor(() =>
      expect(screen.findByText("Learn Flutter")).toBeInTheDocument()
    );
  });

  it("update data list farmer", async () => {
    render(<App />);
    waitFor(() => {
      expect(
        screen.findByTestId("actions-6605fd7c49f8dadc4df4e908")
      ).toBeInTheDocument();
      const elementMenu = screen.getByTestId(
        "actions-6605fd7c49f8dadc4df4e908"
      );
      fireEvent.click(elementMenu);
    });

    waitFor(() => {
      expect(
        screen.findByTestId("action-update-6605fd7c49f8dadc4df4e908")
      ).toBeInTheDocument();
      const elementUpdate = screen.getByTestId(
        "action-update-6605fd7c49f8dadc4df4e908"
      );
      fireEvent.click(elementUpdate);
    });

    waitFor(() => {
      expect(screen.findByText("Update Todo Status")).toBeInTheDocument();
      expect(screen.findByText("Update")).toBeInTheDocument();
      const buttonUpdateConfirm = screen.getByText("Update");
      fireEvent.click(buttonUpdateConfirm);
    });

    vi.mock("@tanstack/react-query", () => ({
      ...vi.importActual("@tanstack/react-query"),
      useQuery: vi.fn().mockImplementation(({ ...rest }) => {
        if (rest["0"] === "todos_list") {
          return {
            code: 200,
            data: [
              {
                _id: "66055a43aadfae71c5a51b2e",
                todoName: "asdfasdf as",
                isComplete: false,
                createdAt: "2024-03-28T11:52:34.874Z",
                updatedAt: "2024-03-29T05:08:39.733Z",
                __v: 0,
              },
              {
                _id: "6605c2aca5a2d9078b9e736b",
                todoName: "Learn Redux",
                isComplete: true,
                createdAt: "2024-03-28T19:10:36.241Z",
                updatedAt: "2024-03-28T22:53:34.446Z",
                __v: 0,
              },
              {
                _id: "6605c43aa5a2d9078b9e7377",
                todoName: "Learn Tailwind",
                isComplete: true,
                createdAt: "2024-03-28T19:10:36.241Z",
                updatedAt: "2024-03-28T22:53:41.378Z",
                __v: 0,
              },
              {
                _id: "6605fd7c49f8dadc4df4e908",
                todoName: "Learn Flutter",
                isComplete: true,
                createdAt: "2024-03-28T23:26:49.223Z",
                updatedAt: "2024-03-28T23:26:49.223Z",
                __v: 0,
              },
              {
                _id: "660658146195f92e3066ba3a",
                todoName: "test 1",
                isComplete: false,
                createdAt: "2024-03-29T05:43:52.200Z",
                updatedAt: "2024-03-29T05:43:52.200Z",
                __v: 0,
              },
              {
                _id: "66065820439c0b12fdbf8611",
                todoName: "test 2",
                isComplete: false,
                createdAt: "2024-03-29T05:56:45.961Z",
                updatedAt: "2024-03-29T05:56:45.961Z",
                __v: 0,
              },
            ],
          };
        }

        return {
          data: null,
          isLoading: true,
          isError: false,
        };
      }),
      useMutation: vi.fn().mockImplementation((mutationFn) => {
        return [
          // Mock mutate function
          async () => {
            // Mock mutation response
            const response =
              await mutationFn(/* Provide any necessary parameters */);
            // Add any additional logic as needed
            return response;
          },
          {
            // Mock mutation status and data
            data: {
              // Mock your mutation data
              key: "newValue",
            },
            isLoading: false,
            isError: false,
          },
        ];
      }),
    }));

    waitFor(() => {
      expect(screen.findByText("Success Update Todo")).toBeInTheDocument();
      expect(
        screen.findByText("Successfull update todo, completed todo item.")
      ).toBeInTheDocument();
    });
  });

  it("filtered data using input component", async () => {
    render(<App />);

    waitFor(() => {
      expect(screen.getByText("asdfasdf as")).toBeInTheDocument();
      expect(screen.getByText("test 1")).toBeInTheDocument();
      const nameInput = screen.getByTestId("filter-input");
      fireEvent.change(nameInput, { target: { value: "learn" } });
    });

    // Your test assertions go here
    waitFor(() => {
      expect(screen.getByText("asdfasdf as")).not.toBeInTheDocument();
      expect(screen.getByText("test 1")).not.toBeInTheDocument();
      expect(screen.getByText("Learn Flutter")).toBeInTheDocument();
      expect(screen.getByText("Learn Redux")).toBeInTheDocument();
      expect(screen.getByText("Learn Tailwind")).toBeInTheDocument();
      expect(screen.getByText("1 of 1 page(s) showing.")).toBeInTheDocument();
    });
  });
});
