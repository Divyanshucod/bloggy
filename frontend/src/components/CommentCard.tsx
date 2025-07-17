export const CommentCard = ()=>{
    return  <div className="w-full min-h-40 bg-white dark:bg-slate-700 rounded-lg shadow-sm p-5  border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold text-lg">
        D
      </div>
      <div className="text-gray-900 dark:text-white font-semibold text-xl">
        Dev
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
      Very good blog, thanks for sharing this, i learned a lot.
    </p>
  </div>
}