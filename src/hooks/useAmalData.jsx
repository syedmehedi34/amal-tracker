import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic"; // Adjust path as needed
import { useAuth } from "../context/AuthProvider"; // Adjust path as needed

const useAmalData = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const {
    data: amalData = [],
    isLoading,
    error,
    refetch: amalDataRefetch,
  } = useQuery({
    queryKey: ["amalData", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error("User email is required");
      }

      const response = await axiosPublic.get("/amal_data", {
        params: { userEmail: user.email },
      });

      return response.data;
    },
    enabled: !!user?.email, // Only run query if user.email exists
    retry: 1, // Retry once on failure
  });

  return { amalData, isLoading, error, amalDataRefetch };
};

export default useAmalData;
