import {appRouter} from "@/server";
import {fetchRequestHandler} from "@trpc/server/adapters/fetch";

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
    onError({error}) {
      console.error('Error:', error);
      return {
        message: error.message,
        status: error.code
      }
    }
  });
  return response;
};

export {handler as GET, handler as POST, handler as PUT, handler as DELETE};
