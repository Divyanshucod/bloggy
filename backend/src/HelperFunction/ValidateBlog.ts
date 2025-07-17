export const ValidateBlogId = async (postId:string,prisma:any)=>{
      try {
        const blog = await prisma.post.findFirst({
            where:{
              id:postId
            }
          })
          if(!blog){
             throw new Error("Blog doesn't exists!")
          }
          return blog;
      } catch (error) {
        console.log('error thrown');
         throw error
      }
}
export const HandleCatchErrors = (error:any,ctx:any)=>{
    if (error.message === "Blog doesn't exists!") {
        ctx.status(404);
       return ctx.json({ message: error.message });
      } else {
        ctx.status(500);
        return ctx.json({ message: "Something went wrong on server" });
      }
}