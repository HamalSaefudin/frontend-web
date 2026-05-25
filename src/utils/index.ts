export const formatIDR = (
  value: number,
  options?: {
    withSymbol?: boolean;
    minimumFractionDigits?: number;
  },
): string => {
  const { withSymbol = true, minimumFractionDigits = 0 } = options || {};

  const formatted = new Intl.NumberFormat("id-ID", {
    style: withSymbol ? "currency" : "decimal",
    currency: "IDR",
    minimumFractionDigits,
  }).format(value);

  return withSymbol ? formatted : formatted.replace(/\s?Rp\s?/g, "");
};

interface FetchDataAsyncParams<TResult> {
  asyncFn: () => Promise<TResult>;
  setError: (params: {
    menuName: string;
    errorMessage: string;
    title?: string;
  }) => void;
  menuName: string;
  title?: string;
}

export const fetchDataAsync = async <TResult>({
  asyncFn,
  setError,
  menuName,
  title,
}: FetchDataAsyncParams<TResult>): Promise<TResult> => {
  try {
    return await asyncFn();
  } catch (error: any) {
    // Extract API error message from AxiosError.response.data
    const apiError = error?.response?.data
    const errorMessage =
      apiError?.message ||
      error?.message ||
      "An unexpected error occurred."
    console.log(`[${menuName}]`, error)
    setError({ menuName, errorMessage, title })
    throw error
  }
};
