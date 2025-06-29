import { useNavigate } from "react-router-dom";


interface FullBlogProps {
  htmlContent: string;
  id: string;
}
export const FullBlog = (props: FullBlogProps) => {
  // console.log(props.content);
  const navigate = useNavigate()
  return (
     <div>
      <button onClick={ () => navigate(`/blog/update/${props.id}`)}>Edit</button>
      {props.htmlContent.length !== 0 ? <div dangerouslySetInnerHTML={{ __html: props.htmlContent }}></div> : null}
     </div>
  );
};
