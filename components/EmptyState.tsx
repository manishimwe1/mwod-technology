import React from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "./ui/button";
import { PackageCheck } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col py-20">
        <Empty className="border bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md w-full h-fit  md:w-[400px]  mx-auto">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageCheck />
        </EmptyMedia>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>No data found</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Add data</Button>
      </EmptyContent>
    </Empty>
    </div>
  );
};

export default EmptyState;
