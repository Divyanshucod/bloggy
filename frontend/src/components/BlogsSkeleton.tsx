import { Skeleton, Stack } from "@mui/material";

export const BlogsSkeleton = () => {
  return (
    <div className=" w-screen p-4 flex justify-center cursor-pointer">
      <div className=" w-3xl">
        <div className="mt-12">
          <Stack spacing={1}>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={60} />
            <Skeleton variant="rounded" width={210} height={60} />
          </Stack>
        </div>
      </div>
    </div>
  );
};
