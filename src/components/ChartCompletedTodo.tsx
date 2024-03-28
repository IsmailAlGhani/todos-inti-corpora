import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Todos } from "@/api/query";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = (dataTodo: Todos[]) => {
  const finishTodo = dataTodo.reduce(
    (prev, current) => prev + (current.isComplete ? 1 : 0),
    0
  );
  const unfinishTodo = dataTodo.length - finishTodo;
  return {
    labels: ["Finish", "Unfinish"],
    datasets: [
      {
        label: "Status todo item",
        data: [finishTodo, unfinishTodo],
        backgroundColor: ["rgba(255, 206, 86, 0.8)", "rgba(75, 192, 192, 0.8)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
};

function ChartCompletedTodo({
  dataTodo,
}: {
  dataTodo: Todos[];
}): React.JSX.Element {
  return <Doughnut className="!text-white" data={data(dataTodo)} />;
}

export default ChartCompletedTodo;
