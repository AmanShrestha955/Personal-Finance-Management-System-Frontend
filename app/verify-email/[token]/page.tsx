"use client";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/utils/request";
import { useEffect } from "react";
import React from "react";

interface Props {
  params: Promise<{ token: string }>;
}

const Page = ({ params }: Props) => {
  const { token } = React.use(params);

  const { data, error, isLoading } = useQuery({
    queryKey: ["verifyToken", token],
    queryFn: () =>
      getData<null, { message: string; error?: string }>(
        `/auth/verify-email/${token}`
      ),
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isLoading) return <p>Verifying...</p>;
  if (error) return <p>Verification failed. Please try again later!</p>;

  return <p>{data?.message}</p>;
};

export default Page;
