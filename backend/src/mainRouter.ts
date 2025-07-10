import { Hono } from "hono";
import { UserRouter } from "./Routes/user";
import { BlogRouter } from "./Routes/blog";
import { authMiddleWare } from "./middleware/authMiddleWare";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
export const mainRouter = new Hono<{
  Bindings: {
    MY_SECRET: string;
    DATABASE_URL: string;
    ENVIRONMENT:string,
    AWS_ACCESS_KEY_ID:string,
    AWS_SECRET_ACCESS_KEY:string,
    AWS_BUCKET_NAME:string
  };
  Variables: {
    userId: string;
    prisma: any;
  };
}>();
mainRouter.route("/user", UserRouter);

mainRouter.route("/blog", BlogRouter);
// create a presigned url
mainRouter.get('/presigned',authMiddleWare,async (ctx)=>{
  const s3 = new S3Client({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: ctx.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: ctx.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const fileType = ctx.req.query('type') || 'image/jpeg';
  
  const extension = fileType.split('/')[1];
  const key = `blog-images/${uuidv4()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: ctx.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
    ACL: 'public-read',
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return ctx.json({
    url,                    // Presigned PUT URL
    publicUrl: `https://${ctx.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`, 
  });
})
mainRouter.post('/removeImages',authMiddleWare,async (ctx)=>{
  const s3 = new S3Client({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: ctx.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: ctx.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const urls = await ctx.req.json() || []
  
  for (const url of urls) {
    try {
      await removeImages(ctx, url, s3);
    } catch (error) {
    }
  }
  return ctx.json({
    message:'successfully deleted!'
  })
})
mainRouter.get('/me',authMiddleWare,async(ctx)=>{
  const userid = ctx.get('userId')
  const prisma = ctx.get('prisma')
  
  //get user details
   try {
    const userDetails = await prisma.user.findUnique({
      where:{
        id:userid
      },
      select:{
        name:true,
        email:true,
        id:true
      }
    })
    ctx.status(200);
    return ctx.json({
      userDetails
    })
   } catch (error) {
    
      ctx.status(500);
      return ctx.json({
        message:'something happend at the server!'
      })
   }
})
const removeImages = async (ctx,url:string,s3:S3Client)=>{
    const key = extractKey(ctx,url) || "";
    
    if (!key) {
       return ctx.send('')
    }
  
    const command = new DeleteObjectCommand({
      Bucket: ctx.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    
    try {
      await s3.send(command);
    } catch (err) {
      console.error(err);
      return ctx.json({ error: 'Failed to delete from S3' }, 500);
    }
}
const extractKey = (ctx,url:string)=>{
  
  const baseUrl = `https://${ctx.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`;
  return url.startsWith(baseUrl) ? url.slice(baseUrl.length) : null;
}