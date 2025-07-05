export const Avatar = ({ user }:{ user: string }) => {
  return (
    <div className="relative inline-flex items-center group justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 cursor-pointer">
      <span className="font-medium text-gray-600 dark:text-gray-300">
        {user[0]}
      </span>
    </div>
  );
};
