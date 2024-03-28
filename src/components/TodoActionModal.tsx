import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { typeModalAction } from "@/lib/utils";

function TodoActionModal({
  openDialog,
  handleAction,
  type,
}: {
  openDialog: boolean;
  handleAction: () => void;
  type: typeModalAction;
}): React.JSX.Element {
  return (
    <Dialog open={openDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === typeModalAction.UPDATE
              ? "Update Todo Status"
              : "Delete Todo"}
          </DialogTitle>
          <DialogDescription>
            {type === typeModalAction.UPDATE
              ? "Are you completed todo item?"
              : "Are you sure to delete todo item?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between w-full">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={"default"}
              className={
                type === typeModalAction.UPDATE ? "bg-blue-400" : "bg-red-400"
              }
              onClick={handleAction}
            >
              {type === typeModalAction.UPDATE ? "Update" : "Delete"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TodoActionModal;
