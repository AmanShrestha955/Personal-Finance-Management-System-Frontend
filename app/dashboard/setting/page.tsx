import { NextPage } from "next";

// interface Props {}

const Page: NextPage = ({}) => {
  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-xl ">
      <div className="flex flex-row justify-between items-end">
        <h1 className="font-sansation text-heading font-semibold">Profile</h1>
      </div>
    </div>
  );
};

export default Page;
