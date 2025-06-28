

interface FullBlogProps {
  htmlContent: string;
  id: string;
}
export const FullBlog = (props: FullBlogProps) => {
  // console.log(props.content);
  
  return (
     <div>
      {props.htmlContent.length !== 0 ? <div dangerouslySetInnerHTML={{ __html: props.htmlContent }}></div> : null}
     </div>
  );
};
