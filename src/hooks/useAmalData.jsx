import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic"; // Adjust path as needed
import { useAuth } from "../context/AuthProvider"; // Adjust path as needed

const useAmalData = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const {
    data: amalData = [],
    isLoading,
    isFetching, // 👈 এইটা যোগ করো
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
    enabled: !!user?.email,
    retry: 1,
  });

  return { amalData, isLoading, error, amalDataRefetch, isFetching };
};

export default useAmalData;
