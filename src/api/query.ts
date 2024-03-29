import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const API_URL = "https://calm-plum-jaguar-tutu.cyclic.app/todos";
export interface Todos {
  _id: string;
  todoName: string;
  isComplete: boolean;
  createdAt: string;
  updateAt: string;
}

export const useTodosList = () => {
  return useQuery({
    queryKey: ["todos_list"],
    queryFn: async (): Promise<Todos[]> => {
      const { data } = await axios.get(`${API_URL}`, {
        headers: {
          accept: "application/json",
        },
      });
      return data.data;
    },
  });
};
