import PropTypes from "prop-types";
import { v4 } from "uuid";
import { memo } from "react";
import CommentCard from "./CommentCard";
import * as css from "../styles/Comments.module.css";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  comments: PropTypes.instanceOf(Array).isRequired,
  setComments: PropTypes.func.isRequired,
  fileId: PropTypes.string,
  postId: PropTypes.string
};

const defaultProps = {
  fileId: "",
  postId: "",
};

function Comments({ ownerId, comments, setComments, fileId, postId }) {
  return comments ? (
    <div className={css.Comments}>
      {comments.map((comment) => (
        <CommentCard
          key={v4()}
          ownerId={ownerId}
          comments={comments}
          setComments={setComments}
          fileId={fileId}
          postId={postId}
          commentId={comment._id}
        />
      ))}
    </div>
  ) : null;
}

Comments.propTypes = propTypes;
Comments.defaultProps = defaultProps;

export default memo(Comments);
